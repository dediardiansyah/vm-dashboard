import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { PAYMENT_STATUS } from "@/lib/midtrans";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const where = {
      ...(status && status !== "all" ? { paymentStatus: status } : {}),
      ...(search
        ? {
            OR: [
              { transactionId: { contains: search, mode: "insensitive" } },
              { machine: { name: { contains: search, mode: "insensitive" } } },
              { parfume: { name: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {}),
    };

    const [transactions, total] = await Promise.all([
      db.transaction.findMany({
        where: {
          ...(status && status !== "all" ? { paymentStatus: status } : {}),
          ...(search
            ? {
                OR: [
                  { transactionId: { contains: search, mode: "insensitive" } },
                  { machine: { name: { contains: search, mode: "insensitive" } } },
                  { parfume: { name: { contains: search, mode: "insensitive" } } },
                ],
              }
            : {}),
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          machine: true,
          parfume: true,
        },
      }),
      db.transaction.count({ where: { 
        ...(status && status !== "all" ? { paymentStatus: status } : {}),
        ...(search
          ? {
              OR: [
                { transactionId: { contains: search, mode: "insensitive" } },
                { machine: { name: { contains: search, mode: "insensitive" } } },
                { parfume: { name: { contains: search, mode: "insensitive" } } },
              ],
            }
          : {}),
      } }),
    ]);

    return NextResponse.json({
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[TRANSACTIONS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// Webhook endpoint for Midtrans notifications
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { 
      order_id,
      transaction_status,
      payment_type,
      transaction_time,
      va_numbers,
      qr_code_url,
      deeplink_url,
    } = body;

    // Map Midtrans status to our status
    let paymentStatus;
    switch (transaction_status) {
      case "capture":
      case "settlement":
        paymentStatus = PAYMENT_STATUS.SUCCESS;
        break;
      case "deny":
      case "cancel":
      case "failure":
        paymentStatus = PAYMENT_STATUS.FAILED;
        break;
      case "expire":
        paymentStatus = PAYMENT_STATUS.EXPIRED;
        break;
      default:
        paymentStatus = PAYMENT_STATUS.PENDING;
    }

    // Update transaction in database
    await db.transaction.update({
      where: { transactionId: order_id },
      data: {
        paymentStatus,
        paymentDetails: body,
        ...(paymentStatus === PAYMENT_STATUS.SUCCESS ? { paidAt: new Date(transaction_time) } : {}),
        ...(va_numbers?.[0]?.va_number ? { vaNumber: va_numbers[0].va_number } : {}),
        ...(qr_code_url ? { qrCode: qr_code_url } : {}),
        ...(deeplink_url ? { deepLinkUrl: deeplink_url } : {}),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TRANSACTIONS_WEBHOOK]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 
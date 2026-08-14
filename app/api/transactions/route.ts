import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import { snap } from "@/lib/midtrans";
import { PAYMENT_STATUS } from "@/lib/midtrans";
import { generateQRCode } from "@/lib/xendit";

const createTransactionSchema = z.object({
  machineId: z.number(),
  parfumeId: z.number(),
  amount: z.number(),
  paymentMethod: z.enum(['QRIS'])
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { machineId, parfumeId, amount, paymentMethod } = createTransactionSchema.parse(body);

    // Create transaction in database first
    const transaction = await db.transaction.create({
      data: {
        transactionId: `TRX-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        machineId,
        parfumeId,
        amount,
        paymentMethod,
        paymentStatus: PAYMENT_STATUS.PENDING,
      },
      include: {
        machine: true,
        parfume: true,
      },
    });

    // Handle payment based on selected method
    if (paymentMethod === 'QRIS') {
      // Generate Xendit QR Code
      const qrResponse = await generateQRCode({
        amount: transaction.amount,
        metadata: {
          transactionId: transaction.transactionId,
          machineId: transaction.machineId,
          parfumeId: transaction.parfumeId,
        },
      });

      // Update transaction with QR details
      await db.transaction.update({
        where: { id: transaction.id },
        data: {
          paymentDetails: JSON.parse(JSON.stringify(qrResponse)), // Convert to plain object
          qrCode: qrResponse.qr_string,
        },
      });

      return NextResponse.json({
        transaction: {
          ...transaction,
          qrCode: qrResponse.qr_string,
        },
        qr_details: qrResponse,
      });
    } else {
      // Fallback to Midtrans
      const midtransTransaction = await snap.createTransaction({
        transaction_details: {
          order_id: transaction.transactionId,
          gross_amount: transaction.amount,
        },
        credit_card: {
          secure: true,
        },
        item_details: [
          {
            id: transaction.parfume.id.toString(),
            price: transaction.amount,
            quantity: 1,
            name: `${transaction.parfume.name} at ${transaction.machine.name}`,
          },
        ],
      });

      return NextResponse.json({
        transaction,
        token: midtransTransaction.token,
        redirect_url: midtransTransaction.redirect_url,
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 });
    }

    console.error("[TRANSACTIONS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/lib/db";
import { XENDIT_PAYMENT_STATUS, XenditPaymentStatus } from "@/lib/xendit";

// External Socket Server URL
const SOCKET_SERVER_URL = "https://dengansenanghati.xyz/hmns-socket";

// Xendit callback schema
const xenditCallbackSchema = z.object({
  event: z.string(),
  business_id: z.string(),
  data: z.object({
    id: z.string(),
    reference_id: z.string(),
    status: z.string(),
    currency: z.string(),
    amount: z.number(),
    metadata: z.object({
      transactionId: z.string(),
      machineId: z.number().optional(),
      parfumeId: z.number().optional(),
    }).optional(),
    payment_detail: z.object({
      source: z.string().nullable(),
      receipt_id: z.string().nullable(),
      name: z.string().nullable(),
      customer_pan: z.string().nullable(),
      merchant_pan: z.string().nullable(),
      account_details: z.any().nullable(),
    }).optional(),
  }),
  api_version: z.string(),
});

// Map Xendit status to our internal status
const PAYMENT_STATUS = {
  SUCCESS: "SUCCESS",
  PENDING: "PENDING",
  FAILED: "FAILED",
  EXPIRED: "EXPIRED",
} as const;

function mapXenditStatus(status: XenditPaymentStatus): string {
  switch (status) {
    case XENDIT_PAYMENT_STATUS.COMPLETED:
    case "SUCCEEDED":
      return PAYMENT_STATUS.SUCCESS;
    case XENDIT_PAYMENT_STATUS.EXPIRED:
      return PAYMENT_STATUS.EXPIRED;
    case XENDIT_PAYMENT_STATUS.FAILED:
      return PAYMENT_STATUS.FAILED;
    default:
      return PAYMENT_STATUS.PENDING;
  }
}

// Helper function to emit socket event
async function emitSocket(event: string, data: any) {
  try {
    const res = await fetch(`${SOCKET_SERVER_URL}/emit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event, data }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[SOCKET_EMIT_ERROR] Response error: ${errorText}`);
    }
  } catch (error) {
    console.error('[SOCKET_EMIT_ERROR]', error);
  }
}

export async function POST(req: Request) {
  try {
    // ✅ Fix: headers() must be awaited
    const headersList = await headers();
    const callbackToken = headersList.get("x-callback-token");

    // Uncomment this if you want to validate token
    // if (callbackToken !== process.env.XENDIT_CALLBACK_TOKEN) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    const body = await req.json();
    const payload = xenditCallbackSchema.parse(body);

    // Get transaction ID from metadata or reference_id
    const transactionId = payload.data.metadata?.transactionId || payload.data.reference_id;
    const paymentStatus = mapXenditStatus(payload.data.status as XenditPaymentStatus);

    // Update transaction status in database
    await db.transaction.update({
      where: { transactionId },
      data: {
        paymentStatus,
        paymentDetails: payload.data,
        paymentSource: payload.data.payment_detail?.source || null,
        ...(paymentStatus === PAYMENT_STATUS.SUCCESS ? {
          paidAt: new Date(),
        } : {}),
      },
    });

    console.log('hehe')
    console.log(paymentStatus)

    console.log(payload.data)

    // Emit socket event to external server
    try {
      switch (paymentStatus) {
        case PAYMENT_STATUS.SUCCESS:
          console.log('success bossss')
          await emitSocket('paymentSuccess', {
            qrId: payload.data.id,
            transactionId,
            amount: payload.data.amount,
          });
          break;
        case PAYMENT_STATUS.PENDING:
          await emitSocket('paymentPending', {
            qrId: payload.data.id,
            message: 'Payment is being processed',
          });
          break;
        case PAYMENT_STATUS.EXPIRED:
          await emitSocket('paymentExpired', {
            qrId: payload.data.id,
            message: 'Payment has expired',
          });
          break;
        case PAYMENT_STATUS.FAILED:
          await emitSocket('paymentFailed', {
            qrId: payload.data.id,
            message: 'Payment failed',
          });
          break;
      }
    } catch (error) {
      console.error('[SOCKET_EMIT_ERROR]', error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[XENDIT_WEBHOOK] Zod validation error", error);
      return new NextResponse("Invalid webhook payload", { status: 422 });
    }

    console.error("[XENDIT_WEBHOOK] Internal server error", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

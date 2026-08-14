import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import { xenditClient } from "@/lib/xendit";

// Define the type for payment details
interface PaymentDetails {
  id: string;
  [key: string]: any;
}

// Schema for the request
const checkStatusSchema = z.object({
  transactionId: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transactionId } = checkStatusSchema.parse(body);

    // First check if we have this transaction in our database
    const transaction = await db.transaction.findFirst({
      where: {
        transactionId: transactionId,
      },
    });

    if (!transaction) {
      return NextResponse.json({ 
        success: false, 
        message: "Transaction not found" 
      }, { status: 404 });
    }

    // If transaction is already marked as paid, return success
    if (transaction.paymentStatus === "SUCCESS") {
      return NextResponse.json({
        success: true,
        status: "SUCCESS",
        message: "Payment successful",
        transactionId: transaction.transactionId,
        amount: transaction.amount,
      });
    }

    // If transaction is marked as failed or expired, return that status
    if (transaction.paymentStatus === "FAILED" || transaction.paymentStatus === "EXPIRED") {
      return NextResponse.json({
        success: false,
        status: transaction.paymentStatus,
        message: `Payment ${transaction.paymentStatus.toLowerCase()}`,
        transactionId: transaction.transactionId,
      });
    }

    // Get the qrId from paymentDetails
    const paymentDetails = transaction.paymentDetails as PaymentDetails | null;
    const qrId = paymentDetails?.id;
    
    if (!qrId) {
      return NextResponse.json({
        success: false,
        status: "ERROR",
        message: "QR ID not found in transaction details",
        transactionId: transaction.transactionId,
      }, { status: 400 });
    }

    // Otherwise, check with Xendit API
    try {
      const response = await xenditClient.get(`/qr_codes/${qrId}`);
      const xenditData = response.data;

      // Map Xendit status to our internal status
      let status = "PENDING";
      if (xenditData.status === "COMPLETED" || xenditData.status === "SUCCEEDED") {
        status = "SUCCESS";
      } else if (xenditData.status === "EXPIRED") {
        status = "EXPIRED";
      } else if (xenditData.status === "FAILED") {
        status = "FAILED";
      }

      // Update transaction status in database if it has changed
      if (status !== transaction.paymentStatus) {
        await db.transaction.update({
          where: { id: transaction.id },
          data: {
            paymentStatus: status,
            paymentDetails: xenditData,
            ...(status === "SUCCESS" ? { paidAt: new Date() } : {}),
          },
        });
      }

      return NextResponse.json({
        success: status === "SUCCESS",
        status,
        message: status === "SUCCESS" ? "Payment successful" : `Payment ${status.toLowerCase()}`,
        transactionId: transaction.transactionId,
        amount: transaction.amount,
      });
    } catch (error) {
      console.error("[XENDIT_CHECK_STATUS]", error);
      return NextResponse.json({
        success: false,
        status: "ERROR",
        message: "Error checking payment status with Xendit",
        transactionId: transaction.transactionId,
      }, { status: 500 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 });
    }

    console.error("[CHECK_PAYMENT_STATUS]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 
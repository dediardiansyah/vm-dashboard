import { NextResponse } from "next/server";
import { xenditClient } from "@/lib/xendit";
import { z } from "zod";

// Schema for request validation
const simulatePaymentSchema = z.object({
  amount: z.number().min(1).default(5000),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Ensure params.id exists
    if (!id) {
      return NextResponse.json(
        { code: 400, status: "QR ID is required" },
        { status: 400 }
      );
    }
    const qrId = id;

    // Handle empty body by using default values
    let body = { amount: 5000 };
    
    // Only try to parse body if content-length header exists
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 0) {
      try {
        body = await req.json();
      } catch (error) {
        return NextResponse.json(
          { code: 400, status: "Invalid JSON payload" },
          { status: 400 }
        );
      }
    }

    // Validate the request body
    const validatedData = simulatePaymentSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { 
          code: 400, 
          status: "Invalid request data",
          errors: validatedData.error.errors 
        },
        { status: 400 }
      );
    }

    const { amount } = validatedData.data;

    const response = await xenditClient.post(
      `/qr_codes/${qrId}/payments/simulate`,
      {
        amount,
      }
    );

    return NextResponse.json({
      code: 200,
      status: "Payment Success",
      data: response.data,
    });
  } catch (error: any) {
    console.error("[XENDIT_SIMULATE_PAYMENT]", error.response?.data || error);
    
    return NextResponse.json(
      {
        code: 500,
        status: error.response?.data?.errors?.[0]?.message || "Simulation failed",
      },
      { status: 500 }
    );
  }
} 
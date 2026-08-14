import axios from 'axios';

// Xendit payment status mapping
export const XENDIT_PAYMENT_STATUS = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  COMPLETED: 'COMPLETED',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
} as const;

export type XenditPaymentStatus = typeof XENDIT_PAYMENT_STATUS[keyof typeof XENDIT_PAYMENT_STATUS];

// Xendit QR response type
export interface XenditQRResponse {
  id: string;
  reference_id: string;
  status: XenditPaymentStatus;
  currency: string;
  amount: number;
  qr_string: string;
  callback_url: string;
  type: string;
  expires_at: string;
  created: string;
  updated: string;
  metadata?: Record<string, any>;
}

// Xendit configuration
const XENDIT_API_KEY = process.env.XENDIT_API_KEY;
const XENDIT_API_VERSION = '2022-07-31';
const XENDIT_BASE_URL = 'https://api.xendit.co';

// if (!XENDIT_API_KEY) {
//   throw new Error('XENDIT_API_KEY is not defined in environment variables');
// }

// Create base64 encoded authorization
const XENDIT_AUTH = Buffer.from(XENDIT_API_KEY + ':').toString('base64');

// Create Xendit API client
export const xenditClient = axios.create({
  baseURL: XENDIT_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'api-version': XENDIT_API_VERSION,
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': `Basic ${XENDIT_AUTH}`,
  },
});

// Helper function to generate QR code
export async function generateQRCode({
  amount,
  metadata,
  expiryMinutes = 30,
}: {
  amount: number;
  metadata?: Record<string, any>;
  expiryMinutes?: number;
}): Promise<XenditQRResponse> {
  const reference_id = `QR-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const expires_at = new Date(Date.now() + expiryMinutes * 60000).toISOString();

  try {
    const response = await xenditClient.post<XenditQRResponse>('/qr_codes', {
      reference_id,
      type: 'DYNAMIC',
      currency: 'IDR',
      amount,
      expires_at,
      metadata,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/xendit/callback`,
    });

    return response.data;
  } catch (error) {
    console.error('[XENDIT_GENERATE_QR]', error);
    // json stringify error
    throw error;
  }
} 
'use client';

import { useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import { SOCKET_EVENTS, ServerToClientEvents, ClientToServerEvents } from '@/lib/socket';
import { cn } from '@/lib/utils';

interface PaymentQRProps {
  amount: number;
  parfumeName: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function PaymentQR({ amount, parfumeName, onSuccess, onError }: PaymentQRProps) {
  const [qrId, setQrId] = useState<string>('');
  const [qrCode, setQrCode] = useState<string>('');
  const [status, setStatus] = useState<{
    message: string;
    type: 'info' | 'error' | 'success' | 'warning';
  }>({
    message: 'Generating QR Code...',
    type: 'info',
  });

  useEffect(() => {
    // Initialize socket connection
    const socket = io(
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      {
        path: '/api/socket',
        transports: ['websocket'],
      }
    );

    // Connect event handler
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    // Disconnect event handler
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setStatus({
        message: 'Connection lost. Please refresh the page.',
        type: 'error',
      });
    });

    // Payment status event handlers
    socket.on(SOCKET_EVENTS.PAYMENT_SUCCESS, (data: { qrId: string }) => {
      if (data.qrId === qrId) {
        setStatus({
          message: 'Payment successful! Redirecting...',
          type: 'success',
        });
        onSuccess?.();
      }
    });

    socket.on(SOCKET_EVENTS.PAYMENT_PENDING, (data: { qrId: string, message: string }) => {
      if (data.qrId === qrId) {
        setStatus({
          message: data.message,
          type: 'warning',
        });
      }
    });

    socket.on(SOCKET_EVENTS.PAYMENT_EXPIRED, (data: { qrId: string, message: string }) => {
      if (data.qrId === qrId) {
        setStatus({
          message: data.message,
          type: 'error',
        });
        onError?.(data.message);
      }
    });

    socket.on(SOCKET_EVENTS.PAYMENT_FAILED, (data: { qrId: string, message: string }) => {
      if (data.qrId === qrId) {
        setStatus({
          message: data.message,
          type: 'error',
        });
        onError?.(data.message);
      }
    });

    // Generate QR code
    generateQR();

    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, [qrId, onSuccess, onError]);

  const generateQR = async () => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          paymentMethod: 'QRIS',
          metadata: {
            parfumeName,
          },
        }),
      });

      const data = await response.json();

      if (data.qrCode) {
        setQrId(data.transaction.id);
        setQrCode(data.qrCode);
        setStatus({
          message: 'Please scan the QR code to pay',
          type: 'info',
        });
      } else {
        throw new Error('Failed to generate QR code');
      }
    } catch (error) {
      setStatus({
        message: 'Failed to generate QR code. Please try again.',
        type: 'error',
      });
      onError?.('Failed to generate QR code');
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold">
        Scan and Pay {new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        }).format(amount)}
      </h1>

      <div
        className={cn(
          'mb-2 px-4 py-2 rounded-lg text-sm',
          {
            'bg-blue-100 text-blue-800': status.type === 'info',
            'bg-red-100 text-red-800': status.type === 'error',
            'bg-green-100 text-green-800': status.type === 'success',
            'bg-yellow-100 text-yellow-800': status.type === 'warning',
          }
        )}
      >
        {status.message}
      </div>

      <div className="bg-gray-50 p-4 rounded-3xl flex justify-center items-center shadow-lg" style={{ height: 260, width: 260 }}>
        {qrCode ? (
          <img
            src={qrCode}
            alt="Payment QR Code"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
            <div className="text-lg text-gray-700">Preparing QR Code...</div>
          </div>
        )}
      </div>

      <p className="text-base text-gray-700 max-w-md px-4 text-center">
        You have selected {parfumeName} and will receive 3 sprays of this fragrance.
      </p>

      <div className="text-lg font-bold">
        Waiting for payment
        <span className="dots animate-[dots_1.5s_ease-in-out_infinite]">...</span>
      </div>
    </div>
  );
}

// Add this to your globals.css or as a style tag
const dotsAnimation = `
@keyframes dots {
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60%, 100% { content: '...'; }
}
.dots::after {
  content: '';
  animation: dots 1.5s ease-in-out infinite;
}
`; 
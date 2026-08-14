import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import type { Socket as NodeSocket } from 'net';
import type { NextApiResponse } from 'next';
import { z } from 'zod';

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  PAYMENT_STATUS: 'paymentStatus',
  REGISTER_PAYMENT: 'registerPayment',
  PAYMENT_SUCCESS: 'paymentSuccess',
  PAYMENT_PENDING: 'paymentPending',
  PAYMENT_EXPIRED: 'paymentExpired',
  PAYMENT_FAILED: 'paymentFailed',
} as const;

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED';

export interface ServerToClientEvents {
  [SOCKET_EVENTS.PAYMENT_STATUS]: (data: { 
    qrId: string;
    status: PaymentStatus;
    message: string;
  }) => void;
  [SOCKET_EVENTS.PAYMENT_SUCCESS]: (data: { 
    qrId: string;
    transactionId: string;
    amount: number;
  }) => void;
  [SOCKET_EVENTS.PAYMENT_PENDING]: (data: { 
    qrId: string;
    message: string;
  }) => void;
  [SOCKET_EVENTS.PAYMENT_EXPIRED]: (data: { 
    qrId: string;
    message: string;
  }) => void;
  [SOCKET_EVENTS.PAYMENT_FAILED]: (data: { 
    qrId: string;
    message: string;
  }) => void;
}

export interface ClientToServerEvents {
  [SOCKET_EVENTS.REGISTER_PAYMENT]: (qrId: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  qrId: string;
}

let io: SocketIOServer | null = null;

export interface CustomNodeSocket extends NodeSocket {
  server: NetServer;
}

export interface ResponseWithSocket extends NextApiResponse {
  socket: CustomNodeSocket;
}

export const initSocket = (res: ResponseWithSocket) => {
  if (!io) {
    const httpServer = res.socket.server;
    io = new SocketIOServer<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on(SOCKET_EVENTS.CONNECT, (socket) => {
      console.log('Client connected:', socket.id);

      socket.on(SOCKET_EVENTS.REGISTER_PAYMENT, (qrId: string) => {
        socket.data.qrId = qrId;
        console.log('Payment registered for QR:', qrId);
      });

      socket.on(SOCKET_EVENTS.DISCONNECT, () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
}; 
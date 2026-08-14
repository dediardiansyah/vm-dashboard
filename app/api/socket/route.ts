import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { initSocket, ResponseWithSocket } from '@/lib/socket';

export async function GET(req: Request) {
  try {
    // For App Router, we need to handle WebSocket upgrade
    const headersList = await headers();
    const upgrade = headersList.get('upgrade');
    
    if (upgrade?.toLowerCase() !== 'websocket') {
      return new NextResponse('Expected Websocket', { status: 426 });
    }

    // Initialize socket server
    const res = new Response();
    initSocket(res as unknown as ResponseWithSocket);

    return new NextResponse('Socket initialized', { status: 101 });
  } catch (error) {
    console.error('[SOCKET_INIT_ERROR]', error);
    return new NextResponse('Failed to initialize socket', { status: 500 });
  }
} 
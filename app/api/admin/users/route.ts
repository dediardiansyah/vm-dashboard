import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createApiResponse, handleApiError, ApiError } from '@/lib/api-response';
import { API_ERRORS } from '@/lib/constants/errors';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        emailVerified: true,
      },
      orderBy: {
        id: 'desc'
      }
    });
    return NextResponse.json(createApiResponse(users));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const userData = await request.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new ApiError(
        API_ERRORS.USER.ALREADY_EXISTS,
        'User with this email already exists'
      );
    }

    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: userData.status,
        password: userData.password
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        emailVerified: true,
      }
    });

    return NextResponse.json(createApiResponse(user));
  } catch (error) {
    return handleApiError(error);
  }
}

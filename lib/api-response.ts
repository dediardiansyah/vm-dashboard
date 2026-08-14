import { NextResponse } from 'next/server'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    [key: string]: any
  }
}

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function createApiResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data
  }
}

export function createApiErrorResponse(error: ApiError): ApiResponse<never> {
  return {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      details: error.details
    }
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error)
  
  if (error instanceof ApiError) {
    return NextResponse.json(
      createApiErrorResponse(error),
      { status: getStatusCodeFromError(error.code) }
    )
  }

  return NextResponse.json(
    createApiErrorResponse(new ApiError('INTERNAL_SERVER_ERROR', 'An unexpected error occurred')),
    { status: 500 }
  )
}

function getStatusCodeFromError(code: string): number {
  const statusCodes: Record<string, number> = {
    'BAD_REQUEST': 400,
    'UNAUTHORIZED': 401,
    'FORBIDDEN': 403,
    'NOT_FOUND': 404,
    'VALIDATION_ERROR': 422,
    'INTERNAL_SERVER_ERROR': 500,
  }
  return statusCodes[code] || 500
}
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const isCmsPath = request.nextUrl.pathname.startsWith('/admin')
  const isAuthPath = request.nextUrl.pathname.startsWith('/admin/login')
  const isApiAuthPath = request.nextUrl.pathname.startsWith('/api/auth')
  const isApiAdminPath = request.nextUrl.pathname.startsWith('/api/admin')

  // Redirect to /admin/login if user visits the root URL
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }


  // Allow API auth routes
  if (isApiAuthPath) {
    return NextResponse.next()
  }

  // Protect API admin routes
  if (isApiAdminPath && (!token || token.user?.role !== 'ADMIN')) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }

  // Protect CMS routes
  if (isCmsPath && !isAuthPath) {
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check for admin role
    if (token.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Redirect authenticated admin users away from login
  if (isCmsPath && token && isAuthPath) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/auth/:path*', '/api/admin/:path*']
}
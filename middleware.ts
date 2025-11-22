// Middleware for route handling
// Ensures short codes don't conflict with app routes

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Reserved paths that should NOT be treated as short codes
const RESERVED_PATHS = [
  '/api',
  '/code',
  '/healthz',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip reserved paths - let them pass through normally
  for (const reserved of RESERVED_PATHS) {
    if (pathname.startsWith(reserved) || pathname === '/') {
      return NextResponse.next()
    }
  }

  // Check if path matches short code pattern (6-8 alphanumeric)
  // Remove leading slash and check
  const potentialCode = pathname.slice(1)
  
  if (/^[A-Za-z0-9]{6,8}$/.test(potentialCode)) {
    // This looks like a short code - let it go to the redirect handler
    return NextResponse.next()
  }

  // For other paths, continue normally
  return NextResponse.next()
}

// Configure which paths middleware runs on
export const config = {
  matcher: [
    // Match all paths except static files and images
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
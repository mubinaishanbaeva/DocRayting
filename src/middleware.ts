import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const path = request.nextUrl.pathname;

  // Paths that require auth
  const protectedPaths = [
    '/dashboard', 
    '/doctor/dashboard', 
    '/surgeon/dashboard', 
    '/admin',
    '/profile'
  ];

  const isProtectedPath = protectedPaths.some(p => path.startsWith(p));

  // If path is protected and no token, redirect to login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Optional: If trying to access /admin but role is not admin (hard to check fully in edge without JWT decode, 
  // but we can let the server action handle detailed check, or decode basic payload here if needed. 
  // For simplicity, let server component handle deep auth).
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/doctor/dashboard/:path*', '/surgeon/dashboard/:path*', '/admin/:path*', '/profile/:path*'],
};

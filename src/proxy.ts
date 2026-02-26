// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // ১. আলাদা আলাদা কুকি থেকে টোকেন সংগ্রহ করা
  const adminToken = request.cookies.get('admin_token')?.value;
  const clientToken = request.cookies.get('client_token')?.value;
  
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (!adminToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (pathname.startsWith('/client')) {
    if (!clientToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  

  return NextResponse.next();
}

// ৫. কনফিগারেশন
export const config = {
  matcher: [
    '/admin/:path*', 
    '/client/:path*', 
    '/login'
  ],
};
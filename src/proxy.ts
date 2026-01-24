import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ১. ফাংশনের নাম 'middleware' থেকে বদলে 'proxy' করতে হবে
export function proxy(request: NextRequest) {
  const token = request.cookies.get('vault_token')?.value;
  const role = request.cookies.get('user_role')?.value;
  const { pathname } = request.nextUrl;

  // 🛡️ Admin Route Protection
  if (pathname.startsWith('/admin')) {
    if (!token || role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 🛡️ Client Route Protection
  if (pathname.startsWith('/client')) {
    if (!token || role !== 'client') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// ২. কনফিগারেশনে 'matcher' আগের মতোই থাকবে
export const config = {
  matcher: ['/admin/:path*', '/client/:path*'],
};
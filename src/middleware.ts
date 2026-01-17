import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('vault_token')?.value;
  const role = request.cookies.get('user_role')?.value;

  const { pathname } = request.nextUrl;

  // 1. Admin Protect: Jodi login chara keu /admin-e jete chay
  if (pathname.startsWith('/admin')) {
    if (!token || role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 2. Client Protect: Jodi client portal-e login chara jete chay
  if (pathname.startsWith('/portal')) {
    if (!token || role !== 'client') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*'],
};
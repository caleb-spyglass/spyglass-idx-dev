import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function getSessionToken(): string {
  const password = process.env.ADMIN_PASSWORD ?? 'spyglass2026';
  return btoa(`${password}:spyglass-cms`);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page through without auth check
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('admin_session');
    const expectedToken = getSessionToken();

    if (!sessionCookie || sessionCookie.value !== expectedToken) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

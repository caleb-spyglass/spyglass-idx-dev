import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

function getSessionToken(): string {
  const password = process.env.ADMIN_PASSWORD ?? 'spyglass2026';
  return Buffer.from(`${password}:spyglass-cms`).toString('base64');
}

// POST /api/admin/auth — login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;
    const adminPassword = process.env.ADMIN_PASSWORD ?? 'spyglass2026';

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set('admin_session', getSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
  }
}

// DELETE /api/admin/auth — logout
export async function DELETE(_req: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  return NextResponse.redirect(new URL('/admin/login', _req.url));
}

// GET /api/admin/auth?action=logout — logout via link
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  if (url.searchParams.get('action') === 'logout') {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

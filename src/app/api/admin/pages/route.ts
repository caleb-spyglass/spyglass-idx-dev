import { NextRequest, NextResponse } from 'next/server';
import { getAllPages } from '@/lib/admin-db';

export async function GET(_req: NextRequest) {
  try {
    const pages = await getAllPages();
    return NextResponse.json({ pages });
  } catch (error) {
    console.error('List pages error:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

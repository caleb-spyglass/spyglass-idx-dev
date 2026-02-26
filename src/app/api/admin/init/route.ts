import { NextRequest, NextResponse } from 'next/server';
import { initCmsTables, seedPages, seedSettings } from '@/lib/admin-db';
import { revalidatePath } from 'next/cache';

export async function POST(_req: NextRequest) {
  try {
    await initCmsTables();
    await seedPages();
    await seedSettings();
    revalidatePath('/admin');
    return NextResponse.json({ success: true, message: 'CMS tables initialized and seeded.' });
  } catch (error) {
    console.error('Init CMS error:', error);
    return NextResponse.json({ error: 'Failed to initialize CMS tables' }, { status: 500 });
  }
}

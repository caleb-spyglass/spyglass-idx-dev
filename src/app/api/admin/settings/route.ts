import { NextRequest, NextResponse } from 'next/server';
import { getAllSettings, saveAllSettings } from '@/lib/admin-db';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function GET(_req: NextRequest) {
  try {
    const settings = await getAllSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Body must be a key-value object' }, { status: 400 });
    }

    const settings: Record<string, string> = {};
    for (const [key, value] of Object.entries(body)) {
      settings[key] = String(value ?? '');
    }

    await saveAllSettings(settings);

    revalidatePath('/', 'layout');
    revalidatePath('/admin/settings');
    revalidateTag('cms-settings');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save settings error:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}

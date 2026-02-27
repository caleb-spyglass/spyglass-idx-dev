import { NextRequest, NextResponse } from 'next/server';
import { savePage, getPage } from '@/lib/admin-db';
import { revalidatePath, revalidateTag } from 'next/cache';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const dbSlug = slug === 'home' ? '/' : '/' + slug;
    const page = await getPage(dbSlug);
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    return NextResponse.json({ page });
  } catch (error) {
    console.error('Get page error:', error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const dbSlug = slug === 'home' ? '/' : '/' + slug;
    const body = await req.json();

    const page = await savePage(dbSlug, {
      title: body.title ?? '',
      content: body.content ?? {},
      meta_title: body.meta_title ?? '',
      meta_description: body.meta_description ?? '',
      is_published: body.is_published ?? true,
    });

    // Revalidate the frontend page
    const frontendPath = dbSlug === '/' ? '/' : dbSlug;
    revalidatePath(frontendPath);
    revalidatePath('/admin/pages');
    revalidateTag('cms-page', 'default');

    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error('Save page error:', error);
    return NextResponse.json({ error: 'Failed to save page' }, { status: 500 });
  }
}

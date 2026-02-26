import { NextRequest, NextResponse } from 'next/server';
import { getBlogPosts, saveBlogPost } from '@/lib/admin-db';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function GET(_req: NextRequest) {
  try {
    const posts = await getBlogPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('List blog posts error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.slug || !body.title) {
      return NextResponse.json({ error: 'slug and title are required' }, { status: 400 });
    }

    const post = await saveBlogPost({
      id: body.id,
      slug: body.slug,
      title: body.title,
      content: body.content ?? '',
      excerpt: body.excerpt ?? '',
      featured_image: body.featured_image ?? '',
      author: body.author ?? '',
      category: body.category ?? '',
      tags: body.tags ?? [],
      is_published: body.is_published ?? false,
      published_at: body.published_at,
    });

    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath('/admin/blog');
    revalidateTag('cms-blog');

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Save blog post error:', error);
    return NextResponse.json({ error: 'Failed to save blog post' }, { status: 500 });
  }
}

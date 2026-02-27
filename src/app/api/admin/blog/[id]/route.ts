import { NextRequest, NextResponse } from 'next/server';
import { deleteBlogPost, getBlogPostById } from '@/lib/admin-db';
import { revalidatePath, revalidateTag } from 'next/cache';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const postId = parseInt(id, 10);

    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const post = await getBlogPostById(postId);
    const slug = post?.slug;

    await deleteBlogPost(postId);

    revalidatePath('/blog');
    if (slug) revalidatePath(`/blog/${slug}`);
    revalidatePath('/admin/blog');
    revalidateTag('cms-blog', 'default');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete blog post error:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}

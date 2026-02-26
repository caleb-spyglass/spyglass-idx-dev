'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath, revalidateTag } from 'next/cache';
import {
  savePage,
  saveBlogPost,
  deleteBlogPost,
  saveAllSettings,
  initCmsTables,
  seedPages,
  seedSettings,
} from '@/lib/admin-db';

function getSessionToken(): string {
  const password = process.env.ADMIN_PASSWORD ?? 'spyglass2026';
  return btoa(`${password}:spyglass-cms`);
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function loginAction(formData: FormData): Promise<void> {
  const password = formData.get('password') as string;
  const from = (formData.get('from') as string) || '/admin';

  const adminPassword = process.env.ADMIN_PASSWORD ?? 'spyglass2026';

  if (password !== adminPassword) {
    const params = new URLSearchParams({ error: '1', from });
    redirect(`/admin/login?${params.toString()}`);
  }

  const cookieStore = await cookies();
  cookieStore.set('admin_session', getSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect(from.startsWith('/admin') ? from : '/admin');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/admin/login');
}

export type ActionResult = { success: boolean; error?: string; slug?: string };

// ─── Init ─────────────────────────────────────────────────────────────────────

export async function initCmsAction(): Promise<void> {
  try {
    await initCmsTables();
    await seedPages();
    await seedSettings();
  } catch (e) {
    console.error('initCmsAction error:', e);
  }
  revalidatePath('/admin');
}

// ─── Pages ────────────────────────────────────────────────────────────────────

export async function savePageAction(formData: FormData): Promise<ActionResult> {
  const slug = formData.get('slug') as string;
  const title = formData.get('title') as string;
  const metaTitle = formData.get('meta_title') as string;
  const metaDescription = formData.get('meta_description') as string;
  const isPublished = formData.get('is_published') === 'true';
  const contentRaw = formData.get('content') as string;

  let content: Record<string, unknown> = {};
  try {
    content = JSON.parse(contentRaw || '{}');
  } catch {
    return { success: false, error: 'Invalid JSON in content field' };
  }

  try {
    await savePage(slug, {
      title,
      content,
      meta_title: metaTitle,
      meta_description: metaDescription,
      is_published: isPublished,
    });

    const frontendPath = slug === '/' ? '/' : slug;
    revalidatePath(frontendPath);
    revalidatePath('/admin/pages');
    revalidateTag('cms-page');

    return { success: true };
  } catch (e) {
    console.error('savePageAction error:', e);
    return { success: false, error: 'Failed to save page' };
  }
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function saveBlogPostAction(formData: FormData): Promise<ActionResult> {
  const idRaw = formData.get('id') as string;
  const id = idRaw ? parseInt(idRaw, 10) : undefined;
  const slug = formData.get('slug') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string;
  const featuredImage = formData.get('featured_image') as string;
  const author = formData.get('author') as string;
  const category = formData.get('category') as string;
  const tagsRaw = formData.get('tags') as string;
  const isPublished = formData.get('is_published') === 'true';

  const tags = tagsRaw
    ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  try {
    const post = await saveBlogPost({
      id,
      slug,
      title,
      content,
      excerpt,
      featured_image: featuredImage,
      author,
      category,
      tags,
      is_published: isPublished,
    });

    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/admin/blog');
    revalidateTag('cms-blog');

    return { success: true, slug: post.slug };
  } catch (e) {
    console.error('saveBlogPostAction error:', e);
    return { success: false, error: 'Failed to save blog post' };
  }
}

export async function deleteBlogPostAction(id: number): Promise<ActionResult> {
  try {
    await deleteBlogPost(id);
    revalidatePath('/blog');
    revalidatePath('/admin/blog');
    revalidateTag('cms-blog');
    return { success: true };
  } catch (e) {
    console.error('deleteBlogPostAction error:', e);
    return { success: false, error: 'Failed to delete post' };
  }
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function saveSettingsAction(formData: FormData): Promise<ActionResult> {
  const settings: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      settings[key] = value;
    }
  }

  try {
    await saveAllSettings(settings);
    revalidatePath('/', 'layout');
    revalidatePath('/admin/settings');
    revalidateTag('cms-settings');
    return { success: true };
  } catch (e) {
    console.error('saveSettingsAction error:', e);
    return { success: false, error: 'Failed to save settings' };
  }
}

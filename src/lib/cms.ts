/**
 * Frontend CMS helpers
 * Provides graceful fallbacks when no CMS content exists.
 * Safe to call from any Server Component.
 */

export type PageContent = Record<string, unknown>;

export async function getPageContent(slug: string): Promise<PageContent> {
  try {
    const { getPage } = await import('./admin-db');
    const page = await getPage(slug);
    return (page?.content as PageContent) ?? {};
  } catch {
    return {};
  }
}

export async function getPageMeta(
  slug: string
): Promise<{ title?: string; description?: string }> {
  try {
    const { getPage } = await import('./admin-db');
    const page = await getPage(slug);
    if (!page) return {};
    return {
      title: page.meta_title || undefined,
      description: page.meta_description || undefined,
    };
  } catch {
    return {};
  }
}

export async function getPublishedBlogPosts() {
  try {
    const { getBlogPosts } = await import('./admin-db');
    const posts = await getBlogPosts();
    return posts.filter((p) => p.is_published);
  } catch {
    return [];
  }
}

export async function getPublishedBlogPost(slug: string) {
  try {
    const { getBlogPost } = await import('./admin-db');
    const post = await getBlogPost(slug);
    return post?.is_published ? post : null;
  } catch {
    return null;
  }
}

export async function getSiteSettings(): Promise<Record<string, unknown>> {
  try {
    const { getAllSettings } = await import('./admin-db');
    return await getAllSettings();
  } catch {
    return {};
  }
}

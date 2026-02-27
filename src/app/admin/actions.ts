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
    revalidateTag('cms-page', 'default');

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
    revalidateTag('cms-blog', 'default');

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
    revalidateTag('cms-blog', 'default');
    return { success: true };
  } catch (e) {
    console.error('deleteBlogPostAction error:', e);
    return { success: false, error: 'Failed to delete post' };
  }
}

// ─── Settings ─────────────────────────────────────────────────────────────────

// ─── Blog URL Import ──────────────────────────────────────────────────────────

export interface ImportResult {
  success: boolean;
  error?: string;
  data?: {
    title: string;
    metaDescription: string;
    canonicalUrl: string;
    featuredImage: string;
    excerpt: string;
    author: string;
    blocks: Array<{
      id: string;
      type: string;
      content: Record<string, unknown>;
    }>;
  };
}

export async function importBlogFromUrlAction(url: string): Promise<ImportResult> {
  try {
    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return { success: false, error: 'Invalid URL format' };
    }

    // Fetch the page — use a realistic browser User-Agent to avoid CDN/WAF blocks
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch URL: ${response.status} ${response.statusText}`,
      };
    }

    const html = await response.text();

    // Use cheerio to parse
    const cheerio = await import('cheerio');
    const $ = cheerio.load(html);

    // Extract metadata
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('title').text() ||
      $('h1').first().text() ||
      '';

    const metaDescription =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      '';

    const canonicalUrl =
      $('link[rel="canonical"]').attr('href') ||
      parsedUrl.toString();

    const featuredImage =
      $('meta[property="og:image"]').attr('content') ||
      '';

    // Try to find author
    const author =
      $('meta[name="author"]').attr('content') ||
      $('[class*="author"]').first().text().trim() ||
      $('[rel="author"]').first().text().trim() ||
      '';

    // Find the main content area (WordPress common selectors)
    const contentSelectors = [
      'article .entry-content',
      '.post-content',
      '.entry-content',
      'article .content',
      '.article-content',
      '.blog-content',
      'article',
      'main',
      '.post',
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let $content: any = $('body');
    for (const sel of contentSelectors) {
      const found = $(sel).first();
      if (found.length > 0 && found.text().trim().length > 100) {
        $content = found;
        break;
      }
    }

    // Parse DOM elements into blocks
    let blockCounter = 0;
    function genId() {
      blockCounter++;
      return `import-block-${Date.now()}-${blockCounter}`;
    }

    const blocks: Array<{
      id: string;
      type: string;
      content: Record<string, unknown>;
    }> = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $content.children().each((_i: any, el: any) => {
      const $el = $(el);
      const tagName = el.tagName?.toLowerCase() as string;

      // Skip script, style, nav, header, footer, aside
      if (['script', 'style', 'nav', 'header', 'footer', 'aside', 'form'].includes(tagName)) {
        return;
      }

      // Headings
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
        const text = $el.text().trim();
        if (text) {
          // Downshift h1 to h2 since title is the h1
          const level = tagName === 'h1' ? 'h2' : tagName;
          blocks.push({
            id: genId(),
            type: 'heading',
            content: { text, level },
          });
        }
        return;
      }

      // Images
      if (tagName === 'img') {
        const src = $el.attr('src') || '';
        const alt = $el.attr('alt') || '';
        if (src) {
          blocks.push({
            id: genId(),
            type: 'image',
            content: { src, alt, caption: '' },
          });
        }
        return;
      }

      // Figure (image with caption)
      if (tagName === 'figure') {
        const $img = $el.find('img').first();
        const src = $img.attr('src') || '';
        const alt = $img.attr('alt') || '';
        const caption = $el.find('figcaption').text().trim();
        if (src) {
          blocks.push({
            id: genId(),
            type: 'image',
            content: { src, alt, caption },
          });
        }
        return;
      }

      // Blockquote
      if (tagName === 'blockquote') {
        const text = $el.text().trim();
        const cite = $el.find('cite').text().trim();
        if (text) {
          blocks.push({
            id: genId(),
            type: 'quote',
            content: {
              text: cite ? text.replace(cite, '').trim() : text,
              citation: cite,
            },
          });
        }
        return;
      }

      // Horizontal rule
      if (tagName === 'hr') {
        blocks.push({
          id: genId(),
          type: 'divider',
          content: { style: 'solid' },
        });
        return;
      }

      // Unordered/ordered lists
      if (tagName === 'ul' || tagName === 'ol') {
        const html = $.html(el);
        if (html) {
          blocks.push({
            id: genId(),
            type: 'text',
            content: { html },
          });
        }
        return;
      }

      // Paragraphs and divs
      if (tagName === 'p' || tagName === 'div') {
        // Check if it contains an image
        const $img = $el.find('img').first();
        if ($img.length > 0) {
          const src = $img.attr('src') || '';
          const alt = $img.attr('alt') || '';
          if (src) {
            blocks.push({
              id: genId(),
              type: 'image',
              content: { src, alt, caption: '' },
            });
          }
          // Also add remaining text if any
          const remainingText = $el.clone().find('img').remove().end().text().trim();
          if (remainingText) {
            blocks.push({
              id: genId(),
              type: 'text',
              content: { html: `<p>${remainingText}</p>` },
            });
          }
          return;
        }

        // Check for embedded video (iframe)
        const $iframe = $el.find('iframe').first();
        if ($iframe.length > 0) {
          const videoSrc = $iframe.attr('src') || '';
          if (videoSrc) {
            blocks.push({
              id: genId(),
              type: 'video',
              content: { url: videoSrc, provider: 'youtube' },
            });
          }
          return;
        }

        // Regular paragraph
        const innerHtml = $.html(el);
        const text = $el.text().trim();
        if (text) {
          blocks.push({
            id: genId(),
            type: 'text',
            content: { html: innerHtml || `<p>${text}</p>` },
          });
        }
        return;
      }

      // Iframe (video embed)
      if (tagName === 'iframe') {
        const src = $el.attr('src') || '';
        if (src) {
          blocks.push({
            id: genId(),
            type: 'video',
            content: { url: src, provider: 'youtube' },
          });
        }
        return;
      }

      // Catch-all: if there's text, make it a text block
      const text = $el.text().trim();
      if (text && text.length > 10) {
        const innerHtml = $.html(el);
        blocks.push({
          id: genId(),
          type: 'text',
          content: { html: innerHtml || `<p>${text}</p>` },
        });
      }
    });

    // Generate excerpt from first text block
    const firstTextBlock = blocks.find((b) => b.type === 'text');
    const excerpt = firstTextBlock
      ? (firstTextBlock.content.html as string)
          .replace(/<[^>]*>/g, '')
          .slice(0, 200)
          .trim()
      : metaDescription;

    return {
      success: true,
      data: {
        title: title.trim(),
        metaDescription: metaDescription.trim(),
        canonicalUrl,
        featuredImage,
        excerpt,
        author: author.trim(),
        blocks,
      },
    };
  } catch (e) {
    console.error('importBlogFromUrlAction error:', e);
    return {
      success: false,
      error: `Import failed: ${e instanceof Error ? e.message : 'Unknown error'}`,
    };
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
    revalidateTag('cms-settings', 'default');
    return { success: true };
  } catch (e) {
    console.error('saveSettingsAction error:', e);
    return { success: false, error: 'Failed to save settings' };
  }
}

/**
 * CMS Admin Database Functions
 * Manages cms_pages, cms_blog_posts, and cms_site_settings tables
 */

import { query } from './database';

export interface CmsPage {
  id: number;
  slug: string;
  title: string;
  content: Record<string, unknown>;
  meta_title: string;
  meta_description: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CmsBlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image: string;
  author: string;
  category: string;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CmsSiteSetting {
  id: number;
  key: string;
  value: Record<string, unknown> | string | number | boolean;
  updated_at: string;
}

const FRONTEND_PAGES = [
  { slug: '/', title: 'Home' },
  { slug: '/about', title: 'About' },
  { slug: '/blog', title: 'Blog' },
  { slug: '/buy', title: 'Buy' },
  { slug: '/sell', title: 'Sell' },
  { slug: '/cash-offer', title: 'Cash Offer' },
  { slug: '/commercial', title: 'Commercial' },
  { slug: '/communities', title: 'Communities' },
  { slug: '/contact', title: 'Contact' },
  { slug: '/relocation', title: 'Relocation' },
  { slug: '/reviews', title: 'Reviews' },
  { slug: '/services', title: 'Services' },
  { slug: '/home-staging', title: 'Home Staging' },
  { slug: '/home-value', title: 'Home Value' },
  { slug: '/agents', title: 'Agents' },
  { slug: '/featured-listings', title: 'Featured Listings' },
  { slug: '/mortgage-calculator', title: 'Mortgage Calculator' },
  { slug: '/favorites', title: 'Favorites' },
  { slug: '/saved-searches', title: 'Saved Searches' },
  { slug: '/zip-codes', title: 'Zip Codes' },
];

const DEFAULT_SETTINGS = [
  { key: 'company_name', value: 'Spyglass Realty' },
  { key: 'phone', value: '(512) 623-4900' },
  { key: 'email', value: 'info@spyglassrealty.com' },
  { key: 'address', value: '7000 N MoPac Expy, Suite 200, Austin, TX 78731' },
  { key: 'facebook_url', value: 'https://facebook.com/spyglassrealty' },
  { key: 'instagram_url', value: 'https://instagram.com/spyglassrealty' },
  { key: 'youtube_url', value: '' },
  { key: 'linkedin_url', value: '' },
  { key: 'twitter_url', value: '' },
  { key: 'tagline', value: 'Austin\'s Premier Real Estate Experts' },
  { key: 'footer_text', value: '© 2025 Spyglass Realty. All rights reserved.' },
];

export async function initCmsTables(): Promise<void> {
  await query(`
    CREATE TABLE IF NOT EXISTS cms_pages (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL DEFAULT '',
      content JSONB NOT NULL DEFAULT '{}',
      meta_title VARCHAR(255) NOT NULL DEFAULT '',
      meta_description TEXT NOT NULL DEFAULT '',
      is_published BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS cms_blog_posts (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      excerpt TEXT NOT NULL DEFAULT '',
      featured_image VARCHAR(500) NOT NULL DEFAULT '',
      author VARCHAR(255) NOT NULL DEFAULT '',
      category VARCHAR(255) NOT NULL DEFAULT '',
      tags TEXT[] NOT NULL DEFAULT '{}',
      is_published BOOLEAN NOT NULL DEFAULT false,
      published_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS cms_site_settings (
      id SERIAL PRIMARY KEY,
      key VARCHAR(255) UNIQUE NOT NULL,
      value JSONB NOT NULL DEFAULT 'null',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`CREATE INDEX IF NOT EXISTS idx_cms_pages_slug ON cms_pages(slug)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_cms_blog_slug ON cms_blog_posts(slug)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_cms_blog_published ON cms_blog_posts(is_published, published_at DESC)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_cms_settings_key ON cms_site_settings(key)`);
}

export async function seedPages(): Promise<void> {
  for (const page of FRONTEND_PAGES) {
    await query(
      `INSERT INTO cms_pages (slug, title, content, meta_title, meta_description, is_published)
       VALUES ($1, $2, $3, $4, $5, true)
       ON CONFLICT (slug) DO NOTHING`,
      [page.slug, page.title, JSON.stringify({}), `${page.title} | Spyglass Realty`, '']
    );
  }
}

export async function seedSettings(): Promise<void> {
  for (const setting of DEFAULT_SETTINGS) {
    await query(
      `INSERT INTO cms_site_settings (key, value)
       VALUES ($1, $2)
       ON CONFLICT (key) DO NOTHING`,
      [setting.key, JSON.stringify(setting.value)]
    );
  }
}

// ─── Pages ───────────────────────────────────────────────────────────────────

export async function getAllPages(): Promise<CmsPage[]> {
  const result = await query('SELECT * FROM cms_pages ORDER BY slug ASC');
  return result.rows;
}

export async function getPage(slug: string): Promise<CmsPage | null> {
  const result = await query('SELECT * FROM cms_pages WHERE slug = $1', [slug]);
  return result.rows[0] ?? null;
}

export async function savePage(
  slug: string,
  data: Partial<CmsPage>
): Promise<CmsPage> {
  const result = await query(
    `INSERT INTO cms_pages (slug, title, content, meta_title, meta_description, is_published)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (slug) DO UPDATE SET
       title = EXCLUDED.title,
       content = EXCLUDED.content,
       meta_title = EXCLUDED.meta_title,
       meta_description = EXCLUDED.meta_description,
       is_published = EXCLUDED.is_published,
       updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [
      slug,
      data.title ?? '',
      JSON.stringify(data.content ?? {}),
      data.meta_title ?? '',
      data.meta_description ?? '',
      data.is_published ?? true,
    ]
  );
  return result.rows[0];
}

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export async function getBlogPosts(): Promise<CmsBlogPost[]> {
  const result = await query(
    'SELECT * FROM cms_blog_posts ORDER BY created_at DESC'
  );
  return result.rows;
}

export async function getBlogPost(slug: string): Promise<CmsBlogPost | null> {
  const result = await query(
    'SELECT * FROM cms_blog_posts WHERE slug = $1',
    [slug]
  );
  return result.rows[0] ?? null;
}

export async function getBlogPostById(id: number): Promise<CmsBlogPost | null> {
  const result = await query(
    'SELECT * FROM cms_blog_posts WHERE id = $1',
    [id]
  );
  return result.rows[0] ?? null;
}

export async function saveBlogPost(
  data: Partial<CmsBlogPost> & { title: string; slug: string }
): Promise<CmsBlogPost> {
  const isPublished = data.is_published ?? false;
  const publishedAt = isPublished
    ? (data.published_at ?? new Date().toISOString())
    : null;

  if (data.id) {
    const result = await query(
      `UPDATE cms_blog_posts SET
         slug = $2, title = $3, content = $4, excerpt = $5,
         featured_image = $6, author = $7, category = $8, tags = $9,
         is_published = $10, published_at = $11, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
      [
        data.id,
        data.slug,
        data.title,
        data.content ?? '',
        data.excerpt ?? '',
        data.featured_image ?? '',
        data.author ?? '',
        data.category ?? '',
        data.tags ?? [],
        isPublished,
        publishedAt,
      ]
    );
    return result.rows[0];
  } else {
    const result = await query(
      `INSERT INTO cms_blog_posts
         (slug, title, content, excerpt, featured_image, author, category, tags, is_published, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        data.slug,
        data.title,
        data.content ?? '',
        data.excerpt ?? '',
        data.featured_image ?? '',
        data.author ?? '',
        data.category ?? '',
        data.tags ?? [],
        isPublished,
        publishedAt,
      ]
    );
    return result.rows[0];
  }
}

export async function deleteBlogPost(id: number): Promise<void> {
  await query('DELETE FROM cms_blog_posts WHERE id = $1', [id]);
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export async function getSetting(key: string): Promise<unknown> {
  const result = await query(
    'SELECT value FROM cms_site_settings WHERE key = $1',
    [key]
  );
  return result.rows[0]?.value ?? null;
}

export async function getAllSettings(): Promise<Record<string, unknown>> {
  const result = await query(
    'SELECT key, value FROM cms_site_settings ORDER BY key ASC'
  );
  const settings: Record<string, unknown> = {};
  for (const row of result.rows) {
    settings[row.key] = row.value;
  }
  return settings;
}

export async function saveSetting(
  key: string,
  value: unknown
): Promise<void> {
  await query(
    `INSERT INTO cms_site_settings (key, value)
     VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET
       value = EXCLUDED.value,
       updated_at = CURRENT_TIMESTAMP`,
    [key, JSON.stringify(value)]
  );
}

export async function saveAllSettings(
  settings: Record<string, string>
): Promise<void> {
  for (const [key, value] of Object.entries(settings)) {
    await saveSetting(key, value);
  }
}

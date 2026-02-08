/**
 * Build-time helper to generate community card metadata
 * (hero images, snippets from scraped content)
 * 
 * This runs server-side only.
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

interface ScrapedSection {
  heading: string;
  paragraphs: string[];
}

interface ScrapedCommunity {
  slug: string;
  metaDescription: string;
  sections: ScrapedSection[];
  images: Array<{ src: string; alt: string; localPath?: string }>;
}

export interface CommunityCardMeta {
  snippet: string;
  heroImage: string | null;
}

// Cache
let _cardMetaMap: Map<string, CommunityCardMeta> | null = null;

// Map of community image directories to their first real image
function findHeroImage(slug: string): string | null {
  const imgDir = join(process.cwd(), 'public', 'images', 'communities', slug);
  if (!existsSync(imgDir)) return null;

  try {
    const files = readdirSync(imgDir);
    const imageFile = files.find(f => 
      /\.(jpg|jpeg|png|webp)$/i.test(f) && !f.includes('35mm_landscape')
    );
    if (imageFile) {
      return `/images/communities/${slug}/${imageFile}`;
    }
  } catch {
    // ignore
  }
  return null;
}

// Strip HTML tags from a string
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

// Patterns that indicate junk content (nav markup, buttons, etc.)
const JUNK_PATTERNS = [
  /dropdown/i,
  /header__/i,
  /tabindex/i,
  /aria-label/i,
  /button/i,
  /class="/i,
  /style="/i,
  /<svg/i,
  /polygon/i,
  /Sign Out/i,
  /Dashboard/i,
  /click the links below/i,
  /office.*real estate/i,
  /\bspan class\b/i,
];

function isCleanParagraph(text: string): boolean {
  if (text.length < 30) return false;
  return !JUNK_PATTERNS.some(p => p.test(text));
}

function getSnippet(community: ScrapedCommunity): string {
  // Try metaDescription first
  if (community.metaDescription && community.metaDescription.length > 30) {
    const cleaned = stripHtml(community.metaDescription);
    if (cleaned.length > 30) {
      return cleaned.length > 120 ? cleaned.substring(0, 117) + '...' : cleaned;
    }
  }

  // Try sections for a clean paragraph
  for (const section of community.sections) {
    if (section.heading === '_intro') continue;
    if (/real estate agents$/i.test(section.heading)) continue;
    if (/let's talk/i.test(section.heading)) continue;

    for (const para of section.paragraphs) {
      if (!isCleanParagraph(para)) continue;
      const cleaned = stripHtml(para);
      if (cleaned.length < 30) continue;
      return cleaned.length > 120 ? cleaned.substring(0, 117) + '...' : cleaned;
    }
  }

  return '';
}

// Slug mapping (same as scraped-content-loader.ts)
const SLUG_MAP: Record<string, string> = {
  'westlake-hills': 'west-lake-hills',
};

export function getCommunityCardMeta(slug: string): CommunityCardMeta {
  if (!_cardMetaMap) {
    _cardMetaMap = new Map();

    try {
      const filePath = join(process.cwd(), 'src', 'data', 'scraped-community-content.json');
      const raw = readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw) as ScrapedCommunity[];

      for (const community of data) {
        const snippet = getSnippet(community);
        const heroImage = findHeroImage(community.slug);
        _cardMetaMap.set(community.slug, { snippet, heroImage });
      }
    } catch {
      console.warn('Could not load scraped community content for cards');
    }
  }

  const mappedSlug = SLUG_MAP[slug] || slug;
  const meta = _cardMetaMap.get(mappedSlug);
  
  if (meta) return meta;

  // Fallback: try finding an image even without scraped content
  const heroImage = findHeroImage(slug);
  return { snippet: '', heroImage };
}

/**
 * Get all card metadata as a serializable map (for passing to client components)
 */
export function getAllCommunityCardMeta(slugs: string[]): Record<string, CommunityCardMeta> {
  const result: Record<string, CommunityCardMeta> = {};
  for (const slug of slugs) {
    result[slug] = getCommunityCardMeta(slug);
  }
  return result;
}

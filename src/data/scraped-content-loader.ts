/**
 * Loads and processes scraped community content from spyglassrealty.com
 * Maps scraped content to community slugs in the IDX project
 * 
 * Uses fs to read at build/server time (not bundled into client)
 */

import { readFileSync } from 'fs';
import { join } from 'path';

interface ScrapedSection {
  heading: string;
  paragraphs: string[];
  subHeadings: string[];
  rawHtml: string;
}

interface ScrapedCommunity {
  slug: string;
  sourceUrl: string;
  title: string;
  metaDescription: string;
  heroImage: string | null;
  heroImageLocal?: string;
  sections: ScrapedSection[];
  images: Array<{ src: string; alt: string; localPath?: string }>;
  internalLinks: Array<{ href: string; text: string }>;
  subCommunityLinks: Array<{ href: string; text: string }>;
  footerCommunityLinks: Array<{ href: string; text: string }>;
  scrapedAt: string;
}

// Lazy-loaded cache
let _scrapedData: ScrapedCommunity[] | null = null;

function loadScrapedData(): ScrapedCommunity[] {
  if (_scrapedData) return _scrapedData;
  try {
    const filePath = join(process.cwd(), 'src', 'data', 'scraped-community-content.json');
    const raw = readFileSync(filePath, 'utf-8');
    _scrapedData = JSON.parse(raw) as ScrapedCommunity[];
    return _scrapedData;
  } catch {
    console.warn('Could not load scraped community content');
    return [];
  }
}

// Map of community slugs in the IDX project to scraped slugs
const SLUG_MAP: Record<string, string> = {
  'austin': 'austin',
  'bastrop': 'bastrop',
  'bee-cave': 'bee-cave',
  'bouldin-creek': 'bouldin-creek',
  'brushy-creek': 'brushy-creek',
  'cedar-park': 'cedar-park',
  'central-austin': 'central-austin',
  'del-valle': 'del-valle',
  'downtown': 'downtown',
  'driftwood': 'driftwood',
  'dripping-springs': 'dripping-springs',
  'east-austin': 'east-austin',
  'georgetown': 'georgetown',
  'horseshoe-bay': 'horseshoe-bay',
  'hutto': 'hutto',
  'jonestown': 'jonestown',
  'kyle': 'kyle',
  'lago-vista': 'lago-vista',
  'lakeway': 'lakeway',
  'leander': 'leander',
  'liberty-hill': 'liberty-hill',
  'manchaca': 'manchaca',
  'manor': 'manor',
  'north-austin': 'north-austin',
  'north-central-austin': 'north-central-austin',
  'northwest-hills': 'northwest-hills',
  'pflugerville': 'pflugerville',
  'point-venture': 'point-venture',
  'round-rock': 'round-rock',
  'san-marcos': 'san-marcos',
  'south-austin': 'south-austin',
  'southwest-austin': 'southwest-austin',
  'spicewood': 'spicewood',
  'sunset-valley': 'sunset-valley',
  'the-hills': 'the-hills',
  'volente': 'volente',
  'west-austin': 'west-austin',
  'west-lake-hills': 'west-lake-hills',
  'westlake-hills': 'west-lake-hills',
  'barton-creek-west': 'barton-creek-west',
  'travis-heights': 'travis-heights',
  'lake-travis': 'lake-travis',
  'tarrytown': 'tarrytown',
  'hyde-park': 'hyde-park',
  '78704': '78704',
};

// Sections to skip (not SEO content)
const SKIP_SECTION_PATTERNS = [
  /real estate search$/i,
  /real estate agents$/i,
  /let's talk/i,
  /ready to buy or sell/i,
  /contact.*spyglass/i,
  /^_intro$/, // The intro often contains nav junk
];

// Clean up HTML content - remove residual navigation, script artifacts
function cleanParagraph(html: string): string {
  let cleaned = html;
  // Remove SVG/icon markup
  cleaned = cleaned.replace(/<svg[\s\S]*?<\/svg>/gi, '');
  cleaned = cleaned.replace(/<polygon[^>]*\/?>/gi, '');
  // Remove button/dropdown markup
  cleaned = cleaned.replace(/<button[\s\S]*?<\/button>/gi, '');
  cleaned = cleaned.replace(/<ul class="dropdown[\s\S]*?<\/ul>/gi, '');
  // Remove empty tags
  cleaned = cleaned.replace(/<[a-z]+[^>]*>\s*<\/[a-z]+>/gi, '');
  // Clean up excessive whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  // Remove paragraphs that are just navigation artifacts
  if (cleaned.length < 20) return '';
  if (cleaned.includes('dropdown') || cleaned.includes('header__')) return '';
  if (cleaned.includes('tabindex=') || cleaned.includes('aria-label=')) return '';
  return cleaned;
}

function getContentSections(community: ScrapedCommunity): ScrapedSection[] {
  return community.sections.filter(section => {
    if (SKIP_SECTION_PATTERNS.some(pattern => pattern.test(section.heading))) {
      return false;
    }
    const meaningfulParagraphs = section.paragraphs
      .map(p => cleanParagraph(p))
      .filter(p => p.length > 20);
    return meaningfulParagraphs.length > 0;
  }).map(section => ({
    ...section,
    paragraphs: section.paragraphs
      .map(p => cleanParagraph(p))
      .filter(p => p.length > 20),
  }));
}

/**
 * Get scraped content for a community by its IDX slug
 */
export function getScrapedContent(idxSlug: string): {
  title: string;
  metaDescription: string;
  sections: Array<{
    heading: string;
    content: string; // HTML content
  }>;
  subCommunityLinks: Array<{ href: string; text: string }>;
  sourceUrl: string;
} | null {
  const scrapedSlug = SLUG_MAP[idxSlug] || idxSlug;
  const data = loadScrapedData();
  const community = data.find(c => c.slug === scrapedSlug);
  
  if (!community) return null;
  
  const contentSections = getContentSections(community);
  if (contentSections.length === 0) return null;
  
  return {
    title: community.title,
    metaDescription: community.metaDescription,
    sections: contentSections.map(section => ({
      heading: section.heading === '_intro' ? '' : section.heading.replace(/&amp;/g, '&'),
      content: section.paragraphs.map(p => `<p>${p}</p>`).join('\n'),
    })),
    subCommunityLinks: community.subCommunityLinks || [],
    sourceUrl: community.sourceUrl,
  };
}

/**
 * Get all scraped community slugs that have content
 */
export function getScrapedCommunitySlugs(): string[] {
  const data = loadScrapedData();
  return data
    .filter(c => getContentSections(c).length > 0)
    .map(c => c.slug);
}

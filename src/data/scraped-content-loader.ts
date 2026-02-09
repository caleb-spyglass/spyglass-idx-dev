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
// IDX slug -> scraped JSON slug
const SLUG_MAP: Record<string, string> = {
  // Direct 1:1 mappings (IDX slug matches scraped slug)
  'austin': 'austin',
  'bastrop': 'bastrop',
  'bee-cave': 'bee-cave',
  'bouldin-creek': 'bouldin-creek',
  'brushy-creek': 'brushy-creek',
  'cedar-park': 'cedar-park',
  'central-austin': 'central-austin',
  'del-valle': 'del-valle',
  'driftwood': 'driftwood',
  'dripping-springs': 'dripping-springs',
  'east-austin': 'east-austin',
  'georgetown': 'georgetown',
  'horseshoe-bay': 'horseshoe-bay',
  'hutto': 'hutto',
  'hyde-park': 'hyde-park',
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
  'travis-heights': 'travis-heights',
  'lake-travis': 'lake-travis',
  'tarrytown': 'tarrytown',
  'barton-creek-west': 'barton-creek-west',

  // IDX slug differs from scraped slug
  'downtown': 'downtown',
  'downtown-austin': 'downtown',
  'west-lake-hills': 'west-lake-hills',
  'westlake-hills': 'west-lake-hills',

  // Zip codes
  '78701': '78701',
  '78702': '78702',
  '78704': '78704',
  '78705': '78705',
  '78721': '78721',
  '78726': '78726',
  '78728': '78728',
  '78731': '78731',
  '78732': '78732',
  '78733': '78733',
  '78734': '78734',
  '78735': '78735',
  '78744': '78744',
  '78745': '78745',
  '78746': '78746',
  '78748': '78748',
  '78749': '78749',
  '78750': '78750',
  '78751': '78751',
  '78752': '78752',
  '78753': '78753',
  '78754': '78754',
  '78756': '78756',
  '78758': '78758',

  // Communities in austin-communities.ts or communities-data.ts
  // that map to scraped slugs — neighborhood name variants
  'barton-hills': 'barton-creek-west',   // Barton Hills closest scraped match
  'zilker': 'austin',                     // No dedicated scraped page; fallback
  'barton-creek': 'barton-creek-west',    // Barton Creek -> barton-creek-west scraped
  'bee-caves': 'bee-cave',               // alt spelling in austin-communities
  'bouldin': 'bouldin-creek',            // alt id in austin-communities
};

// Sections to SKIP — boilerplate, navigation junk, agent CTAs, listing search
const SKIP_SECTION_PATTERNS = [
  /real estate search$/i,
  /real estate agents$/i,
  /let's talk/i,
  /ready to buy or sell/i,
  /contact.*spyglass/i,
  /^_intro$/,                              // Intro sections contain nav HTML
  /homes for sale in/i,                    // Listing search sections
  /^\s*$/,                                 // Empty headings
  /^&nbsp;$/,                              // Non-breaking space headings (footer)
  /^directions\s/i,                        // "Directions X to Y" (often footer junk)
  /real estate statistics/i,               // Stats widget markup
  /market report/i,                        // Market report download CTA
];

// Additional heading-level filters: skip if heading is just the community name
// followed by common suffixes that indicate boilerplate
const SKIP_HEADING_SUFFIXES = [
  'real estate',
  'homes',
  'condos',
  'properties',
];

/**
 * Aggressively clean HTML paragraph content.
 * Strips navigation, SVGs, listing cards, dropdowns, scripts, forms, etc.
 * Preserves meaningful text with links and bold formatting.
 */
function cleanParagraph(html: string): string {
  let cleaned = html;

  // 1. Remove entire SVG blocks (including nested)
  cleaned = cleaned.replace(/<svg[\s\S]*?<\/svg>/gi, '');
  cleaned = cleaned.replace(/<polygon[^>]*\/?>/gi, '');
  cleaned = cleaned.replace(/<path[^>]*\/?>/gi, '');
  cleaned = cleaned.replace(/<circle[^>]*\/?>/gi, '');
  cleaned = cleaned.replace(/<rect[^>]*\/?>/gi, '');
  cleaned = cleaned.replace(/<line[^>]*\/?>/gi, '');
  cleaned = cleaned.replace(/<g[^>]*>[\s\S]*?<\/g>/gi, '');

  // 2. Remove script and style blocks
  cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, '');
  cleaned = cleaned.replace(/<style[\s\S]*?<\/style>/gi, '');
  cleaned = cleaned.replace(/<noscript[\s\S]*?<\/noscript>/gi, '');

  // 3. Remove form elements
  cleaned = cleaned.replace(/<form[\s\S]*?<\/form>/gi, '');
  cleaned = cleaned.replace(/<input[^>]*\/?>/gi, '');
  cleaned = cleaned.replace(/<select[\s\S]*?<\/select>/gi, '');
  cleaned = cleaned.replace(/<textarea[\s\S]*?<\/textarea>/gi, '');

  // 4. Remove button elements
  cleaned = cleaned.replace(/<button[\s\S]*?<\/button>/gi, '');

  // 5. Remove navigation/dropdown/menu elements
  cleaned = cleaned.replace(/<nav[\s\S]*?<\/nav>/gi, '');
  cleaned = cleaned.replace(/<ul\s+class="dropdown[\s\S]*?<\/ul>/gi, '');
  cleaned = cleaned.replace(/<ul\s+class="nav[\s\S]*?<\/ul>/gi, '');
  cleaned = cleaned.replace(/<div\s+class="(header|footer|nav|menu|dropdown|refine|search|filter|listing|card|modal|popup|overlay|sidebar|widget|social|share|breadcrumb)[\s\S]*?<\/div>/gi, '');

  // 6. Remove listing card markup (common patterns from scraped data)
  cleaned = cleaned.replace(/<div\s+class="[^"]*listing[^"]*"[\s\S]*?<\/div>/gi, '');
  cleaned = cleaned.replace(/<div\s+class="[^"]*card[^"]*"[\s\S]*?<\/div>/gi, '');
  cleaned = cleaned.replace(/<div\s+class="[^"]*property[^"]*"[\s\S]*?<\/div>/gi, '');
  cleaned = cleaned.replace(/<div\s+class="[^"]*result[^"]*"[\s\S]*?<\/div>/gi, '');
  cleaned = cleaned.replace(/<div\s+class="[^"]*search[^"]*"[\s\S]*?<\/div>/gi, '');
  cleaned = cleaned.replace(/<div\s+class="[^"]*refine[^"]*"[\s\S]*?<\/div>/gi, '');
  cleaned = cleaned.replace(/<div\s+class="[^"]*filter[^"]*"[\s\S]*?<\/div>/gi, '');

  // 7. Remove image tags (we don't want inline images from scraped content)
  cleaned = cleaned.replace(/<img[^>]*\/?>/gi, '');

  // 8. Remove iframe embeds
  cleaned = cleaned.replace(/<iframe[\s\S]*?<\/iframe>/gi, '');

  // 9. Remove span wrappers that are stats/office labels
  cleaned = cleaned.replace(/<span\s+class="(stat|office|price|badge|label|tag|icon)[^"]*"[^>]*>[\s\S]*?<\/span>/gi, '');

  // 10. Remove remaining empty divs/spans/sections with classes
  cleaned = cleaned.replace(/<div\s+class="[^"]*"[^>]*>\s*<\/div>/gi, '');
  cleaned = cleaned.replace(/<span\s+class="[^"]*"[^>]*>\s*<\/span>/gi, '');

  // 11. Remove empty tags (any level)
  for (let i = 0; i < 3; i++) {
    cleaned = cleaned.replace(/<([a-z]+)[^>]*>\s*<\/\1>/gi, '');
  }

  // 12. Convert <br>, <br/>, <br /> to spaces  
  cleaned = cleaned.replace(/<br\s*\/?>/gi, ' ');
  cleaned = cleaned.replace(/<\/br>/gi, ' ');

  // 13. Remove all remaining HTML tags EXCEPT: a, strong, b, em, i
  // First, protect allowed tags by replacing them with placeholders
  const linkPlaceholders: string[] = [];
  cleaned = cleaned.replace(/<a\s+[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_match, href, text) => {
    const cleanText = text.replace(/<[^>]+>/g, '').trim();
    if (!cleanText) return '';
    // Convert relative URLs to absolute spyglassrealty.com URLs
    let fullHref = href.trim();
    if (fullHref.startsWith('/')) {
      fullHref = `https://www.spyglassrealty.com${fullHref}`;
    } else if (fullHref.startsWith(' /')) {
      fullHref = `https://www.spyglassrealty.com${fullHref.trim()}`;
    }
    const placeholder = `__LINK_${linkPlaceholders.length}__`;
    linkPlaceholders.push(`<a href="${fullHref}" target="_blank" rel="noopener noreferrer">${cleanText}</a>`);
    return placeholder;
  });

  const boldPlaceholders: string[] = [];
  cleaned = cleaned.replace(/<(strong|b)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi, (_match, _tag, _attrs, text) => {
    const cleanText = text.replace(/<[^>]+>/g, '').trim();
    if (!cleanText) return '';
    const placeholder = `__BOLD_${boldPlaceholders.length}__`;
    boldPlaceholders.push(`<strong>${cleanText}</strong>`);
    return placeholder;
  });

  const emPlaceholders: string[] = [];
  cleaned = cleaned.replace(/<(em|i)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi, (_match, _tag, _attrs, text) => {
    const cleanText = text.replace(/<[^>]+>/g, '').trim();
    if (!cleanText) return '';
    const placeholder = `__EM_${emPlaceholders.length}__`;
    emPlaceholders.push(`<em>${cleanText}</em>`);
    return placeholder;
  });

  // 14. Strip ALL remaining HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, '');

  // 15. Restore placeholders
  linkPlaceholders.forEach((link, i) => {
    cleaned = cleaned.replace(`__LINK_${i}__`, link);
  });
  boldPlaceholders.forEach((bold, i) => {
    cleaned = cleaned.replace(`__BOLD_${i}__`, bold);
  });
  emPlaceholders.forEach((em, i) => {
    cleaned = cleaned.replace(`__EM_${i}__`, em);
  });

  // 16. Decode common HTML entities
  cleaned = cleaned.replace(/&nbsp;/g, ' ');
  cleaned = cleaned.replace(/&amp;/g, '&');
  cleaned = cleaned.replace(/&lt;/g, '<');
  cleaned = cleaned.replace(/&gt;/g, '>');
  cleaned = cleaned.replace(/&quot;/g, '"');
  cleaned = cleaned.replace(/&#39;/g, "'");
  cleaned = cleaned.replace(/&ldquo;/g, '\u201C');
  cleaned = cleaned.replace(/&rdquo;/g, '\u201D');
  cleaned = cleaned.replace(/&lsquo;/g, '\u2018');
  cleaned = cleaned.replace(/&rsquo;/g, '\u2019');
  cleaned = cleaned.replace(/&mdash;/g, '\u2014');
  cleaned = cleaned.replace(/&ndash;/g, '\u2013');
  cleaned = cleaned.replace(/&hellip;/g, '\u2026');

  // 17. Clean up whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // 18. Skip if too short (likely artifact)
  if (cleaned.length < 30) return '';

  // 19. Skip if it contains telltale junk patterns
  const junkPatterns = [
    /^click the links below/i,
    /^sort results by/i,
    /^sign(ed)?[\s-]?in/i,
    /^my dashboard/i,
    /^favorites$/i,
    /^saved searches$/i,
    /^sign[\s-]?out$/i,
    /^SPYGLASS REALTY$/i,
    /^2130 Goodrich/i,
    /^Austin, TX 78704/i,
    /^United States/i,
    /^\d+ Goodrich Ave/i,
    /^MLS[\s#]/i,
    /^Listing courtesy/i,
    /^Courtesy of/i,
    /^©\s*\d{4}/i,
    /^All rights reserved/i,
    /tabindex=/i,
    /aria-label=/i,
    /dropdown/i,
    /header__/i,
    /onclick=/i,
    /class="/i,
    /data-[a-z]/i,
    /^\s*Phone:/i,
    /^\s*Office:/i,
    /^\s*Fax:/i,
    /^Bathrooms/i,
    /^Bedrooms/i,
    /^Property Type/i,
    /^Price Range/i,
    /^Min Price/i,
    /^Max Price/i,
    /^Square Feet/i,
    /^Year Built/i,
    /^Compass RE/i,
    /^Realty Austin/i,
    /^Keller Williams/i,
    /^HomeSmart/i,
    /^Residential\s+\$/i,                    // Listing card: "Residential $1,075,000 ..."
    /^\d+\s+(Beds?|Bath|SqFt|Acre)/i,       // Listing stats: "3 Beds 3 Baths ..."
    /MLS[®&]\s*#?\s*\d+/i,                  // MLS numbers
    /^\$[\d,]+\s+\d+\s/,                    // Price followed by address
    /^(Active|Pending|Sold)\s+\$/i,          // Listing status + price
    /^Land\s+\$/i,                           // Land listing card
    /^Condo\s+\$/i,                          // Condo listing card
  ];

  if (junkPatterns.some(pattern => pattern.test(cleaned))) return '';

  return cleaned;
}

/**
 * Check if a section heading indicates it should be skipped
 */
function shouldSkipSection(heading: string, communityName?: string): boolean {
  // Check skip patterns
  if (SKIP_SECTION_PATTERNS.some(pattern => pattern.test(heading))) {
    return true;
  }

  // Skip sections where heading is just "[Community] Real Estate" or similar
  if (communityName) {
    const lowerHeading = heading.toLowerCase();
    const lowerName = communityName.toLowerCase();
    for (const suffix of SKIP_HEADING_SUFFIXES) {
      if (lowerHeading === `${lowerName} ${suffix}`) return true;
      if (lowerHeading === `about ${lowerName} ${suffix}`) return true;
    }
    // Skip "Homes For Sale in X" variations
    if (/^homes?\s+for\s+sale/i.test(heading)) return true;
  }

  return false;
}

function getContentSections(community: ScrapedCommunity): ScrapedSection[] {
  // Extract a rough community name from the slug for heading comparisons
  const communityName = community.slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  return community.sections.filter(section => {
    if (shouldSkipSection(section.heading, communityName)) {
      return false;
    }
    const meaningfulParagraphs = section.paragraphs
      .map(p => cleanParagraph(p))
      .filter(p => p.length > 30);
    return meaningfulParagraphs.length > 0;
  }).map(section => ({
    ...section,
    paragraphs: section.paragraphs
      .map(p => cleanParagraph(p))
      .filter(p => p.length > 30),
  }));
}

/**
 * Clean up a section heading for display
 */
function cleanHeading(heading: string): string {
  return heading
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&ldquo;/g, '\u201C')
    .replace(/&rdquo;/g, '\u201D')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&mdash;/g, '\u2014')
    .replace(/&ndash;/g, '\u2013')
    .trim();
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
      heading: section.heading === '_intro' ? '' : cleanHeading(section.heading),
      content: section.paragraphs.map(p => `<p>${p}</p>`).join('\n'),
    })),
    subCommunityLinks: (community.subCommunityLinks || []).map(link => ({
      href: link.href.startsWith('/') 
        ? `https://www.spyglassrealty.com${link.href}`
        : link.href,
      text: link.text,
    })),
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

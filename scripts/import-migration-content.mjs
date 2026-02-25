#!/usr/bin/env node

/**
 * Import Migration Content Script
 * 
 * Converts 557 markdown files from ~/clawd/spyglass-migration/content/ 
 * into the ScrapedCommunity JSON format and merges with existing
 * scraped-community-content.json
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const MIGRATION_CONTENT_DIR = '/Users/ryanrodenbeck/clawd/spyglass-migration/content';
const SCRAPED_JSON_PATH = join(__dirname, '..', 'src', 'data', 'scraped-community-content.json');

// Categories to process through scraped content system
const SCRAPED_CATEGORIES = ['neighborhood', 'city', 'region', 'condo'];

// URL slug mapping - old site URL patterns to new site slugs
const URL_SLUG_MAP = {
  // Austin variations
  'austin-real-estate.php': 'austin',
  'austin-real-estate': 'austin',
  
  // ZIP code patterns (from ZIP_URL_MAP in seo-url-aliases.ts)
  '78613-homes-for-sale': '78613',
  '78617-property': '78617', 
  '78620-homes-for-sale': '78620',
  '78628-houses-for-sale': '78628',
  '78641-property': '78641',
  '78645-homes-for-sale': '78645',
  '78652-homes-for-sale': '78652',
  '78701-homes-for-sale': '78701',
  '78702-homes-for-sale': '78702',
  '78703-homes-and-condos': '78703',
  '78704-homes-and-condos': '78704',
  '78705-homes-for-sale': '78705',
  '78717-houses-for-sale': '78717',
  '78721-homes-for-sale': '78721',
  '78722-house-for-sale': '78722',
  '78723-homes': '78723',
  '78724-house': '78724',
  '78726-homes-for-sale': '78726',
  '78727-houses-for-sale': '78727',
  '78728-homes-for-sale': '78728',
  '78731-homes-for-sale': '78731',
  '78732-homes-for-sale': '78732',
  '78733-homes-for-sale': '78733',
  '78734-homes-for-sale': '78734',
  '78735-homes-for-sale': '78735',
  '78737-homes': '78737',
  '78738-houses-for-sale': '78738',
  '78739-homes': '78739',
  '78741-house': '78741',
  '78741-for-rent': '78741',
  '78744-homes-for-sale': '78744',
  '78745-homes-for-sale': '78745',
  '78746-homes-for-sale': '78746',
  '78748-homes-for-sale': '78748',
  '78749-homes-for-sale': '78749',
  '78750-homes-for-sale': '78750',
  '78751-homes-for-sale': '78751',
  '78752-homes-for-sale': '78752',
  '78753-homes-for-sale': '78753',
  '78754-homes-for-sale': '78754',
  '78756-homes-for-sale': '78756',
  '78757-houses-for-sale': '78757',
  '78758-homes-for-sale': '78758',
  '78759-houses-and-condos-for-sale': '78759',
  '78957-homes-for-sale': '78957',
};

/**
 * Map source URL to new site slug
 */
function mapSourceUrlToSlug(sourceUrl) {
  if (!sourceUrl) return null;
  
  // Extract path from URL
  let path = sourceUrl.replace('https://spyglassrealty.com/', '');
  if (path.startsWith('/')) path = path.substring(1);
  
  // Check direct mapping
  if (URL_SLUG_MAP[path]) {
    return URL_SLUG_MAP[path];
  }
  
  // Remove .php extension if present
  const withoutPhp = path.replace(/\.php$/, '');
  if (URL_SLUG_MAP[withoutPhp]) {
    return URL_SLUG_MAP[withoutPhp];
  }
  
  // For neighborhood/community names, convert to kebab-case
  if (withoutPhp.includes('-real-estate')) {
    return withoutPhp.replace('-real-estate', '');
  }
  
  if (withoutPhp.includes('-homes-for-sale')) {
    return withoutPhp.replace('-homes-for-sale', '');
  }
  
  // Default to kebab-cased version of filename
  return withoutPhp.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Parse markdown and split into sections by headings
 */
function parseMarkdownToSections(content) {
  const lines = content.split('\n');
  const sections = [];
  let currentSection = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Check for heading (## or #)
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    
    if (headingMatch) {
      // Save previous section
      if (currentSection && currentSection.paragraphs.length > 0) {
        sections.push(currentSection);
      }
      
      // Start new section
      currentSection = {
        heading: headingMatch[2].trim(),
        paragraphs: [],
        subHeadings: [],
        rawHtml: ''
      };
    } else if (trimmed && currentSection) {
      // Add content to current section
      currentSection.paragraphs.push(trimmed);
    } else if (trimmed && !currentSection) {
      // Content before any heading - create intro section
      if (!currentSection) {
        currentSection = {
          heading: '_intro',
          paragraphs: [],
          subHeadings: [],
          rawHtml: ''
        };
      }
      currentSection.paragraphs.push(trimmed);
    }
  }
  
  // Don't forget the last section
  if (currentSection && currentSection.paragraphs.length > 0) {
    sections.push(currentSection);
  }
  
  // Convert paragraphs to HTML and clean up
  return sections.map(section => ({
    ...section,
    rawHtml: section.paragraphs.map(p => {
      // Convert markdown links to HTML
      const htmlContent = p
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');
      
      return `<p>${htmlContent}</p>`;
    }).join('\n')
  }));
}

/**
 * Extract internal links from markdown content
 */
function extractInternalLinks(content) {
  const links = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    const [, text, href] = match;
    
    // Only include links that look like internal links
    if (href.startsWith('/') || href.startsWith('.') || href.includes('spyglassrealty.com')) {
      links.push({
        href: href.startsWith('/') ? `https://www.spyglassrealty.com${href}` : href,
        text: text.trim()
      });
    }
  }
  
  return links;
}

/**
 * Generate meta description from content
 */
function generateMetaDescription(title, content) {
  // Try to find first meaningful paragraph
  const sentences = content
    .replace(/#{1,6}\s+[^\n]+/g, '') // Remove headings
    .replace(/\[[^\]]+\]\([^)]+\)/g, '') // Remove links
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic
    .replace(/\n+/g, ' ') // Collapse newlines
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20);
    
  if (sentences.length > 0) {
    let desc = sentences[0];
    if (sentences.length > 1) {
      desc += '. ' + sentences[1];
    }
    
    // Ensure it ends with a period and isn't too long
    if (!desc.match(/[.!?]$/)) desc += '.';
    if (desc.length > 155) {
      desc = desc.substring(0, 152) + '...';
    }
    
    return desc;
  }
  
  // Fallback
  return `Browse homes for sale and learn about ${title}. Contact Spyglass Realty for expert real estate guidance in Austin, Texas.`;
}

/**
 * Process a single markdown file
 */
function processMarkdownFile(filePath, category) {
  try {
    console.log(`Processing: ${filePath}`);
    const raw = readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(raw);
    
    const sourceUrl = frontmatter.source_url || '';
    const slug = mapSourceUrlToSlug(sourceUrl);
    
    if (!slug) {
      console.warn(`Could not map source URL to slug: ${sourceUrl}`);
      return null;
    }
    
    const sections = parseMarkdownToSections(content);
    const internalLinks = extractInternalLinks(content);
    const title = frontmatter.title || `${slug} Real Estate`;
    const metaDescription = generateMetaDescription(title, content);
    
    return {
      slug,
      sourceUrl,
      title,
      metaDescription,
      heroImage: null,
      sections,
      images: [],
      internalLinks,
      subCommunityLinks: [],
      footerCommunityLinks: [],
      scrapedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Process all markdown files in a directory
 */
function processDirectory(dirPath, category) {
  const results = [];
  
  try {
    const files = readdirSync(dirPath);
    
    for (const file of files) {
      if (file === 'SUMMARY.md') continue; // Skip summary files
      
      const filePath = join(dirPath, file);
      const stat = statSync(filePath);
      
      if (stat.isFile() && file.endsWith('.md')) {
        const result = processMarkdownFile(filePath, category);
        if (result) {
          results.push(result);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error.message);
  }
  
  return results;
}

/**
 * Main import function
 */
function importMigrationContent() {
  console.log('Starting migration content import...');
  
  // Load existing scraped content
  let existingContent = [];
  try {
    const raw = readFileSync(SCRAPED_JSON_PATH, 'utf-8');
    existingContent = JSON.parse(raw);
    console.log(`Loaded ${existingContent.length} existing scraped entries`);
  } catch (error) {
    console.warn('Could not load existing scraped content:', error.message);
  }
  
  // Create map of existing slugs
  const existingSlugs = new Set(existingContent.map(item => item.slug));
  
  // Process each category
  const allNewContent = [];
  
  for (const category of SCRAPED_CATEGORIES) {
    const categoryDir = join(MIGRATION_CONTENT_DIR, category);
    console.log(`\nProcessing ${category} directory...`);
    
    try {
      const categoryContent = processDirectory(categoryDir, category);
      console.log(`  Found ${categoryContent.length} items in ${category}`);
      allNewContent.push(...categoryContent);
    } catch (error) {
      console.warn(`  Could not process ${category}:`, error.message);
    }
  }
  
  console.log(`\nTotal new content items: ${allNewContent.length}`);
  
  // Merge with existing content (don't overwrite existing)
  const finalContent = [...existingContent];
  let addedCount = 0;
  let skippedCount = 0;
  
  for (const newItem of allNewContent) {
    if (existingSlugs.has(newItem.slug)) {
      console.log(`  Skipping existing slug: ${newItem.slug}`);
      skippedCount++;
    } else {
      finalContent.push(newItem);
      existingSlugs.add(newItem.slug);
      addedCount++;
    }
  }
  
  console.log(`\nMerge summary:`);
  console.log(`  Added: ${addedCount} new entries`);
  console.log(`  Skipped: ${skippedCount} existing entries`);
  console.log(`  Total entries: ${finalContent.length}`);
  
  // Write updated content
  try {
    writeFileSync(SCRAPED_JSON_PATH, JSON.stringify(finalContent, null, 2));
    console.log(`\n✅ Successfully wrote updated scraped content to ${SCRAPED_JSON_PATH}`);
  } catch (error) {
    console.error(`❌ Error writing file:`, error.message);
    process.exit(1);
  }
  
  // Return summary for SEO slug update
  return {
    addedSlugs: allNewContent.map(item => item.slug),
    totalCount: finalContent.length
  };
}

// Run the import
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = importMigrationContent();
  
  console.log('\n📝 Next steps:');
  console.log('1. Update ALL_SEO_SLUGS in seo-url-aliases.ts');
  console.log('2. Run: npx next build 2>&1 | tail -40');
  console.log('3. Verify build completes successfully');
  
  console.log(`\nAdded slugs (${result.addedSlugs.length}):`);
  result.addedSlugs.sort().forEach(slug => console.log(`  - ${slug}`));
}
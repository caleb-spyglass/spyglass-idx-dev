#!/usr/bin/env node
/**
 * Scrape community pages from spyglassrealty.com
 * Extracts: title, meta description, text content (as HTML), images, links
 * Saves content to src/data/scraped-community-content.json
 * Downloads images to public/images/communities/[slug]/
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const BASE_URL = 'https://www.spyglassrealty.com';

// All community pages to scrape
const COMMUNITY_PAGES = [
  { url: '/austin-real-estate.php', slug: 'austin' },
  { url: '/austin-barton-creek-west-homes-for-sale.php', slug: 'barton-creek-west' },
  { url: '/bastrop-real-estate.php', slug: 'bastrop' },
  { url: '/bee-cave-real-estate.php', slug: 'bee-cave' },
  { url: '/bouldin-creek-real-estate.php', slug: 'bouldin-creek' },
  { url: '/brushy-creek-real-estate.php', slug: 'brushy-creek' },
  { url: '/cedar-park-real-estate.php', slug: 'cedar-park' },
  { url: '/central-austin-homes-for-sale.php', slug: 'central-austin' },
  { url: '/del-valle-real-estate.php', slug: 'del-valle' },
  { url: '/downtown-austin.php', slug: 'downtown' },
  { url: '/driftwood-real-estate.php', slug: 'driftwood' },
  { url: '/dripping-springs-real-estate.php', slug: 'dripping-springs' },
  { url: '/east-austin.php', slug: 'east-austin' },
  { url: '/georgetown-real-estate.php', slug: 'georgetown' },
  { url: '/horseshoe-bay-real-estate.php', slug: 'horseshoe-bay' },
  { url: '/hutto-real-estate.php', slug: 'hutto' },
  { url: '/jonestown-real-estate.php', slug: 'jonestown' },
  { url: '/kyle-real-estate.php', slug: 'kyle' },
  { url: '/lago-vista-real-estate.php', slug: 'lago-vista' },
  { url: '/lakeway-homes-for-sale.php', slug: 'lakeway' },
  { url: '/leander-real-estate.php', slug: 'leander' },
  { url: '/liberty-hill-real-estate.php', slug: 'liberty-hill' },
  { url: '/manchaca-real-estate.php', slug: 'manchaca' },
  { url: '/manor-real-estate.php', slug: 'manor' },
  { url: '/neighborhoods-in-78704.php', slug: '78704' },
  { url: '/north-austin.php', slug: 'north-austin' },
  { url: '/north-central-austin-homes-for-sale.php', slug: 'north-central-austin' },
  { url: '/northwest-hills-real-estate.php', slug: 'northwest-hills' },
  { url: '/pflugerville-real-estate.php', slug: 'pflugerville' },
  { url: '/point-venture-real-estate.php', slug: 'point-venture' },
  { url: '/round-rock-real-estate.php', slug: 'round-rock' },
  { url: '/san-marcos-real-estate.php', slug: 'san-marcos' },
  { url: '/south-austin.php', slug: 'south-austin' },
  { url: '/southwest-austin.php', slug: 'southwest-austin' },
  { url: '/spicewood-real-estate.php', slug: 'spicewood' },
  { url: '/sunset-valley-real-estate.php', slug: 'sunset-valley' },
  { url: '/the-hills-real-estate.php', slug: 'the-hills' },
  { url: '/volente-real-estate.php', slug: 'volente' },
  { url: '/west-austin-homes-for-sale.php', slug: 'west-austin' },
  { url: '/west-lake-hills-real-estate.php', slug: 'west-lake-hills' },
];

// Additional zip code pages to check
const ZIP_PAGES = [];
for (let zip = 78701; zip <= 78759; zip++) {
  ZIP_PAGES.push({ url: `/${zip}-homes-for-sale.php`, slug: `${zip}` });
}

// Additional neighborhood pages to check
const EXTRA_PAGES = [
  { url: '/travis-heights-real-estate.php', slug: 'travis-heights' },
  { url: '/barton-hills-real-estate.php', slug: 'barton-hills' },
  { url: '/zilker-real-estate.php', slug: 'zilker' },
  { url: '/lake-travis-real-estate.php', slug: 'lake-travis' },
  { url: '/mueller-real-estate.php', slug: 'mueller' },
  { url: '/tarrytown-real-estate.php', slug: 'tarrytown' },
  { url: '/hyde-park-real-estate.php', slug: 'hyde-park' },
  { url: '/circle-c-ranch-real-estate.php', slug: 'circle-c-ranch' },
  { url: '/avery-ranch-real-estate.php', slug: 'avery-ranch' },
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
      timeout: 15000
    }, (res) => {
      // Follow redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          const fullUrl = redirectUrl.startsWith('http') ? redirectUrl : `${BASE_URL}${redirectUrl}`;
          return fetchUrl(fullUrl).then(resolve).catch(reject);
        }
      }
      
      if (res.statusCode !== 200) {
        resolve(null); // Page doesn't exist
        return;
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 30000
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          const fullUrl = redirectUrl.startsWith('http') ? redirectUrl : new URL(redirectUrl, url).href;
          return downloadFile(fullUrl, destPath).then(resolve).catch(reject);
        }
      }
      if (res.statusCode !== 200) { resolve(false); return; }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        mkdirSync(dirname(destPath), { recursive: true });
        writeFileSync(destPath, buffer);
        resolve(true);
      });
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>(.*?)<\/title>/is);
  return match ? match[1].trim() : '';
}

function extractMetaDescription(html) {
  const match = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/is);
  return match ? match[1].trim() : '';
}

function extractHeroImage(html) {
  // Look for hero background image
  const heroMatch = html.match(/class="hero[^"]*"[^>]*style="[^"]*background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/is);
  if (heroMatch) return heroMatch[1];
  
  // Look for hero img tag
  const heroImgMatch = html.match(/<img[^>]+class="hero__img[^"]*"[^>]+src="([^"]+)"/is);
  if (heroImgMatch) return heroImgMatch[1];
  
  // Look for og:image
  const ogMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/is);
  if (ogMatch) return ogMatch[1];
  
  return null;
}

function extractContentSections(html) {
  const sections = [];
  const images = [];
  const links = [];
  
  // The main content is in the #main div, specifically after the listings widget
  // Look for the content div that contains the SEO text
  // The pattern on these pages is: 
  // 1. Intro paragraph at top
  // 2. Listings widget (hw-search)
  // 3. Sub-community links
  // 4. SEO content sections with h2, h3, p tags
  // 5. Reviews
  // 6. Footer links
  
  // Extract everything after the listings section - the SEO content
  // Look for content between the sidebar and the disclaimer
  
  // Strategy: find all <h2>, <h3>, <p> blocks in the main content area
  // The main content is inside <div id="main"> ... </div>
  
  let mainContent = html;
  
  // Try to isolate the main content area
  const mainMatch = html.match(/<div\s+id=["']main["'][^>]*>([\s\S]*?)(?:<footer|<div\s+class=["']footer)/i);
  if (mainMatch) {
    mainContent = mainMatch[1];
  }
  
  // Extract the intro paragraph (before the listings widget)
  const introMatch = mainContent.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)(?:<div[^>]*id=["']hw-search|<div[^>]*class="[^"]*(?:block--featured|teasers))/i);
  
  // Extract content sections - find all h2/h3 headings and their content
  // These are the SEO content blocks
  const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  const sectionBlocks = [];
  
  // Find all h2 elements and the content between them
  let h2Match;
  const h2Positions = [];
  while ((h2Match = h2Regex.exec(mainContent)) !== null) {
    h2Positions.push({
      heading: h2Match[1].replace(/<[^>]+>/g, '').trim(),
      headingHtml: h2Match[1].trim(),
      index: h2Match.index,
      endIndex: h2Match.index + h2Match[0].length
    });
  }
  
  // For each h2, extract the content until the next h2 or end of main
  for (let i = 0; i < h2Positions.length; i++) {
    const startIdx = h2Positions[i].endIndex;
    const endIdx = i + 1 < h2Positions.length ? h2Positions[i + 1].index : mainContent.length;
    const sectionHtml = mainContent.substring(startIdx, endIdx);
    
    // Skip sections that are just listings widgets or navigation
    if (h2Positions[i].heading.includes('Homes for Sale') && sectionHtml.includes('hw-search')) continue;
    
    // Extract paragraphs from this section
    const paragraphs = [];
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let pMatch;
    while ((pMatch = pRegex.exec(sectionHtml)) !== null) {
      const text = pMatch[1].trim();
      if (text && !text.includes('MLS®') && !text.includes('The information being provided')) {
        paragraphs.push(text);
      }
    }
    
    // Extract h3 sub-headings
    const h3s = [];
    const h3Regex = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;
    let h3Match;
    while ((h3Match = h3Regex.exec(sectionHtml)) !== null) {
      h3s.push(h3Match[1].replace(/<[^>]+>/g, '').trim());
    }
    
    if (paragraphs.length > 0 || h3s.length > 0) {
      sectionBlocks.push({
        heading: h2Positions[i].heading,
        paragraphs,
        subHeadings: h3s,
        rawHtml: `<h2>${h2Positions[i].headingHtml}</h2>${sectionHtml}`
      });
    }
  }
  
  // Also extract the first intro paragraph(s) before any h2
  if (h2Positions.length > 0) {
    const introHtml = mainContent.substring(0, h2Positions[0].index);
    const introParagraphs = [];
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let pMatch;
    while ((pMatch = pRegex.exec(introHtml)) !== null) {
      const text = pMatch[1].trim();
      if (text && text.length > 30 && !text.includes('Click the links')) {
        introParagraphs.push(text);
      }
    }
    if (introParagraphs.length > 0) {
      sectionBlocks.unshift({
        heading: '_intro',
        paragraphs: introParagraphs,
        subHeadings: [],
        rawHtml: introParagraphs.map(p => `<p>${p}</p>`).join('\n')
      });
    }
  }
  
  // Extract all images from the content
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?[^>]*>/gi;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(mainContent)) !== null) {
    const src = imgMatch[1];
    const alt = imgMatch[2] || '';
    // Skip tiny icons, tracking pixels, logos
    if (!src.includes('1x1') && !src.includes('pixel') && !src.includes('favicon') && 
        !src.includes('logo') && !src.includes('google') && !src.includes('facebook') &&
        !src.includes('badge') && !src.includes('feed-images') && !src.includes('icon')) {
      images.push({ src, alt });
    }
  }
  
  // Extract all internal links
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(mainContent)) !== null) {
    const href = linkMatch[1];
    const text = linkMatch[2].replace(/<[^>]+>/g, '').trim();
    // Only internal community-related links
    if ((href.startsWith('/') || href.includes('spyglassrealty.com')) && 
        text.length > 0 && !href.includes('login') && !href.includes('dashboard') &&
        !href.includes('listing/') && !href.includes('javascript:')) {
      links.push({ href, text });
    }
  }
  
  // Extract sub-community links from sidebar
  const subCommunityLinks = [];
  const sidebarMatch = mainContent.match(/<div[^>]*class="[^"]*sidebar[^"]*"[^>]*>([\s\S]*?)<\/div>/gi);
  if (sidebarMatch) {
    for (const sidebar of sidebarMatch) {
      const slRegex = /<a[^>]+href=["']([^"']+\.php)["'][^>]*>([\s\S]*?)<\/a>/gi;
      let slMatch;
      while ((slMatch = slRegex.exec(sidebar)) !== null) {
        const href = slMatch[1];
        const text = slMatch[2].replace(/<[^>]+>/g, '').trim();
        if (text.length > 0) {
          subCommunityLinks.push({ href, text });
        }
      }
    }
  }
  
  // Extract footer community links
  const footerLinksMatch = mainContent.match(/<div[^>]*class="[^"]*footer__content[^"]*"[^>]*>([\s\S]*?)<\/div>/gi);
  const footerCommunityLinks = [];
  if (footerLinksMatch) {
    for (const footer of footerLinksMatch) {
      const flRegex = /<a[^>]+href=["']([^"']+\.php)["'][^>]*>([\s\S]*?)<\/a>/gi;
      let flMatch;
      while ((flMatch = flRegex.exec(footer)) !== null) {
        const href = flMatch[1];
        const text = flMatch[2].replace(/<[^>]+>/g, '').trim();
        if (text.length > 0) {
          footerCommunityLinks.push({ href, text });
        }
      }
    }
  }
  
  return { sections: sectionBlocks, images, links, subCommunityLinks, footerCommunityLinks };
}

function cleanHtml(html) {
  // Remove script tags
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  // Remove style tags
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '');
  // Remove comments
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  return html;
}

async function scrapePage(pageInfo) {
  const fullUrl = `${BASE_URL}${pageInfo.url}`;
  console.log(`  Fetching: ${fullUrl}`);
  
  const html = await fetchUrl(fullUrl);
  if (!html) {
    console.log(`  ❌ Page not found or error: ${pageInfo.url}`);
    return null;
  }
  
  const cleanedHtml = cleanHtml(html);
  const title = extractTitle(html);
  const metaDescription = extractMetaDescription(html);
  const heroImage = extractHeroImage(html);
  const { sections, images, links, subCommunityLinks, footerCommunityLinks } = extractContentSections(cleanedHtml);
  
  console.log(`  ✅ ${pageInfo.slug}: ${title} | ${sections.length} sections | ${images.length} images`);
  
  return {
    slug: pageInfo.slug,
    sourceUrl: pageInfo.url,
    title,
    metaDescription,
    heroImage,
    sections,
    images,
    internalLinks: links,
    subCommunityLinks,
    footerCommunityLinks,
    scrapedAt: new Date().toISOString()
  };
}

async function downloadImages(communityData) {
  if (!communityData || !communityData.images || communityData.images.length === 0) return;
  
  const imgDir = join(PROJECT_ROOT, 'public', 'images', 'communities', communityData.slug);
  mkdirSync(imgDir, { recursive: true });
  
  for (const img of communityData.images) {
    let imgUrl = img.src;
    if (imgUrl.startsWith('/')) {
      imgUrl = `${BASE_URL}${imgUrl}`;
    } else if (!imgUrl.startsWith('http')) {
      imgUrl = `${BASE_URL}/${imgUrl}`;
    }
    
    const filename = imgUrl.split('/').pop().split('?')[0];
    if (!filename) continue;
    
    const destPath = join(imgDir, filename);
    if (existsSync(destPath)) {
      console.log(`  ⏭ Image exists: ${filename}`);
      continue;
    }
    
    console.log(`  📥 Downloading: ${filename}`);
    const ok = await downloadFile(imgUrl, destPath);
    if (ok) {
      img.localPath = `/images/communities/${communityData.slug}/${filename}`;
    }
  }
  
  // Download hero image too
  if (communityData.heroImage) {
    let heroUrl = communityData.heroImage;
    if (heroUrl.startsWith('/')) heroUrl = `${BASE_URL}${heroUrl}`;
    else if (!heroUrl.startsWith('http')) heroUrl = `${BASE_URL}/${heroUrl}`;
    
    const filename = heroUrl.split('/').pop().split('?')[0];
    if (filename) {
      const destPath = join(imgDir, filename);
      if (!existsSync(destPath)) {
        console.log(`  📥 Downloading hero: ${filename}`);
        const ok = await downloadFile(heroUrl, destPath);
        if (ok) {
          communityData.heroImageLocal = `/images/communities/${communityData.slug}/${filename}`;
        }
      } else {
        communityData.heroImageLocal = `/images/communities/${communityData.slug}/${filename}`;
      }
    }
  }
}

async function main() {
  console.log('🔍 Scraping Spyglass Realty community pages...\n');
  
  const allResults = [];
  
  // Scrape main community pages
  console.log('📄 Scraping main community pages...');
  for (const page of COMMUNITY_PAGES) {
    const result = await scrapePage(page);
    if (result) allResults.push(result);
    // Small delay to be polite
    await new Promise(r => setTimeout(r, 300));
  }
  
  // Check zip code pages
  console.log('\n📄 Checking zip code pages...');
  let zipFound = 0;
  for (const page of ZIP_PAGES) {
    const result = await scrapePage(page);
    if (result) {
      allResults.push(result);
      zipFound++;
    }
    await new Promise(r => setTimeout(r, 200));
  }
  console.log(`  Found ${zipFound} zip code pages`);
  
  // Check extra neighborhood pages
  console.log('\n📄 Checking extra neighborhood pages...');
  for (const page of EXTRA_PAGES) {
    const result = await scrapePage(page);
    if (result) allResults.push(result);
    await new Promise(r => setTimeout(r, 200));
  }
  
  // Download images
  console.log('\n📥 Downloading images...');
  for (const community of allResults) {
    await downloadImages(community);
  }
  
  // Save the scraped data
  const outputPath = join(PROJECT_ROOT, 'src', 'data', 'scraped-community-content.json');
  writeFileSync(outputPath, JSON.stringify(allResults, null, 2));
  console.log(`\n✅ Saved ${allResults.length} communities to ${outputPath}`);
  
  // Print summary
  console.log('\n📊 Summary:');
  console.log(`  Total pages scraped: ${allResults.length}`);
  console.log(`  Pages with content sections: ${allResults.filter(r => r.sections.length > 0).length}`);
  console.log(`  Total images found: ${allResults.reduce((sum, r) => sum + r.images.length, 0)}`);
  console.log(`  Total internal links: ${allResults.reduce((sum, r) => sum + r.internalLinks.length, 0)}`);
}

main().catch(console.error);

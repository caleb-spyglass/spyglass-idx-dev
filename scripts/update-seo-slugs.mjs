#!/usr/bin/env node

/**
 * Update SEO Slugs Script
 * 
 * Adds new slugs from scraped-community-content.json to ALL_SEO_SLUGS 
 * in seo-url-aliases.ts
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const SCRAPED_JSON_PATH = join(__dirname, '..', 'src', 'data', 'scraped-community-content.json');
const SEO_ALIASES_PATH = join(__dirname, '..', 'src', 'data', 'seo-url-aliases.ts');

function updateSeoAliases() {
  console.log('Reading scraped content...');
  
  // Load scraped content to get all slugs
  const scrapedContent = JSON.parse(readFileSync(SCRAPED_JSON_PATH, 'utf-8'));
  const scrapedSlugs = scrapedContent.map(item => item.slug).sort();
  
  console.log(`Found ${scrapedSlugs.length} scraped content slugs`);
  
  // Load current seo-url-aliases.ts file
  const currentContent = readFileSync(SEO_ALIASES_PATH, 'utf-8');
  
  // Extract current ALL_SEO_SLUGS array
  const arrayStartMatch = currentContent.match(/export const ALL_SEO_SLUGS: string\[\] = \[/);
  if (!arrayStartMatch) {
    console.error('Could not find ALL_SEO_SLUGS array in seo-url-aliases.ts');
    process.exit(1);
  }
  
  const arrayStart = arrayStartMatch.index + arrayStartMatch[0].length;
  let arrayEnd = -1;
  let bracketCount = 1;
  let inString = false;
  let stringChar = '';
  
  // Find the end of the array
  for (let i = arrayStart; i < currentContent.length; i++) {
    const char = currentContent[i];
    
    if (!inString) {
      if (char === '"' || char === "'" || char === '`') {
        inString = true;
        stringChar = char;
      } else if (char === '[') {
        bracketCount++;
      } else if (char === ']') {
        bracketCount--;
        if (bracketCount === 0) {
          arrayEnd = i;
          break;
        }
      }
    } else {
      if (char === stringChar && currentContent[i - 1] !== '\\') {
        inString = false;
      }
    }
  }
  
  if (arrayEnd === -1) {
    console.error('Could not find end of ALL_SEO_SLUGS array');
    process.exit(1);
  }
  
  // Parse current slugs from the array
  const arrayContentMatch = currentContent.slice(arrayStart, arrayEnd).match(/'([^']+)'/g);
  const currentSlugs = arrayContentMatch ? arrayContentMatch.map(m => m.slice(1, -1)) : [];
  
  console.log(`Current ALL_SEO_SLUGS has ${currentSlugs.length} slugs`);
  
  // Merge slugs (remove duplicates)
  const allSlugs = [...new Set([...currentSlugs, ...scrapedSlugs])].sort();
  
  console.log(`Combined total: ${allSlugs.length} slugs`);
  console.log(`Added ${allSlugs.length - currentSlugs.length} new slugs`);
  
  // Build new array content
  const newArrayContent = allSlugs.map(slug => `  '${slug}',`).join('\n');
  
  // Replace the array in the file
  const beforeArray = currentContent.slice(0, arrayStart);
  const afterArray = currentContent.slice(arrayEnd);
  const newContent = beforeArray + '\n' + newArrayContent + '\n' + afterArray;
  
  // Write updated file
  writeFileSync(SEO_ALIASES_PATH, newContent);
  
  console.log(`✅ Updated ${SEO_ALIASES_PATH}`);
  console.log(`Total slugs now: ${allSlugs.length}`);
}

// Run the update
if (import.meta.url === `file://${process.argv[1]}`) {
  updateSeoAliases();
}
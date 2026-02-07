#!/usr/bin/env node
/**
 * Scrape neighborhood polygon data from Realty Austin API
 * Uses concurrency with proper timeouts
 */

import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, '..', 'data', 'realtyaustin-neighborhoods.json');
const CHECKPOINT_PATH = join(__dirname, '..', 'data', 'realtyaustin-checkpoint.json');
const SITEMAP_URL = 'https://www.realtyaustin.com/neighborhoods.xml';
const POLYGON_API = 'https://www.realtyaustin.com/api/polygon';
const CONCURRENCY = 10;
const REQUEST_TIMEOUT = 5000;

async function fetchSitemap() {
  console.log('Fetching sitemap...');
  const res = await fetch(SITEMAP_URL);
  const xml = await res.text();
  
  const urlRegex = /<loc>(https:\/\/www\.realtyaustin\.com\/listings\/neighborhood\/[^<]+)<\/loc>/g;
  const urls = [];
  let match;
  while ((match = urlRegex.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  console.log(`Found ${urls.length} neighborhood URLs`);
  return urls;
}

function parseUrl(fullUrl) {
  const match = fullUrl.match(/\/listings(\/neighborhood\/(?:[^\/]+\/)?tx\/([^\/]+)\/([^\/]+))/);
  if (!match) {
    const m2 = fullUrl.match(/\/listings(\/neighborhood\/.+)/);
    if (!m2) return null;
    const parts = m2[1].split('/').filter(Boolean);
    return { urlPath: m2[1], city: parts[parts.length - 2] || 'unknown', slug: parts[parts.length - 1] || 'unknown' };
  }
  return { urlPath: match[1], city: match[2], slug: match[3] };
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

async function processOne(fullUrl) {
  const parsed = parseUrl(fullUrl);
  if (!parsed) return { success: false, url: fullUrl, error: 'parse' };
  
  try {
    const url = `${POLYGON_API}?url=${encodeURIComponent(parsed.urlPath)}`;
    const res = await fetchWithTimeout(url, REQUEST_TIMEOUT);
    if (!res.ok) return { success: false, slug: parsed.slug, city: parsed.city, error: `HTTP ${res.status}` };
    
    const data = await res.json();
    
    if (data?.geometry?.coordinates) {
      let polygon = null;
      if (data.geometry.type === 'MultiPolygon' && data.geometry.coordinates[0]?.[0]) {
        polygon = data.geometry.coordinates[0][0];
      } else if (data.geometry.type === 'Polygon' && data.geometry.coordinates[0]) {
        polygon = data.geometry.coordinates[0];
      }
      
      if (polygon) {
        return {
          success: true,
          result: {
            name: data.name || parsed.slug,
            slug: parsed.slug,
            city: parsed.city,
            centroid: data.centroid?.coordinates || null,
            polygon,
            source: 'realtyaustin'
          }
        };
      }
    }
    return { success: false, slug: parsed.slug, city: parsed.city, error: 'no-geometry' };
  } catch (err) {
    return { success: false, slug: parsed.slug, city: parsed.city, error: err.name === 'AbortError' ? 'timeout' : err.message };
  }
}

// Simple concurrency pool
async function processAll(urls) {
  const results = [];
  const failed = [];
  let idx = 0;
  let active = 0;
  const startTime = Date.now();
  
  return new Promise((resolve) => {
    function next() {
      while (active < CONCURRENCY && idx < urls.length) {
        const currentIdx = idx++;
        active++;
        processOne(urls[currentIdx]).then(r => {
          active--;
          if (r.success) results.push(r.result);
          else failed.push(r);
          
          const done = results.length + failed.length;
          if (done % 500 === 0) {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            console.log(`Progress: ${done}/${urls.length} (${results.length} valid, ${failed.length} failed) [${elapsed}s]`);
            // Checkpoint
            writeFileSync(CHECKPOINT_PATH, JSON.stringify({ results: results.length, failed: failed.length, done }));
          }
          
          if (done === urls.length) {
            resolve({ results, failed });
          } else {
            next();
          }
        });
      }
    }
    next();
  });
}

async function main() {
  const urls = await fetchSitemap();
  const startTime = Date.now();
  
  const { results, failed } = await processAll(urls);
  
  writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2));
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  
  console.log(`\n========== RESULTS ==========`);
  console.log(`Total neighborhoods in sitemap: ${urls.length}`);
  console.log(`Valid polygon data: ${results.length}`);
  console.log(`Failed/no polygon: ${failed.length}`);
  console.log(`Time: ${totalTime}s`);
  console.log(`Saved to: ${OUTPUT_PATH}`);
  
  // Group failures by error type
  const errorCounts = {};
  for (const f of failed) {
    errorCounts[f.error] = (errorCounts[f.error] || 0) + 1;
  }
  console.log(`\nFailure breakdown:`);
  for (const [err, count] of Object.entries(errorCounts).sort((a,b) => b[1] - a[1])) {
    console.log(`  ${err}: ${count}`);
  }
  
  if (failed.length <= 100) {
    console.log(`\n--- All failed ---`);
    for (const f of failed) {
      console.log(`  ${f.slug || f.url}: ${f.error}`);
    }
  }
  
  // Cleanup checkpoint
  try { require('fs').unlinkSync(CHECKPOINT_PATH); } catch(e) {}
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Pull neighborhood boundaries from Repliers API and merge with existing communities-polygons.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_KEY = 'sSOnHkc9wVilKtkd7N2qRs2R2WMH00';
const BASE_URL = 'https://api.repliers.io/locations';

const COUNTIES = ['Travis', 'Williamson', 'Hays'];

async function fetchAllNeighborhoods(county) {
  const results = [];
  let page = 1;
  let totalPages = 1;
  
  while (page <= totalPages) {
    const url = `${BASE_URL}?hasBoundary=true&type=neighborhood&area=${county}&resultsPerPage=200&pageNum=${page}`;
    console.log(`  Fetching ${county} page ${page}...`);
    
    const resp = await fetch(url, {
      headers: { 'REPLIERS-API-KEY': API_KEY }
    });
    
    if (!resp.ok) {
      console.error(`  ERROR: ${resp.status} ${resp.statusText}`);
      break;
    }
    
    const data = await resp.json();
    
    if (page === 1) {
      totalPages = data.numPages || 1;
      console.log(`  Total: ${data.count} neighborhoods, ${totalPages} pages`);
    }
    
    const locations = data.locations || data.results || [];
    for (const loc of locations) {
      if (loc.map?.boundary?.length > 0) {
        results.push({
          name: loc.name,
          boundary: loc.map.boundary,
          county: county
        });
      }
    }
    
    page++;
  }
  
  return results;
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractCoordRing(ringData) {
  // ringData might be [[lng,lat], ...] or [[[lng,lat], ...]]
  if (!ringData || ringData.length === 0) return [];
  
  // Check if first element is a coordinate pair or another array
  const first = ringData[0];
  if (Array.isArray(first) && Array.isArray(first[0])) {
    // It's [[[lng,lat], ...]] - unwrap one level
    return first.filter(c => 
      Array.isArray(c) && c.length === 2 && typeof c[0] === 'number' && typeof c[1] === 'number'
    );
  } else if (Array.isArray(first) && first.length === 2 && typeof first[0] === 'number') {
    // It's [[lng,lat], ...] - already coords
    return ringData.filter(c => 
      Array.isArray(c) && c.length === 2 && typeof c[0] === 'number' && typeof c[1] === 'number'
    );
  }
  return [];
}

function convertBoundaryToPolygons(boundary) {
  // boundary can be:
  // [[[lng,lat], ...]] - single ring
  // [ [[[lng,lat],...]], [[[lng,lat],...]] ] - multi-polygon (multiple rings)
  
  if (!boundary || boundary.length === 0) return null;
  
  // Extract all rings and pick the largest one (most coords = outer boundary)
  let bestRing = [];
  for (const ringData of boundary) {
    const coords = extractCoordRing(Array.isArray(ringData) ? ringData : [ringData]);
    if (coords.length > bestRing.length) {
      bestRing = coords;
    }
  }
  
  // Also check if boundary itself is a single ring: [[lng,lat], ...]
  if (bestRing.length < 3) {
    const directCoords = extractCoordRing(boundary);
    if (directCoords.length > bestRing.length) {
      bestRing = directCoords;
    }
  }
  
  if (bestRing.length < 3) return null;
  
  // polygon is [lng, lat] format (for Repliers API)
  const polygon = bestRing.map(([lng, lat]) => [lng, lat]);
  // displayPolygon is [lat, lng] format (for Leaflet)
  const displayPolygon = bestRing.map(([lng, lat]) => [lat, lng]);
  
  return { polygon, displayPolygon };
}

function calculateBounds(displayPolygon) {
  // displayPolygon is [lat, lng]
  let north = -Infinity, south = Infinity, east = -Infinity, west = Infinity;
  for (const [lat, lng] of displayPolygon) {
    if (lat > north) north = lat;
    if (lat < south) south = lat;
    if (lng > east) east = lng;
    if (lng < west) west = lng;
  }
  return { north, south, east, west };
}

async function main() {
  console.log('=== Repliers Neighborhood Boundary Merger ===\n');
  
  // Step 1: Read existing data
  const existingPath = path.join(__dirname, '..', 'src', 'data', 'communities-polygons.ts');
  const existingContent = fs.readFileSync(existingPath, 'utf8');
  
  // Parse existing communities from the TS file
  // Find the COMMUNITIES array - it ends with ]; before the next export
  const startMatch = existingContent.match(/export const COMMUNITIES[^=]*=\s*/);
  if (!startMatch) {
    console.error('Could not find COMMUNITIES declaration');
    process.exit(1);
  }
  
  const arrayStart = startMatch.index + startMatch[0].length;
  // Find the matching closing bracket
  let depth = 0;
  let arrayEnd = -1;
  for (let i = arrayStart; i < existingContent.length; i++) {
    if (existingContent[i] === '[') depth++;
    if (existingContent[i] === ']') {
      depth--;
      if (depth === 0) {
        arrayEnd = i + 1;
        break;
      }
    }
  }
  
  if (arrayEnd === -1) {
    console.error('Could not find end of COMMUNITIES array');
    process.exit(1);
  }
  
  const arrayStr = existingContent.substring(arrayStart, arrayEnd);
  let existing;
  try {
    existing = JSON.parse(arrayStr);
  } catch (e) {
    existing = eval(arrayStr);
  }
  
  console.log(`Existing communities: ${existing.length}`);
  
  // Build lookup by normalized name
  const existingByName = new Map();
  for (const c of existing) {
    existingByName.set(c.name.toLowerCase().trim(), c);
  }
  
  // Step 2: Fetch all neighborhoods from Repliers
  console.log('\nFetching from Repliers API...');
  const allRepliers = [];
  
  for (const county of COUNTIES) {
    console.log(`\n${county} County:`);
    const neighborhoods = await fetchAllNeighborhoods(county);
    console.log(`  Got ${neighborhoods.length} neighborhoods with boundaries`);
    allRepliers.push(...neighborhoods);
  }
  
  console.log(`\nTotal Repliers neighborhoods: ${allRepliers.length}`);
  
  // Step 3: Merge
  let newCount = 0;
  let matchedCount = 0;
  let skippedCount = 0;
  const newEntries = [];
  
  // Track which Repliers names we've seen to handle duplicates across counties
  const seenNames = new Map();
  
  for (const rep of allRepliers) {
    const normalizedName = rep.name.toLowerCase().trim();
    
    // Skip duplicates from different county queries
    if (seenNames.has(normalizedName)) {
      skippedCount++;
      continue;
    }
    seenNames.set(normalizedName, true);
    
    if (existingByName.has(normalizedName)) {
      matchedCount++;
      // Update county if needed
      const existingEntry = existingByName.get(normalizedName);
      if (existingEntry.county !== rep.county) {
        console.log(`  County update: ${rep.name} ${existingEntry.county} → ${rep.county}`);
      }
      continue;
    }
    
    // New neighborhood - convert and add
    const converted = convertBoundaryToPolygons(rep.boundary);
    if (!converted) {
      console.log(`  Skipping ${rep.name} - no valid boundary`);
      continue;
    }
    
    const entry = {
      name: rep.name.toUpperCase(),
      slug: slugify(rep.name),
      polygon: converted.polygon,
      displayPolygon: converted.displayPolygon,
      county: rep.county,
      featured: false
    };
    
    newEntries.push(entry);
    newCount++;
  }
  
  console.log(`\n=== Results ===`);
  console.log(`Matched (already exist): ${matchedCount}`);
  console.log(`New neighborhoods to add: ${newCount}`);
  console.log(`Duplicates across counties: ${skippedCount}`);
  
  // Step 4: Combine and sort
  // Deduplicate by slug in case existing data has dupes
  const slugSet = new Set();
  const deduped = [];
  for (const c of [...existing, ...newEntries]) {
    if (!slugSet.has(c.slug)) {
      slugSet.add(c.slug);
      deduped.push(c);
    }
  }
  const merged = deduped.sort((a, b) => a.name.localeCompare(b.name));
  
  console.log(`Total communities after merge: ${merged.length}`);
  
  // Step 5: Write updated file
  const header = `// Auto-generated - Simplified polygons
// Run: node scripts/simplify-polygons.mjs

export interface CommunityPolygon {
  name: string;
  slug: string;
  polygon: [number, number][]; // [lng, lat] for Repliers API
  displayPolygon: [number, number][]; // [lat, lng] for Leaflet
  county: string;
  featured: boolean;
}

export const COMMUNITIES: CommunityPolygon[] = `;
  
  const footer = `

export function getCommunityBySlug(slug: string): CommunityPolygon | undefined {
  return COMMUNITIES.find(c => c.slug === slug);
}

export function getCommunityByName(name: string): CommunityPolygon | undefined {
  return COMMUNITIES.find(c => c.name.toLowerCase() === name.toLowerCase());
}

export function getFeaturedCommunities(): CommunityPolygon[] {
  return COMMUNITIES.filter(c => c.featured);
}
`;
  const output = header + JSON.stringify(merged, null, 2) + ';' + footer;
  
  fs.writeFileSync(existingPath, output);
  console.log(`\nWrote ${existingPath}`);
  console.log(`File size: ${(Buffer.byteLength(output) / 1024 / 1024).toFixed(2)} MB`);
  
  // List new entries
  if (newEntries.length > 0) {
    console.log(`\n=== New Neighborhoods Added ===`);
    for (const e of newEntries.sort((a, b) => a.name.localeCompare(b.name))) {
      console.log(`  ${e.name} (${e.county})`);
    }
  }
}

main().catch(console.error);

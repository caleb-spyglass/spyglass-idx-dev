#!/usr/bin/env node
/**
 * Merge Realty Austin neighborhood polygons into communities-polygons.ts
 * 
 * Rules:
 * - Keep existing polygons (authoritative)
 * - Add new Austin-area neighborhoods only
 * - Simplify large polygons (>200 points) with Douglas-Peucker
 * - Assign county based on centroid
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import simplify from '@turf/simplify';
import { polygon as turfPolygon } from '@turf/helpers';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// === Config ===
// Only Travis, Williamson, and Hays county cities. NO Bastrop.
const ALLOWED_CITIES = new Set([
  // Travis County
  'austin', 'bee-cave', 'bee cave', 'lakeway', 'spicewood',
  'west-lake-hills', 'west lake hills', 'rollingwood',
  'sunset-valley', 'sunset valley', 'lago-vista', 'lago vista',
  'del-valle', 'del valle', 'manchaca', 'barton-creek', 'barton creek',
  'lost-creek', 'lost creek', 'pflugerville', 'manor',
  'jonestown', 'volente', 'creedmoor',
  'brushy-creek', 'brushy creek',
  // Williamson County
  'cedar-park', 'cedar park', 'leander', 'round-rock', 'round rock',
  'georgetown', 'hutto', 'liberty-hill', 'liberty hill', 'jarrell',
  // Hays County
  'dripping-springs', 'dripping springs', 'kyle', 'buda',
  'driftwood', 'wimberley', 'san-marcos', 'san marcos',
]);

// Counties we keep — everything else gets dropped
const ALLOWED_COUNTIES = new Set(['Travis', 'Williamson', 'Hays']);

const MAX_POINTS = 200;
const TARGET_TOLERANCE = 0.0005; // ~50m at Austin's latitude

// === Load existing data ===
console.log('Loading existing communities-polygons.ts...');
const tsContent = readFileSync(join(ROOT, 'src/data/communities-polygons.ts'), 'utf-8');

// Extract the array content between the brackets
const arrayMatch = tsContent.match(/export const COMMUNITIES: CommunityPolygon\[\] = (\[[\s\S]*?\n\]);/);
if (!arrayMatch) {
  console.error('Could not parse existing communities array');
  process.exit(1);
}

// Parse the existing communities using eval (it's valid JS)
let existingCommunities;
try {
  existingCommunities = eval(arrayMatch[1]);
} catch (e) {
  console.error('Failed to eval existing array:', e.message);
  process.exit(1);
}
console.log(`Loaded ${existingCommunities.length} existing communities`);

// Build a set of existing names (lowercased) for dedup
const existingNames = new Set(existingCommunities.map(c => c.name.toLowerCase().trim()));
const existingSlugs = new Set(existingCommunities.map(c => c.slug));

// === Load Realty Austin data ===
console.log('Loading realtyaustin-neighborhoods.json...');
const raData = JSON.parse(readFileSync(join(ROOT, 'data/realtyaustin-neighborhoods.json'), 'utf-8'));
console.log(`Loaded ${raData.length} Realty Austin neighborhoods`);

// === Helpers ===
function makeSlug(name) {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function assignCounty(centroid) {
  const [lng, lat] = centroid;
  
  // Bastrop County: east side — will be filtered out
  if (lng > -97.5) return 'Bastrop';
  
  // Williamson County: north
  if (lat > 30.45) return 'Williamson';
  
  // Hays County: south
  if (lat < 30.2) return 'Hays';
  
  // Default: Travis
  return 'Travis';
}

function simplifyPolygon(coords) {
  if (coords.length <= MAX_POINTS) return coords;
  
  // Ensure the ring is closed for turf
  let ring = [...coords];
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push([...first]);
  }
  
  try {
    const poly = turfPolygon([ring]);
    let tolerance = TARGET_TOLERANCE;
    let simplified = simplify(poly, { tolerance, highQuality: true });
    let points = simplified.geometry.coordinates[0];
    
    // If still too many, increase tolerance
    let attempts = 0;
    while (points.length > MAX_POINTS && attempts < 10) {
      tolerance *= 1.5;
      simplified = simplify(poly, { tolerance, highQuality: true });
      points = simplified.geometry.coordinates[0];
      attempts++;
    }
    
    // Remove closing point if it duplicates the first
    if (points.length > 1) {
      const f = points[0];
      const l = points[points.length - 1];
      if (f[0] === l[0] && f[1] === l[1]) {
        points = points.slice(0, -1);
      }
    }
    
    return points;
  } catch (e) {
    console.warn(`  Simplify failed: ${e.message}, using original`);
    return coords;
  }
}

function swapCoords(polygon) {
  return polygon.map(([lng, lat]) => [lat, lng]);
}

function computeCentroid(polygon) {
  let sumLng = 0, sumLat = 0;
  for (const [lng, lat] of polygon) {
    sumLng += lng;
    sumLat += lat;
  }
  return [sumLng / polygon.length, sumLat / polygon.length];
}

// === Filter existing communities: remove Bastrop county ===
const filteredExisting = existingCommunities.filter(c => {
  if (c.county === 'Bastrop') return false;
  // Also check by centroid if county field is wrong/missing
  if (c.polygon && c.polygon.length > 0) {
    const cent = computeCentroid(c.polygon);
    const county = assignCounty(cent);
    if (!ALLOWED_COUNTIES.has(county)) return false;
  }
  return true;
});
const removedExisting = existingCommunities.length - filteredExisting.length;
console.log(`Removed ${removedExisting} existing communities outside Travis/Williamson/Hays`);

// Rebuild name/slug sets from filtered existing
const filteredNames = new Set(filteredExisting.map(c => c.name.toLowerCase().trim()));
const filteredSlugs = new Set(filteredExisting.map(c => c.slug));

// === Filter and merge ===
let added = 0;
let skippedCity = 0;
let skippedDup = 0;
let skippedNoPolygon = 0;
let skippedCounty = 0;
let simplified = 0;

const newCommunities = [];

for (const neighborhood of raData) {
  const city = (neighborhood.city || '').toLowerCase().trim();
  
  // Filter by allowed cities
  if (!ALLOWED_CITIES.has(city)) {
    skippedCity++;
    continue;
  }
  
  // Check for duplicates against filtered existing
  const nameLower = neighborhood.name.toLowerCase().trim();
  if (filteredNames.has(nameLower)) {
    skippedDup++;
    continue;
  }
  
  // Must have polygon data
  if (!neighborhood.polygon || neighborhood.polygon.length < 3) {
    skippedNoPolygon++;
    continue;
  }
  
  // Assign county and reject if not in allowed counties
  const centroid = neighborhood.centroid || computeCentroid(neighborhood.polygon);
  const county = assignCounty(centroid);
  if (!ALLOWED_COUNTIES.has(county)) {
    skippedCounty++;
    continue;
  }
  
  // Generate slug and check for slug collisions
  let slug = makeSlug(neighborhood.name);
  if (filteredSlugs.has(slug)) {
    // Name didn't match but slug did - add city suffix
    slug = `${slug}-${makeSlug(city)}`;
  }
  
  // Simplify if needed
  let polygon = neighborhood.polygon;
  const originalPoints = polygon.length;
  if (polygon.length > MAX_POINTS) {
    polygon = simplifyPolygon(polygon);
    simplified++;
  }
  
  const entry = {
    name: neighborhood.name,
    slug: slug,
    polygon: polygon,
    displayPolygon: swapCoords(polygon),
    county: county,
    featured: false,
  };
  
  newCommunities.push(entry);
  filteredNames.add(nameLower);
  filteredSlugs.add(slug);
  added++;
}

console.log(`\n=== Merge Results ===`);
console.log(`Original existing: ${existingCommunities.length}`);
console.log(`Removed (Bastrop/other): ${removedExisting}`);
console.log(`Kept existing: ${filteredExisting.length}`);
console.log(`New added: ${added}`);
console.log(`Skipped (wrong city): ${skippedCity}`);
console.log(`Skipped (duplicate): ${skippedDup}`);
console.log(`Skipped (wrong county): ${skippedCounty}`);
console.log(`Skipped (no polygon): ${skippedNoPolygon}`);
console.log(`Polygons simplified: ${simplified}`);
console.log(`Total after merge: ${filteredExisting.length + added}`);

// === Sort all communities by name ===
const allCommunities = [...filteredExisting, ...newCommunities];
allCommunities.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

// === Write output ===
console.log('\nWriting merged communities-polygons.ts...');

// Build output efficiently using string concatenation
const lines = [];
lines.push('// Auto-generated - Simplified polygons');
lines.push('// Run: node scripts/simplify-polygons.mjs');
lines.push('');
lines.push('export interface CommunityPolygon {');
lines.push('  name: string;');
lines.push('  slug: string;');
lines.push('  polygon: [number, number][]; // [lng, lat] for Repliers API');
lines.push('  displayPolygon: [number, number][]; // [lat, lng] for Leaflet');
lines.push('  county: string;');
lines.push('  featured: boolean;');
lines.push('}');
lines.push('');
lines.push('export const COMMUNITIES: CommunityPolygon[] = [');

for (let i = 0; i < allCommunities.length; i++) {
  const c = allCommunities[i];
  const comma = i < allCommunities.length - 1 ? ',' : '';
  
  // Format polygon coordinates
  const polyStr = c.polygon.map(p => `[${p[0]},${p[1]}]`).join(',');
  const dispStr = c.displayPolygon.map(p => `[${p[0]},${p[1]}]`).join(',');
  
  // Escape name for JSON
  const escapedName = c.name.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  
  lines.push(`{"name":"${escapedName}","slug":"${c.slug}","polygon":[${polyStr}],"displayPolygon":[${dispStr}],"county":"${c.county}","featured":${c.featured}}${comma}`);
}

lines.push('];');
lines.push('');
lines.push('export function getCommunityBySlug(slug: string): CommunityPolygon | undefined {');
lines.push('  return COMMUNITIES.find(c => c.slug === slug);');
lines.push('}');
lines.push('');
lines.push('export function getCommunityByName(name: string): CommunityPolygon | undefined {');
lines.push('  return COMMUNITIES.find(c => c.name.toLowerCase() === name.toLowerCase());');
lines.push('}');
lines.push('');
lines.push('export function getFeaturedCommunities(): CommunityPolygon[] {');
lines.push('  return COMMUNITIES.filter(c => c.featured);');
lines.push('}');
lines.push('');

const output = lines.join('\n');
writeFileSync(join(ROOT, 'src/data/communities-polygons.ts'), output, 'utf-8');

const fileSizeMB = (Buffer.byteLength(output, 'utf-8') / 1024 / 1024).toFixed(1);
console.log(`Written! File size: ${fileSizeMB} MB`);
console.log(`Total communities: ${allCommunities.length}`);
console.log('Done!');

/**
 * Simplify community polygons to reduce jaggedness
 * Uses Turf.js simplify (Douglas-Peucker algorithm)
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import simplify from '@turf/simplify';
import { polygon } from '@turf/helpers';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read the current polygons file
const polygonsPath = join(__dirname, '../src/data/communities-polygons.ts');
const content = readFileSync(polygonsPath, 'utf-8');

// Extract the COMMUNITIES array
const match = content.match(/export const COMMUNITIES: CommunityPolygon\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('Could not find COMMUNITIES array');
  process.exit(1);
}

// Parse the communities (eval is safe here since we control the file)
const communities = eval(match[1]);

console.log(`Processing ${communities.length} communities...`);

// Simplify each community's polygon
const simplifiedCommunities = communities.map((community, i) => {
  if (!community.polygon || community.polygon.length < 4) {
    console.log(`  Skipping ${community.name} - not enough points`);
    return community;
  }

  try {
    // Convert to GeoJSON polygon format [lng, lat]
    // Close the ring if not closed
    const coords = [...community.polygon];
    if (coords[0][0] !== coords[coords.length-1][0] || coords[0][1] !== coords[coords.length-1][1]) {
      coords.push(coords[0]);
    }

    const poly = polygon([coords]);
    
    // Simplify with tolerance (higher = more simplification)
    // 0.0005 is about 50 meters, good balance between smoothness and accuracy
    const simplified = simplify(poly, { tolerance: 0.0003, highQuality: true });
    
    const newCoords = simplified.geometry.coordinates[0];
    // Remove the closing point (we add it back when needed)
    const openCoords = newCoords.slice(0, -1);

    const originalPoints = community.polygon.length;
    const newPoints = openCoords.length;
    const reduction = Math.round((1 - newPoints / originalPoints) * 100);
    
    console.log(`  ${community.name}: ${originalPoints} → ${newPoints} points (${reduction}% reduction)`);

    return {
      ...community,
      polygon: openCoords,
      displayPolygon: openCoords.map(([lng, lat]) => [lat, lng])
    };
  } catch (err) {
    console.error(`  Error simplifying ${community.name}:`, err.message);
    return community;
  }
});

// Generate the new TypeScript file
const newContent = `// Auto-generated - Simplified polygons
// Run: node scripts/simplify-polygons.mjs

export interface CommunityPolygon {
  name: string;
  slug: string;
  polygon: [number, number][]; // [lng, lat] for Repliers API
  displayPolygon: [number, number][]; // [lat, lng] for Leaflet
  county: string;
  featured: boolean;
}

export const COMMUNITIES: CommunityPolygon[] = ${JSON.stringify(simplifiedCommunities, null, 2)};

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

// Backup original
writeFileSync(polygonsPath + '.backup', content);

// Write simplified version
writeFileSync(polygonsPath, newContent);

console.log(`\n✅ Simplified ${communities.length} communities`);
console.log(`   Backup saved to communities-polygons.ts.backup`);

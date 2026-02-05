import * as fs from 'fs';
import * as path from 'path';

interface Community {
  name: string;
  slug: string;
  polygon: [number, number][]; // [lng, lat] for Repliers/GeoJSON
  displayPolygon: [number, number][]; // [lat, lng] for Leaflet
  county?: string;
  featured?: boolean;
}

// County detection based on known community locations
const TRAVIS_COUNTY = ['ANDERSON MILL', 'WINDSOR PARK', 'DAWSON', 'WEST UNIVERSITY', 'MLK', 'SOUTH RIVER CITY', 'WEST AUSTIN', 'BOULDIN CREEK', 'ZILKER', 'BARTON HILLS', 'TRAVIS HEIGHTS', 'EAST AUSTIN', 'HYDE PARK', 'NORTH LOOP', 'MUELLER', 'CLARKSVILLE', 'TARRYTOWN', 'ROSEDALE', 'ALLANDALE', 'CRESTVIEW', 'BRENTWOOD', 'WOOTEN', 'HIGHLAND', 'CHERRYWOOD', 'FRENCH PLACE', 'HANCOCK', 'NORTH UNIVERSITY', 'PEMBERTON HEIGHTS', 'OLD WEST AUSTIN', 'BRYKER WOODS', 'DEEP EDDY', 'SOUTH LAMAR', 'SOUTH CONGRESS', 'ST EDWARDS', 'GALINDO', 'SOUTH MANCHACA', 'SOUTHEAST', 'MONTOPOLIS', 'GOVALLE', 'JOHNSTON TERRACE', 'ROSEWOOD', 'BLACKLAND', 'DELWOOD', 'PECAN SPRINGS', 'CORONADO HILLS', 'WINDSOR HILLS', 'UNIVERSITY HILLS', 'GEORGIAN ACRES', 'NORTH LAMAR', 'WALNUT CREEK'];
const WILLIAMSON_COUNTY = ['ROUND ROCK', 'CEDAR PARK', 'LEANDER', 'GEORGETOWN', 'PFLUGERVILLE', 'HUTTO', 'LIBERTY HILL', 'TAYLOR', 'JARRELL', 'FLORENCE', 'GRANGER', 'BARTLETT', 'THRALL', 'WEIR', 'WALBURG', 'SUN CITY', 'TERAVISTA', 'AVERY RANCH', 'BRUSHY CREEK', 'FOREST CREEK', 'HIGHLAND HORIZON', 'RANCH AT BRUSHY CREEK', 'PALOMA LAKE', 'CRYSTAL FALLS', 'BLOCK HOUSE CREEK', 'BUTTERCUP CREEK', 'LAKELINE', 'SCOFIELD FARMS', 'SCOFIELD RIDGE', 'WELLS BRANCH'];
const HAYS_COUNTY = ['SAN MARCOS', 'KYLE', 'BUDA', 'DRIPPING SPRINGS', 'WIMBERLEY', 'DRIFTWOOD', 'MOUNTAIN CITY', 'NIEDERWALD', 'UHLAND', 'WOODCREEK'];

const FEATURED = ['ZILKER', 'BARTON HILLS', 'TRAVIS HEIGHTS', 'BOULDIN CREEK', 'SOUTH CONGRESS', 'EAST AUSTIN', 'MUELLER', 'HYDE PARK', 'TARRYTOWN', 'CLARKSVILLE', 'DOWNTOWN', 'THE DOMAIN', 'LAKE TRAVIS', 'WESTLAKE', 'BEE CAVE', 'LAKEWAY'];

function getCounty(name: string): string {
  const upperName = name.toUpperCase();
  if (TRAVIS_COUNTY.some(c => upperName.includes(c))) return 'Travis';
  if (WILLIAMSON_COUNTY.some(c => upperName.includes(c))) return 'Williamson';
  if (HAYS_COUNTY.some(c => upperName.includes(c))) return 'Hays';
  return 'Travis'; // Default to Travis
}

function isFeatured(name: string): boolean {
  return FEATURED.some(f => name.toUpperCase().includes(f));
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parsePolygon(coordString: string): { polygon: [number, number][]; displayPolygon: [number, number][] } {
  const pairs = coordString.split(';');
  const polygon: [number, number][] = [];
  const displayPolygon: [number, number][] = [];
  
  for (const pair of pairs) {
    const [lat, lng] = pair.split(',').map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      polygon.push([lng, lat]); // [lng, lat] for GeoJSON/Repliers
      displayPolygon.push([lat, lng]); // [lat, lng] for Leaflet
    }
  }
  
  return { polygon, displayPolygon };
}

function processCSV(csvPath: string): Community[] {
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n');
  const communities: Community[] = [];
  
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV with quoted fields
    const match = line.match(/^([^,]+),"(.+)"$/);
    if (!match) {
      // Try unquoted format
      const simpleMatch = line.match(/^([^,]+),(.+)$/);
      if (simpleMatch) {
        const [, name, coords] = simpleMatch;
        const { polygon, displayPolygon } = parsePolygon(coords);
        if (polygon.length > 2) {
          communities.push({
            name: name.trim(),
            slug: slugify(name.trim()),
            polygon,
            displayPolygon,
            county: getCounty(name),
            featured: isFeatured(name)
          });
        }
      }
      continue;
    }
    
    const [, name, coords] = match;
    const { polygon, displayPolygon } = parsePolygon(coords);
    
    if (polygon.length > 2) {
      communities.push({
        name: name.trim(),
        slug: slugify(name.trim()),
        polygon,
        displayPolygon,
        county: getCounty(name),
        featured: isFeatured(name)
      });
    }
  }
  
  return communities;
}

// Main
const csvPath = path.join(__dirname, '../data/communities.csv');
const outputPath = path.join(__dirname, '../src/data/communities-polygons.ts');

const communities = processCSV(csvPath);

console.log(`Processed ${communities.length} communities`);
console.log(`Featured: ${communities.filter(c => c.featured).length}`);
console.log(`Travis County: ${communities.filter(c => c.county === 'Travis').length}`);
console.log(`Williamson County: ${communities.filter(c => c.county === 'Williamson').length}`);
console.log(`Hays County: ${communities.filter(c => c.county === 'Hays').length}`);

// Generate TypeScript output
const output = `// Auto-generated from communities.csv - DO NOT EDIT
// Run: npx ts-node scripts/process-communities.ts

export interface CommunityPolygon {
  name: string;
  slug: string;
  polygon: [number, number][]; // [lng, lat] for Repliers API
  displayPolygon: [number, number][]; // [lat, lng] for Leaflet
  county: string;
  featured: boolean;
}

export const COMMUNITIES: CommunityPolygon[] = ${JSON.stringify(communities, null, 2)};

export const FEATURED_COMMUNITIES = COMMUNITIES.filter(c => c.featured);
export const TRAVIS_COMMUNITIES = COMMUNITIES.filter(c => c.county === 'Travis');
export const WILLIAMSON_COMMUNITIES = COMMUNITIES.filter(c => c.county === 'Williamson');
export const HAYS_COMMUNITIES = COMMUNITIES.filter(c => c.county === 'Hays');

export function getCommunityBySlug(slug: string): CommunityPolygon | undefined {
  return COMMUNITIES.find(c => c.slug === slug);
}

export function getCommunityByName(name: string): CommunityPolygon | undefined {
  return COMMUNITIES.find(c => c.name.toLowerCase() === name.toLowerCase());
}
`;

fs.writeFileSync(outputPath, output);
console.log(`\nWrote ${outputPath}`);

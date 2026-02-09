/**
 * Area-based communities (zip codes and cities) that use Repliers API
 * filter params (zip= or city=) instead of polygon data.
 *
 * These are compatible with the existing community system but don't
 * require polygon coordinates.
 */

export type AreaCommunityType = 'zip' | 'city';

export interface AreaCommunity {
  slug: string;
  name: string;
  type: AreaCommunityType;
  /** The raw filter value sent to the API (e.g. "78704" or "Bastrop") */
  filterValue: string;
  /** County for display / grouping */
  county: string;
  /** Short one-liner (used in cards) */
  description: string;
}

// ─── ZIP CODE COMMUNITIES ─────────────────────────────────────────────────

const ZIP_COUNTY_MAP: Record<string, string> = {
  '78701': 'Travis',
  '78702': 'Travis',
  '78703': 'Travis',
  '78704': 'Travis',
  '78705': 'Travis',
  '78717': 'Williamson',
  '78719': 'Travis',
  '78721': 'Travis',
  '78722': 'Travis',
  '78723': 'Travis',
  '78724': 'Travis',
  '78725': 'Travis',
  '78726': 'Williamson',
  '78727': 'Williamson',
  '78728': 'Williamson',
  '78729': 'Williamson',
  '78730': 'Travis',
  '78731': 'Travis',
  '78732': 'Travis',
  '78733': 'Travis',
  '78734': 'Travis',
  '78735': 'Travis',
  '78736': 'Travis',
  '78737': 'Hays',
  '78738': 'Travis',
  '78739': 'Travis',
  '78741': 'Travis',
  '78742': 'Travis',
  '78744': 'Travis',
  '78745': 'Travis',
  '78746': 'Travis',
  '78747': 'Travis',
  '78748': 'Travis',
  '78749': 'Travis',
  '78750': 'Williamson',
  '78751': 'Travis',
  '78752': 'Travis',
  '78753': 'Travis',
  '78754': 'Travis',
  '78756': 'Travis',
  '78757': 'Travis',
  '78758': 'Travis',
  '78759': 'Travis',
};

const ZIP_NAMES: Record<string, string> = {
  '78701': 'Downtown Austin',
  '78702': 'East Austin',
  '78703': 'West Austin / Tarrytown',
  '78704': 'South Austin / SoCo / Zilker',
  '78705': 'UT / Hyde Park / North Campus',
  '78717': 'Brushy Creek / Avery Ranch',
  '78719': 'Austin-Bergstrom / Del Valle',
  '78721': 'East Austin / Govalle',
  '78722': 'Cherrywood / French Place',
  '78723': 'Windsor Park / Mueller',
  '78724': 'East Austin / Colony Park',
  '78725': 'Southeast Austin',
  '78726': 'Four Points / Canyon Creek',
  '78727': 'Scofield / Duval',
  '78728': 'Wells Branch / Bratton',
  '78729': 'Anderson Mill / Milwood',
  '78730': 'River Place / NW Hills',
  '78731': 'Cat Mountain / NW Hills',
  '78732': 'Steiner Ranch',
  '78733': 'Bee Cave / Spanish Oaks',
  '78734': 'Lakeway / Rough Hollow',
  '78735': 'Circle C / Barton Creek',
  '78736': 'Oak Hill / Covered Bridge',
  '78737': 'Dripping Springs / Belterra',
  '78738': 'Bee Cave / Lake Pointe',
  '78739': 'Circle C / Shady Hollow',
  '78741': 'Riverside / Oltorf',
  '78742': 'Montopolis / Colorado River',
  '78744': 'South Austin / Southpark Meadows',
  '78745': 'Garrison Park / Westgate',
  '78746': 'Westlake Hills / Rollingwood',
  '78747': 'Slaughter Creek / Manchaca',
  '78748': 'South MoPac / Shady Hollow',
  '78749': 'Southwest Austin / Barton Creek',
  '78750': 'Anderson Mill / Jollyville',
  '78751': 'Rosedale / North Central',
  '78752': 'North Central / Windsor Hills',
  '78753': 'North Austin / Copperfield',
  '78754': 'Northeast Austin / Dessau',
  '78756': 'Brentwood / Rosedale',
  '78757': 'Allandale / Crestview',
  '78758': 'North Austin / Gracywoods',
  '78759': 'Great Hills / Balcones Woods',
};

export const ZIP_COMMUNITIES: AreaCommunity[] = Object.keys(ZIP_COUNTY_MAP).map((zip) => ({
  slug: `zip-${zip}`,
  name: `${zip} – ${ZIP_NAMES[zip] || 'Austin'}`,
  type: 'zip' as const,
  filterValue: zip,
  county: ZIP_COUNTY_MAP[zip],
  description: `Browse homes for sale in the ${zip} zip code area (${ZIP_NAMES[zip] || 'Austin, TX'}).`,
}));

// ─── CITY COMMUNITIES ─────────────────────────────────────────────────────

interface CityDef {
  name: string;
  county: string;
  description: string;
}

const CITY_DEFS: CityDef[] = [
  { name: 'Bastrop', county: 'Bastrop', description: 'Historic town on the Colorado River, 30 miles east of Austin.' },
  { name: 'Bee Cave', county: 'Travis', description: 'Hill Country city with upscale shopping and Lake Travis access.' },
  { name: 'Buda', county: 'Hays', description: 'Small-town charm just south of Austin along I-35.' },
  { name: 'Cedar Park', county: 'Williamson', description: 'Family-friendly suburb with great schools and the HEB Center.' },
  { name: 'Dripping Springs', county: 'Hays', description: 'Gateway to the Hill Country with wineries and natural beauty.' },
  { name: 'Elgin', county: 'Bastrop', description: 'Sausage Capital of Texas, growing community east of Austin.' },
  { name: 'Georgetown', county: 'Williamson', description: 'Charming downtown square, Sun City 55+, and Blue Hole Park.' },
  { name: 'Hutto', county: 'Williamson', description: 'Fast-growing community known for its friendly small-town vibe.' },
  { name: 'Kyle', county: 'Hays', description: 'One of the fastest-growing cities in Texas along the I-35 corridor.' },
  { name: 'Lakeway', county: 'Travis', description: 'Resort-style living on Lake Travis with golf and water activities.' },
  { name: 'Leander', county: 'Williamson', description: 'One of Texas\' fastest-growing cities with new master-planned communities.' },
  { name: 'Liberty Hill', county: 'Williamson', description: 'Hill Country community with small-town feel and new development.' },
  { name: 'Manor', county: 'Travis', description: 'Affordable community east of Austin with rapid development.' },
  { name: 'Pflugerville', county: 'Travis', description: 'Fast-growing suburb with excellent schools and family amenities.' },
  { name: 'Round Rock', county: 'Williamson', description: 'Major suburb known for Dell HQ, Round Rock Express, and great schools.' },
  { name: 'San Marcos', county: 'Hays', description: 'College town with Texas State University and the San Marcos River.' },
  { name: 'Taylor', county: 'Williamson', description: 'Historic railroad town experiencing a boom from Samsung\'s chip plant.' },
  { name: 'West Lake Hills', county: 'Travis', description: 'Affluent enclave with top-rated Eanes ISD schools and Hill Country views.' },
  { name: 'Wimberley', county: 'Hays', description: 'Artsy Hill Country village known for Blue Hole and Jacob\'s Well.' },
];

function citySlug(name: string): string {
  return 'city-' + name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '');
}

export const CITY_COMMUNITIES: AreaCommunity[] = CITY_DEFS.map((c) => ({
  slug: citySlug(c.name),
  name: c.name,
  type: 'city' as const,
  filterValue: c.name,
  county: c.county,
  description: c.description,
}));

// ─── COMBINED ──────────────────────────────────────────────────────────────

export const ALL_AREA_COMMUNITIES: AreaCommunity[] = [
  ...ZIP_COMMUNITIES,
  ...CITY_COMMUNITIES,
];

/**
 * Look up an area community by slug.
 */
export function getAreaCommunityBySlug(slug: string): AreaCommunity | undefined {
  return ALL_AREA_COMMUNITIES.find((c) => c.slug === slug);
}

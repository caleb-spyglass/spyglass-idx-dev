import { COMMUNITIES, CommunityPolygon } from '@/data/communities-polygons';

/**
 * Compute the centroid of a polygon (average of all vertices).
 */
function getCentroid(polygon: [number, number][]): { lat: number; lng: number } {
  let latSum = 0;
  let lngSum = 0;
  for (const [lng, lat] of polygon) {
    latSum += lat;
    lngSum += lng;
  }
  return {
    lat: latSum / polygon.length,
    lng: lngSum / polygon.length,
  };
}

/**
 * Haversine distance between two points in km.
 */
function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface NearbyCommunity {
  name: string;
  slug: string;
  county: string;
  distanceKm: number;
}

/**
 * Find nearby communities sorted by distance.
 * Excludes communities from Houston (Harris, Fort Bend, Montgomery counties)
 * unless the target community is itself in one of those counties.
 */
export function getNearbyCommunities(
  slug: string,
  limit: number = 5
): NearbyCommunity[] {
  const target = COMMUNITIES.find((c) => c.slug === slug);
  if (!target) return [];

  const targetCentroid = getCentroid(target.polygon);
  const austinCounties = ['Travis', 'Williamson', 'Hays'];
  const isAustinArea = austinCounties.includes(target.county);

  const withDistance = COMMUNITIES
    .filter((c) => {
      // Exclude self
      if (c.slug === slug) return false;
      // If target is Austin area, only show Austin area communities
      if (isAustinArea && !austinCounties.includes(c.county)) return false;
      return true;
    })
    .map((c) => {
      const centroid = getCentroid(c.polygon);
      const dist = haversineDistance(
        targetCentroid.lat,
        targetCentroid.lng,
        centroid.lat,
        centroid.lng
      );
      return {
        name: c.name,
        slug: c.slug,
        county: c.county,
        distanceKm: Math.round(dist * 10) / 10,
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);

  // De-duplicate by slug (some communities appear twice)
  const seen = new Set<string>();
  const unique: NearbyCommunity[] = [];
  for (const c of withDistance) {
    if (!seen.has(c.slug)) {
      seen.add(c.slug);
      unique.push(c);
    }
    if (unique.length >= limit) break;
  }

  return unique;
}

/**
 * Get the centroid of a community's polygon.
 */
export function getCommunityCentroid(slug: string): { lat: number; lng: number } | null {
  const community = COMMUNITIES.find((c) => c.slug === slug);
  if (!community) return null;
  return getCentroid(community.polygon);
}

/**
 * Format community name with proper title case.
 */
export function formatCommunityName(name: string): string {
  // Handle special cases
  const lowerWords = new Set(['at', 'of', 'the', 'in', 'on', 'and', 'or']);
  return name
    .split(/[\s-]+/)
    .map((word, i) => {
      const lower = word.toLowerCase();
      if (i > 0 && lowerWords.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

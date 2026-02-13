/**
 * Location API Layer for IDX
 * 
 * Fetches location data from Mission Control API with fallback to local data.
 * Designed for ISR (Incremental Static Regeneration) compatibility.
 */

// Local data imports (fallback)
import { COMMUNITIES } from '../data/communities-polygons';
import { ALL_AREA_COMMUNITIES, getAreaCommunityBySlug } from '../data/area-communities';

// Types
export interface LocationBasic {
  slug: string;
  name: string;
  county: string;
  locationType: 'polygon' | 'zip' | 'city';
  filterValue?: string;
  centroid?: { lat: number; lng: number };
  heroImage?: string;
  parentSlug?: string;
  featured: boolean;
  shortDescription?: string;
  highlights?: string[];
}

export interface LocationFull extends LocationBasic {
  polygon?: [number, number][];
  displayPolygon?: [number, number][];
  description?: string;
  bestFor?: string[];
  nearbyLandmarks?: string[];
  sections?: { id: string; heading: string; content: string; order: number }[];
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  published: boolean;
}

export interface LocationContent {
  slug: string;
  name: string;
  county: string;
  description?: string;
  highlights?: string[];
  bestFor?: string[];
  nearbyLandmarks?: string[];
  sections?: { id: string; heading: string; content: string; order: number }[];
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
}

export interface LocationsResponse {
  locations: LocationBasic[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface LocationStats {
  total: number;
  published: number;
  featured: number;
  polygons: number;
  zips: number;
  cities: number;
}

// Configuration
const MISSION_CONTROL_API_BASE = process.env.MISSION_CONTROL_API_URL || 'https://mission-control.spyglassrealty.com';
const REQUEST_TIMEOUT = 5000; // 5 seconds

// Helper to calculate centroid from polygon (fallback)
function calculateCentroid(polygon: [number, number][]): { lat: number; lng: number } {
  if (!polygon || polygon.length === 0) {
    return { lat: 30.2672, lng: -97.7431 }; // Austin default
  }
  
  let totalLat = 0;
  let totalLng = 0;
  
  for (const [lng, lat] of polygon) {
    totalLat += lat;
    totalLng += lng;
  }
  
  return {
    lat: totalLat / polygon.length,
    lng: totalLng / polygon.length
  };
}

// Fetch with timeout and error handling
async function fetchWithFallback(url: string, timeoutMs = REQUEST_TIMEOUT): Promise<Response | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'spyglass-idx/1.0',
      }
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`API request failed: ${response.status} ${response.statusText}`);
      return null;
    }

    return response;
  } catch (error) {
    console.warn('API request failed, falling back to local data:', error);
    return null;
  }
}

/**
 * Get list of locations with optional filtering
 */
export async function getLocations(params: {
  type?: 'polygon' | 'zip' | 'city';
  county?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<LocationsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.type) searchParams.set('type', params.type);
  if (params.county) searchParams.set('county', params.county);
  if (params.featured !== undefined) searchParams.set('featured', String(params.featured));
  if (params.search) searchParams.set('search', params.search);
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.offset) searchParams.set('offset', String(params.offset));

  const url = `${MISSION_CONTROL_API_BASE}/api/locations?${searchParams}`;
  const response = await fetchWithFallback(url);

  if (response) {
    try {
      return await response.json();
    } catch (error) {
      console.warn('Failed to parse API response, falling back to local data');
    }
  }

  // Fallback to local data
  console.log('Using local data fallback for getLocations');
  
  let locations: LocationBasic[] = [];
  
  // Add polygon communities
  if (!params.type || params.type === 'polygon') {
    locations = locations.concat(COMMUNITIES.map(community => ({
      slug: community.slug,
      name: community.name,
      county: community.county,
      locationType: 'polygon' as const,
      centroid: calculateCentroid(community.polygon),
      featured: community.featured,
      shortDescription: `Explore homes in ${community.name}, ${community.county} County.`,
    })));
  }
  
  // Add area communities
  if (!params.type || params.type === 'zip' || params.type === 'city') {
    locations = locations.concat(ALL_AREA_COMMUNITIES
      .filter(area => !params.type || area.type === params.type)
      .map(area => ({
        slug: area.slug,
        name: area.name,
        county: area.county,
        locationType: area.type,
        filterValue: area.filterValue,
        featured: false,
        shortDescription: area.description,
      })));
  }
  
  // Apply filters
  if (params.county) {
    locations = locations.filter(loc => loc.county === params.county);
  }
  
  if (params.featured !== undefined) {
    locations = locations.filter(loc => loc.featured === params.featured);
  }
  
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    locations = locations.filter(loc => 
      loc.name.toLowerCase().includes(searchLower) ||
      loc.county.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply pagination
  const limit = params.limit || 100;
  const offset = params.offset || 0;
  const paginatedLocations = locations.slice(offset, offset + limit);
  
  return {
    locations: paginatedLocations,
    meta: {
      total: paginatedLocations.length,
      limit,
      offset,
    }
  };
}

/**
 * Get full location data by slug
 */
export async function getLocationBySlug(slug: string): Promise<LocationFull | null> {
  const url = `${MISSION_CONTROL_API_BASE}/api/locations/${encodeURIComponent(slug)}`;
  const response = await fetchWithFallback(url);

  if (response) {
    try {
      return await response.json();
    } catch (error) {
      console.warn(`Failed to parse API response for ${slug}, falling back to local data`);
    }
  }

  // Fallback to local data
  console.log(`Using local data fallback for getLocationBySlug: ${slug}`);

  // Check polygon communities
  const polygonCommunity = COMMUNITIES.find(c => c.slug === slug);
  if (polygonCommunity) {
    return {
      slug: polygonCommunity.slug,
      name: polygonCommunity.name,
      county: polygonCommunity.county,
      locationType: 'polygon',
      polygon: polygonCommunity.polygon,
      displayPolygon: polygonCommunity.displayPolygon,
      centroid: calculateCentroid(polygonCommunity.polygon),
      featured: polygonCommunity.featured,
      published: true, // Assume published if in local data
      description: `Explore homes for sale in ${polygonCommunity.name}, located in ${polygonCommunity.county} County. This vibrant community offers a variety of properties and lifestyle amenities.`,
    };
  }

  // Check area communities
  const areaCommunity = getAreaCommunityBySlug(slug);
  if (areaCommunity) {
    return {
      slug: areaCommunity.slug,
      name: areaCommunity.name,
      county: areaCommunity.county,
      locationType: areaCommunity.type,
      filterValue: areaCommunity.filterValue,
      featured: false,
      published: true,
      description: areaCommunity.description,
    };
  }

  return null;
}

/**
 * Get location content only (for embedding)
 */
export async function getLocationContent(slug: string): Promise<LocationContent | null> {
  const url = `${MISSION_CONTROL_API_BASE}/api/locations/${encodeURIComponent(slug)}/content`;
  const response = await fetchWithFallback(url);

  if (response) {
    try {
      return await response.json();
    } catch (error) {
      console.warn(`Failed to parse content API response for ${slug}, falling back to local data`);
    }
  }

  // Fallback - get basic location data
  const location = await getLocationBySlug(slug);
  if (location) {
    return {
      slug: location.slug,
      name: location.name,
      county: location.county,
      description: location.description,
      highlights: location.highlights,
      bestFor: location.bestFor,
      nearbyLandmarks: location.nearbyLandmarks,
      sections: location.sections,
      metaTitle: location.metaTitle,
      metaDescription: location.metaDescription,
      focusKeyword: location.focusKeyword,
    };
  }

  return null;
}

/**
 * Get location statistics
 */
export async function getLocationStats(): Promise<LocationStats | null> {
  const url = `${MISSION_CONTROL_API_BASE}/api/locations/stats`;
  const response = await fetchWithFallback(url);

  if (response) {
    try {
      return await response.json();
    } catch (error) {
      console.warn('Failed to parse stats API response, falling back to local calculation');
    }
  }

  // Fallback - calculate from local data
  console.log('Using local data fallback for getLocationStats');
  
  const polygonCount = COMMUNITIES.length;
  const areaCount = ALL_AREA_COMMUNITIES.length;
  const featuredCount = COMMUNITIES.filter(c => c.featured).length;
  
  return {
    total: polygonCount + areaCount,
    published: polygonCount + areaCount, // Assume all local data is published
    featured: featuredCount,
    polygons: polygonCount,
    zips: ALL_AREA_COMMUNITIES.filter(c => c.type === 'zip').length,
    cities: ALL_AREA_COMMUNITIES.filter(c => c.type === 'city').length,
  };
}

/**
 * Get available counties
 */
export async function getCounties(): Promise<{ county: string; count: number }[]> {
  const url = `${MISSION_CONTROL_API_BASE}/api/locations/counties`;
  const response = await fetchWithFallback(url);

  if (response) {
    try {
      const data = await response.json();
      return data.counties || [];
    } catch (error) {
      console.warn('Failed to parse counties API response, falling back to local data');
    }
  }

  // Fallback - calculate from local data
  console.log('Using local data fallback for getCounties');
  
  const countyCounts = new Map<string, number>();
  
  COMMUNITIES.forEach(community => {
    const count = countyCounts.get(community.county) || 0;
    countyCounts.set(community.county, count + 1);
  });
  
  ALL_AREA_COMMUNITIES.forEach(area => {
    const count = countyCounts.get(area.county) || 0;
    countyCounts.set(area.county, count + 1);
  });
  
  return Array.from(countyCounts.entries())
    .map(([county, count]) => ({ county, count }))
    .sort((a, b) => a.county.localeCompare(b.county));
}

/**
 * Preload critical location data for ISR
 * Call this in getStaticProps/getServerSideProps to ensure data is available
 */
export async function preloadLocationData(slugs: string[]): Promise<void> {
  // Batch preload locations that might be needed
  const promises = slugs.map(slug => getLocationBySlug(slug));
  
  try {
    await Promise.allSettled(promises);
  } catch (error) {
    console.warn('Error preloading location data:', error);
  }
}
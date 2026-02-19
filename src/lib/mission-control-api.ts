/**
 * Mission Control API client for communities data
 * Replaces static data imports with dynamic API calls
 */

const MISSION_CONTROL_URL = process.env.MISSION_CONTROL_URL || 'https://missioncontrol-tjfm.onrender.com';
const PULSE_API_KEY = process.env.PULSE_API_KEY;

export interface CommunityData {
  name: string;
  slug: string;
  polygon: [number, number][];
  displayPolygon: [number, number][];
  county: string;
  featured: boolean;
  locationType?: string;
  filterValue?: string;
  centroid?: { lat: number; lng: number };
  heroImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  description?: string;
  highlights?: string[];
  bestFor?: string[];
  nearbyLandmarks?: string[];
  sections?: { id: string; heading: string; content: string; order: number }[];
}

export interface CommunityApiResponse {
  communities: CommunityData[];
  total: number;
  page?: number;
  limit?: number;
}

export interface CommunityDetailResponse {
  community: CommunityData;
}

class MissionControlApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'MissionControlApiError';
  }
}

/**
 * Fetch communities from Mission Control API
 */
export async function fetchCommunities(options: {
  search?: string;
  county?: string;
  featured?: boolean;
  published?: boolean;
  page?: number;
  limit?: number;
} = {}): Promise<CommunityApiResponse> {
  try {
    const params = new URLSearchParams();
    
    if (options.search) params.set('search', options.search);
    if (options.county) params.set('county', options.county);
    if (options.featured !== undefined) params.set('featured', String(options.featured));
    if (options.published !== undefined) params.set('published', String(options.published));
    if (options.page) params.set('page', String(options.page));
    if (options.limit) params.set('limit', String(options.limit));

    const url = `${MISSION_CONTROL_URL}/api/public/communities?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add caching headers for better performance
        'Cache-Control': 'public, max-age=300', // 5 minutes
      },
      next: {
        revalidate: 300, // Revalidate every 5 minutes
      },
    });

    if (!response.ok) {
      throw new MissionControlApiError(
        `Failed to fetch communities: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('[Mission Control API] Error fetching communities:', error);
    
    // Return fallback static data if API fails
    if (process.env.NODE_ENV === 'production') {
      console.warn('[Mission Control API] Falling back to static data due to API error');
      return getFallbackCommunities(options);
    }
    
    throw error;
  }
}

/**
 * Fetch single community by slug from Mission Control API
 */
export async function fetchCommunityBySlug(slug: string): Promise<CommunityData | null> {
  try {
    const url = `${MISSION_CONTROL_URL}/api/public/communities/${slug}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // 5 minutes
      },
      next: {
        revalidate: 300, // Revalidate every 5 minutes
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new MissionControlApiError(
        `Failed to fetch community ${slug}: ${response.statusText}`,
        response.status
      );
    }

    const data: CommunityDetailResponse = await response.json();
    return data.community;

  } catch (error) {
    console.error(`[Mission Control API] Error fetching community ${slug}:`, error);
    
    // Return fallback static data if API fails
    if (process.env.NODE_ENV === 'production') {
      console.warn(`[Mission Control API] Falling back to static data for community ${slug}`);
      return getFallbackCommunityBySlug(slug);
    }
    
    throw error;
  }
}

/**
 * Sync static communities data to Mission Control
 * Used for initial migration or backup sync
 */
export async function syncCommunitiesToMissionControl(communitiesData: CommunityData[]): Promise<{
  success: boolean;
  synced: number;
  errors: number;
  message: string;
}> {
  if (!PULSE_API_KEY) {
    throw new MissionControlApiError('PULSE_API_KEY is required for sync operations');
  }

  try {
    const response = await fetch(`${MISSION_CONTROL_URL}/api/public/communities/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: PULSE_API_KEY,
        communities: communitiesData,
      }),
    });

    if (!response.ok) {
      throw new MissionControlApiError(
        `Failed to sync communities: ${response.statusText}`,
        response.status
      );
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('[Mission Control API] Error syncing communities:', error);
    throw error;
  }
}

/**
 * Fetch available counties from Mission Control API
 */
export async function fetchCounties(): Promise<string[]> {
  try {
    const response = await fetch(`${MISSION_CONTROL_URL}/api/public/communities/counties`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600', // 10 minutes
      },
      next: {
        revalidate: 600, // Revalidate every 10 minutes
      },
    });

    if (!response.ok) {
      throw new MissionControlApiError(
        `Failed to fetch counties: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return data.counties || [];

  } catch (error) {
    console.error('[Mission Control API] Error fetching counties:', error);
    return ['Travis', 'Williamson', 'Hays']; // Default fallback
  }
}

/**
 * Fallback function that imports static data when API is unavailable
 * This ensures the site continues to work even if Mission Control is down
 */
async function getFallbackCommunities(options: {
  search?: string;
  county?: string;
  featured?: boolean;
} = {}): Promise<CommunityApiResponse> {
  try {
    // Dynamic import to avoid loading static data unless needed
    const { COMMUNITIES } = await import('@/data/communities-polygons');
    
    let filtered = COMMUNITIES;

    if (options.county) {
      filtered = filtered.filter(c => c.county.toLowerCase() === options.county!.toLowerCase());
    }
    if (options.featured === true) {
      filtered = filtered.filter(c => c.featured);
    }
    if (options.search) {
      filtered = filtered.filter(c => c.name.toLowerCase().includes(options.search!.toLowerCase()));
    }

    return {
      communities: filtered,
      total: filtered.length,
    };
  } catch (error) {
    console.error('[Mission Control API] Error loading fallback data:', error);
    return { communities: [], total: 0 };
  }
}

/**
 * Fallback function for single community lookup
 */
async function getFallbackCommunityBySlug(slug: string): Promise<CommunityData | null> {
  try {
    const { getCommunityBySlug } = await import('@/data/communities-polygons');
    return getCommunityBySlug(slug);
  } catch (error) {
    console.error(`[Mission Control API] Error loading fallback community ${slug}:`, error);
    return null;
  }
}
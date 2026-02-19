/**
 * MLS-Driven Community Service
 * Integrates Mission Control API with live Repliers MLS data
 * Transforms from static data to real-time MLS-driven system
 */

import { fetchCommunityBySlug, fetchCommunities, CommunityData } from '@/lib/mission-control-api';
import { searchByPolygon, getLiveMarketData } from '@/lib/repliers-api';
import { SearchFilters, SearchResults } from '@/types/listing';
import { query } from '@/lib/database';

export interface MLSCommunityData extends CommunityData {
  liveStats: {
    activeListings: number;
    medianPrice: number;
    averagePrice: number;
    minPrice: number;
    maxPrice: number;
    avgDaysOnMarket: number;
    pricePerSqft: number;
    lastUpdated: Date;
  };
  listingsCount: number;
}

export interface MLSCommunitySearchResult {
  communities: MLSCommunityData[];
  total: number;
  page?: number;
  limit?: number;
}

/**
 * Get community with live MLS data
 */
export async function getMLSCommunityBySlug(slug: string): Promise<MLSCommunityData | null> {
  try {
    // First get community polygon data from Mission Control
    const community = await fetchCommunityBySlug(slug);
    if (!community) return null;

    // Check cache first
    const cacheKey = `community_${slug}`;
    const cached = await getCachedData(cacheKey);
    if (cached) {
      return cached;
    }

    // Get live MLS data for the community polygon
    let liveStats;
    let listingsCount = 0;

    if (community.polygon && community.polygon.length > 0) {
      // Convert polygon from [lat, lng] to [lng, lat] for Repliers API
      const repliersPolygon = community.polygon.map(([lat, lng]) => [lng, lat]) as Array<[number, number]>;
      
      liveStats = await getLiveMarketData({ polygon: repliersPolygon });
      listingsCount = liveStats.activeListings;
    } else {
      // Fallback to area-based search
      liveStats = await getLiveMarketData({ 
        area: community.county || 'Travis' 
      });
      listingsCount = liveStats.activeListings;
    }

    const mlsCommunity: MLSCommunityData = {
      ...community,
      liveStats: {
        ...liveStats,
        lastUpdated: new Date(),
      },
      listingsCount,
    };

    // Cache the result for 30 minutes
    await cacheData(cacheKey, mlsCommunity, 30 * 60 * 1000);

    return mlsCommunity;
  } catch (error) {
    console.error(`Failed to get MLS community data for ${slug}:`, error);
    return null;
  }
}

/**
 * Search communities with live MLS data
 */
export async function searchMLSCommunities(options: {
  search?: string;
  county?: string;
  featured?: boolean;
  published?: boolean;
  page?: number;
  limit?: number;
  includeLiveData?: boolean;
} = {}): Promise<MLSCommunitySearchResult> {
  try {
    // Get communities from Mission Control
    const response = await fetchCommunities(options);
    
    if (!options.includeLiveData) {
      // Return without live data for faster response
      return {
        communities: response.communities.map(c => ({
          ...c,
          liveStats: {
            activeListings: 0,
            medianPrice: 0,
            averagePrice: 0,
            minPrice: 0,
            maxPrice: 0,
            avgDaysOnMarket: 0,
            pricePerSqft: 0,
            lastUpdated: new Date(),
          },
          listingsCount: 0,
        })),
        total: response.total,
        page: response.page,
        limit: response.limit,
      };
    }

    // Enhance with live MLS data (parallel processing for performance)
    const mlsCommunities = await Promise.all(
      response.communities.slice(0, 50).map(async (community): Promise<MLSCommunityData> => {
        try {
          const cacheKey = `community_${community.slug}`;
          const cached = await getCachedData(cacheKey);
          if (cached) return cached;

          let liveStats;
          if (community.polygon && community.polygon.length > 0) {
            const repliersPolygon = community.polygon.map(([lat, lng]) => [lng, lat]) as Array<[number, number]>;
            liveStats = await getLiveMarketData({ polygon: repliersPolygon });
          } else {
            liveStats = await getLiveMarketData({ area: community.county || 'Travis' });
          }

          const mlsCommunity: MLSCommunityData = {
            ...community,
            liveStats: {
              ...liveStats,
              lastUpdated: new Date(),
            },
            listingsCount: liveStats.activeListings,
          };

          // Cache for 30 minutes
          await cacheData(cacheKey, mlsCommunity, 30 * 60 * 1000);
          return mlsCommunity;
        } catch (error) {
          console.error(`Failed to enhance community ${community.slug} with MLS data:`, error);
          // Return community without live stats on error
          return {
            ...community,
            liveStats: {
              activeListings: 0,
              medianPrice: 0,
              averagePrice: 0,
              minPrice: 0,
              maxPrice: 0,
              avgDaysOnMarket: 0,
              pricePerSqft: 0,
              lastUpdated: new Date(),
            },
            listingsCount: 0,
          };
        }
      })
    );

    return {
      communities: mlsCommunities,
      total: response.total,
      page: response.page,
      limit: response.limit,
    };
  } catch (error) {
    console.error('Failed to search MLS communities:', error);
    throw error;
  }
}

/**
 * Get community listings using MLS data
 */
export async function getCommunityListings(
  slug: string,
  filters?: Partial<SearchFilters>
): Promise<SearchResults> {
  try {
    const community = await fetchCommunityBySlug(slug);
    if (!community || !community.polygon || community.polygon.length === 0) {
      throw new Error(`Community ${slug} not found or has no polygon data`);
    }

    // Convert polygon from [lat, lng] to [lng, lat] for Repliers API
    const repliersPolygon = community.polygon.map(([lat, lng]) => [lng, lat]) as Array<[number, number]>;
    
    return await searchByPolygon(repliersPolygon, filters);
  } catch (error) {
    console.error(`Failed to get listings for community ${slug}:`, error);
    throw error;
  }
}

/**
 * Get zip code listings using polygon boundaries
 */
export async function getZipCodeMLSListings(
  zipCode: string,
  zipPolygon: Array<[number, number]>, // [lng, lat] format
  filters?: Partial<SearchFilters>
): Promise<SearchResults> {
  try {
    return await searchByPolygon(zipPolygon, {
      ...filters,
      zip: zipCode, // Also filter by zip code for accuracy
    });
  } catch (error) {
    console.error(`Failed to get MLS listings for zip code ${zipCode}:`, error);
    throw error;
  }
}

/**
 * Cache helper functions
 */
async function getCachedData(key: string): Promise<any | null> {
  try {
    const result = await query(
      'SELECT stats_data FROM market_stats_cache WHERE area_key = $1 AND expires_at > CURRENT_TIMESTAMP',
      [key]
    );
    
    return result.rows[0]?.stats_data || null;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

async function cacheData(key: string, data: any, ttlMs: number): Promise<void> {
  try {
    const expiresAt = new Date(Date.now() + ttlMs);
    await query(
      `INSERT INTO market_stats_cache (area_key, stats_data, expires_at) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (area_key) DO UPDATE SET 
         stats_data = $2, 
         expires_at = $3, 
         last_updated = CURRENT_TIMESTAMP`,
      [key, JSON.stringify(data), expiresAt]
    );
  } catch (error) {
    console.error('Cache write error:', error);
    // Don't throw - caching is optional
  }
}

/**
 * Get top communities by listing count (live MLS data)
 */
export async function getTopCommunitiesByListings(limit = 10): Promise<MLSCommunityData[]> {
  try {
    const response = await searchMLSCommunities({ 
      published: true, 
      limit: 100, 
      includeLiveData: true 
    });
    
    return response.communities
      .filter(c => c.listingsCount > 0)
      .sort((a, b) => b.listingsCount - a.listingsCount)
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to get top communities:', error);
    return [];
  }
}

/**
 * Refresh community data cache
 */
export async function refreshCommunityCache(slug?: string): Promise<void> {
  try {
    if (slug) {
      // Refresh specific community
      const cacheKey = `community_${slug}`;
      await query('DELETE FROM market_stats_cache WHERE area_key = $1', [cacheKey]);
      await getMLSCommunityBySlug(slug);
    } else {
      // Refresh all community caches
      await query('DELETE FROM market_stats_cache WHERE area_key LIKE $1', ['community_%']);
      console.log('All community caches cleared');
    }
  } catch (error) {
    console.error('Failed to refresh community cache:', error);
    throw error;
  }
}
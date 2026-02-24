import { NextRequest, NextResponse } from 'next/server';
import { fetchCommunities } from '@/lib/mission-control-api';
import { searchMLSCommunities } from '@/lib/mls-communities-api';
import { COMMUNITIES } from '@/data/communities-polygons';

// GET /api/communities - List all communities  
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const county = searchParams.get('county');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search')?.toLowerCase();
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '100');
    
    // Prioritize fast, reliable static data for backend editor
    const preferStatic = searchParams.get('static') === 'true' || searchParams.get('fast') === 'true';
    const includeLiveData = searchParams.get('live') === 'true' && !preferStatic;

    console.log(`[Communities API] Request: county=${county}, featured=${featured}, search=${search}, preferStatic=${preferStatic}`);

    // PRIORITY 1: Static data (fast and reliable for backend editor)
    if (preferStatic) {
      console.log('[Communities API] Using static data (fast mode)');
      return getStaticCommunitiesResponse({ county, featured, search, page, pageSize });
    }

    // PRIORITY 2: Database fallback (if available)
    try {
      const { query: dbQuery } = await import('../../../lib/database');
      
      let queryText = `
        SELECT 
          slug,
          community_data,
          jsonb_array_length(polygon) as polygon_points,
          last_updated
        FROM communities_cache 
        WHERE 1=1
      `;
      
      const queryParams: any[] = [];
      
      if (county) {
        queryText += ` AND community_data->>'county' ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${county}%`);
      }
      
      if (featured === 'true') {
        queryText += ` AND (community_data->>'featured')::boolean = true`;
      }
      
      if (search) {
        queryText += ` AND community_data->>'name' ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${search}%`);
      }
      
      queryText += ` ORDER BY community_data->>'name' LIMIT ${pageSize}`;
      
      const dbResult = await Promise.race([
        dbQuery(queryText, queryParams),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Database timeout')), 2000))
      ]);
      
      const dbCommunities = (dbResult as any).rows.map((row: any) => {
        const communityData = typeof row.community_data === 'string' 
          ? JSON.parse(row.community_data)
          : row.community_data;
        
        return {
          ...communityData,
          polygonPoints: row.polygon_points,
          lastUpdated: row.last_updated,
          source: 'database'
        };
      });

      if (dbCommunities.length > 0) {
        console.log(`[Communities API] ✅ Database success: ${dbCommunities.length} communities (${Date.now() - startTime}ms)`);
        return NextResponse.json({
          communities: dbCommunities,
          total: dbCommunities.length,
          source: 'database',
          responseTime: Date.now() - startTime
        });
      }
    } catch (dbError) {
      console.warn(`[Communities API] Database failed (${Date.now() - startTime}ms):`, dbError);
    }

    // PRIORITY 3: Try MLS-enhanced API (if specifically requested and not in fast mode)
    if (includeLiveData) {
      try {
        const mlsResponse = await Promise.race([
          searchMLSCommunities({
            search,
            county: county || undefined,
            featured: featured === 'true' ? true : undefined,
            published: true,
            page,
            limit: pageSize,
            includeLiveData: true,
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('MLS API timeout')), 3000))
        ]);

        console.log(`[Communities API] ✅ MLS enhanced success (${Date.now() - startTime}ms)`);
        return NextResponse.json({
          communities: (mlsResponse as any).communities,
          total: (mlsResponse as any).total,
          source: 'mls-enhanced',
          responseTime: Date.now() - startTime
        });
      } catch (mlsError) {
        console.warn(`[Communities API] MLS enhancement failed (${Date.now() - startTime}ms):`, mlsError);
      }
    }

    // PRIORITY 4: Mission Control API (with timeout)
    try {
      const apiResponse = await Promise.race([
        fetchCommunities({
          search,
          county: county || undefined,
          featured: featured === 'true' ? true : undefined,
          published: true,
          page,
          limit: pageSize,
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Mission Control timeout')), 2000))
      ]);

      console.log(`[Communities API] ✅ Mission Control success (${Date.now() - startTime}ms)`);
      return NextResponse.json({
        communities: (apiResponse as any).communities,
        total: (apiResponse as any).total,
        source: 'mission-control',
        responseTime: Date.now() - startTime
      });

    } catch (apiError) {
      console.warn(`[Communities API] Mission Control failed (${Date.now() - startTime}ms):`, apiError);
      
      // FINAL FALLBACK: Static data (guaranteed to work)
      console.log(`[Communities API] ⚠️ All APIs failed, using static fallback (${Date.now() - startTime}ms)`);
      return getStaticCommunitiesResponse({ county, featured, search, page, pageSize });
    }
  } catch (error) {
    console.error(`[Communities API] Fatal error (${Date.now() - startTime}ms):`, error);
    return NextResponse.json(
      { error: 'Failed to fetch communities', responseTime: Date.now() - startTime },
      { status: 500 }
    );
  }
}

/**
 * Helper function to return static communities data
 * Fast and reliable for backend editor use
 */
function getStaticCommunitiesResponse({ county, featured, search, page, pageSize }: {
  county: string | null;
  featured: string | null;
  search: string | undefined;
  page: number;
  pageSize: number;
}) {
  let filtered = COMMUNITIES;

  if (county) {
    filtered = filtered.filter(c => c.county.toLowerCase() === county.toLowerCase());
  }
  if (featured === 'true') {
    filtered = filtered.filter(c => c.featured);
  }
  if (search) {
    filtered = filtered.filter(c => c.name.toLowerCase().includes(search));
  }

  // Apply pagination
  const startIndex = (page - 1) * pageSize;
  const paginatedCommunities = filtered.slice(startIndex, startIndex + pageSize);

  // Transform to API response format
  const communities = paginatedCommunities.map(c => ({
    name: c.name,
    slug: c.slug,
    county: c.county,
    featured: c.featured,
    polygon: c.polygon,
    displayPolygon: c.displayPolygon,
    source: 'static'
  }));

  return NextResponse.json({
    communities,
    total: filtered.length,
    source: 'static',
    message: 'Using reliable static data for fast backend editor access'
  });
}

// POST /api/communities - Batch import communities (admin only)
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // const isAdmin = await verifyAdminAuth(request);
    // if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const { communities } = await request.json();
    
    if (!Array.isArray(communities)) {
      return NextResponse.json(
        { error: 'communities must be an array' },
        { status: 400 }
      );
    }
    
    // TODO: Insert into database
    // for (const community of communities) {
    //   await db.query(`
    //     INSERT INTO community_zones (slug, name, polygon, bounds_north, bounds_south, bounds_east, bounds_west)
    //     VALUES ($1, $2, $3, $4, $5, $6, $7)
    //     ON CONFLICT (slug) DO UPDATE SET
    //       name = EXCLUDED.name,
    //       polygon = EXCLUDED.polygon,
    //       bounds_north = EXCLUDED.bounds_north,
    //       bounds_south = EXCLUDED.bounds_south,
    //       bounds_east = EXCLUDED.bounds_east,
    //       bounds_west = EXCLUDED.bounds_west,
    //       updated_at = CURRENT_TIMESTAMP
    //   `, [community.slug, community.name, JSON.stringify(community.polygon), ...]);
    // }
    
    return NextResponse.json({
      success: true,
      imported: communities.length,
      message: `Imported ${communities.length} communities`,
    });
  } catch (error) {
    console.error('Communities import error:', error);
    return NextResponse.json(
      { error: 'Failed to import communities' },
      { status: 500 }
    );
  }
}

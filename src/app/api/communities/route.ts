import { NextRequest, NextResponse } from 'next/server';
import { COMMUNITIES } from '@/data/communities-polygons';

// GET /api/communities - List all communities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const county = searchParams.get('county');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search')?.toLowerCase();

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

    // Transform to API response format
    const communities = filtered.map(c => ({
      name: c.name,
      slug: c.slug,
      county: c.county,
      featured: c.featured,
      polygon: c.polygon,
      displayPolygon: c.displayPolygon,
    }));

    return NextResponse.json({
      communities,
      total: communities.length,
    });
  } catch (error) {
    console.error('Communities API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch communities' },
      { status: 500 }
    );
  }
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

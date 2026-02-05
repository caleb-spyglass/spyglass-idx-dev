import { NextRequest, NextResponse } from 'next/server';
import { sampleCommunities } from '@/data/sample-communities';

// GET /api/communities - List all communities
export async function GET(request: NextRequest) {
  try {
    // TODO: Replace with database query when PostgreSQL is set up
    // const communities = await db.query('SELECT * FROM community_zones ORDER BY name');
    
    return NextResponse.json({
      communities: sampleCommunities,
      total: sampleCommunities.length,
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

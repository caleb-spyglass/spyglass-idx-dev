import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

// GET /api/communities-direct - Get communities directly from our database
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search')?.toLowerCase();
    
    let queryText = `
      SELECT 
        slug,
        community_data,
        jsonb_array_length(polygon) as polygon_points,
        last_updated
      FROM communities_cache 
    `;
    
    let queryParams = [];
    
    if (search) {
      queryText += ` WHERE LOWER(community_data->>'name') LIKE $1`;
      queryParams.push(`%${search}%`);
      queryText += ` ORDER BY community_data->>'name' LIMIT $2`;
      queryParams.push(limit);
    } else {
      queryText += ` ORDER BY community_data->>'name' LIMIT $1`;
      queryParams.push(limit);
    }

    const result = await query(queryText, queryParams);
    
    const communities = result.rows.map(row => {
      const communityData = typeof row.community_data === 'string' 
        ? JSON.parse(row.community_data)
        : row.community_data;
      
      return {
        ...communityData,
        polygonPoints: row.polygon_points,
        lastUpdated: row.last_updated,
      };
    });

    return NextResponse.json({
      success: true,
      communities,
      total: communities.length,
      source: 'direct-database',
      message: `Found ${communities.length} communities in database`,
    });
    
  } catch (error) {
    console.error('[Communities Direct API] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch communities from database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET count endpoint
export async function POST(request: NextRequest) {
  try {
    const countResult = await query('SELECT COUNT(*) as total FROM communities_cache');
    const sampleResult = await query(`
      SELECT 
        community_data->>'name' as name,
        slug,
        jsonb_array_length(polygon) as polygon_points,
        last_updated
      FROM communities_cache 
      ORDER BY community_data->>'name'
      LIMIT 10
    `);

    return NextResponse.json({
      success: true,
      totalCommunities: parseInt(countResult.rows[0].total),
      sampleCommunities: sampleResult.rows,
      source: 'direct-database',
      message: `Database contains ${countResult.rows[0].total} communities ready for Trisha`,
    });
    
  } catch (error) {
    console.error('[Communities Direct API] Count error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to count communities',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
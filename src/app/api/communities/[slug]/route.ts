import { NextRequest, NextResponse } from 'next/server';
import { sampleCommunities } from '@/data/sample-communities';
// import { searchByPolygon, getMarketStats } from '@/lib/repliers-api';
import { mockListings } from '@/lib/mock-data';
import { isPointInPolygon } from '@/lib/polygon-utils';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

// GET /api/communities/[slug] - Get community details with listings
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    
    // TODO: Replace with database query
    // const community = await db.query('SELECT * FROM community_zones WHERE slug = $1', [slug]);
    const community = sampleCommunities.find(c => c.slug === slug);
    
    if (!community) {
      return NextResponse.json(
        { error: 'Community not found' },
        { status: 404 }
      );
    }
    
    // Get listings within this community polygon
    // TODO: Replace with Repliers API
    // const repliersPolygon = community.coordinates.map(c => [c.lng, c.lat]);
    // const listings = await searchByPolygon(repliersPolygon);
    // const stats = await getMarketStats(repliersPolygon);
    
    // Mock: filter listings by polygon
    // Convert coordinates to the expected format
    const polygonCoords = community.coordinates.map(c => 
      Array.isArray(c) ? { lat: c[0], lng: c[1] } : c
    );
    const listings = mockListings.filter(listing => 
      isPointInPolygon(listing.coordinates, polygonCoords)
    );
    
    // Mock stats
    const stats = {
      activeListings: listings.length,
      medianPrice: listings.length > 0 
        ? listings.sort((a, b) => a.price - b.price)[Math.floor(listings.length / 2)].price 
        : 0,
      avgPricePerSqft: listings.length > 0
        ? Math.round(listings.reduce((sum, l) => sum + (l.price / l.sqft), 0) / listings.length)
        : 0,
      avgDaysOnMarket: listings.length > 0
        ? Math.round(listings.reduce((sum, l) => sum + l.daysOnMarket, 0) / listings.length)
        : 0,
    };
    
    return NextResponse.json({
      community,
      listings,
      stats,
    });
  } catch (error) {
    console.error('Community detail API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community' },
      { status: 500 }
    );
  }
}

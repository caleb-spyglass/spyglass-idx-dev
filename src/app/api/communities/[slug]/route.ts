import { NextRequest, NextResponse } from 'next/server';
import { fetchCommunityBySlug } from '@/lib/mission-control-api';
import { getCommunityBySlug } from '@/data/communities-polygons';
import { searchListings } from '@/lib/repliers-api';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

// GET /api/communities/[slug] - Get community details with listings
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    let community = null;

    // First try Mission Control API
    try {
      const apiCommunity = await fetchCommunityBySlug(slug);
      if (apiCommunity) {
        community = {
          name: apiCommunity.name,
          slug: apiCommunity.slug,
          county: apiCommunity.county || 'Travis',
          polygon: apiCommunity.polygon || [],
          displayPolygon: apiCommunity.displayPolygon || [],
          featured: apiCommunity.featured || false,
        };
      }
    } catch (apiError) {
      console.warn(`[Community API] Mission Control unavailable for ${slug}, falling back to static data:`, apiError);
    }

    // Fallback to static data if API didn't return a community
    if (!community) {
      community = getCommunityBySlug(slug);
    }

    if (!community) {
      return NextResponse.json(
        { error: 'Community not found' },
        { status: 404 }
      );
    }

    // Fetch real listings within the polygon from Repliers
    const { listings, total } = await searchListings({
      polygon: community.polygon.map(([lng, lat]) => ({ lat, lng })),
      page,
      pageSize,
    });

    // Calculate basic stats from returned listings
    const prices = listings.map(l => l.price).filter(p => p > 0).sort((a, b) => a - b);
    const sqftListings = listings.filter(l => l.sqft > 0);

    const stats = {
      activeListings: total,
      medianPrice: prices.length > 0
        ? prices[Math.floor(prices.length / 2)]
        : 0,
      avgPricePerSqft: sqftListings.length > 0
        ? Math.round(sqftListings.reduce((sum, l) => sum + (l.price / l.sqft), 0) / sqftListings.length)
        : 0,
      avgDaysOnMarket: listings.length > 0
        ? Math.round(listings.reduce((sum, l) => sum + (l.daysOnMarket || 0), 0) / listings.length)
        : 0,
    };

    return NextResponse.json({
      community: {
        name: community.name,
        slug: community.slug,
        county: community.county,
        featured: community.featured,
        polygon: community.polygon,
        displayPolygon: community.displayPolygon,
      },
      listings,
      stats,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('Community detail API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { searchMLSCommunities, getTopCommunitiesByListings } from '@/lib/mls-communities-api';

export async function GET(request: NextRequest) {
  try {
    // Get all communities with live MLS data
    const response = await searchMLSCommunities({
      published: true,
      limit: 500,
      includeLiveData: true,
    });

    const communities = response.communities;
    const communitiesWithListings = communities.filter(c => c.listingsCount > 0);
    const totalActiveListings = communities.reduce((sum, c) => sum + c.listingsCount, 0);
    
    // Calculate average median price (only communities with listings)
    const averageMedianPrice = communitiesWithListings.length > 0
      ? Math.round(
          communitiesWithListings.reduce((sum, c) => sum + c.liveStats.medianPrice, 0) / 
          communitiesWithListings.length
        )
      : 0;

    // Get top 10 communities by listing count
    const topCommunities = await getTopCommunitiesByListings(10);

    const stats = {
      totalCommunities: communities.length,
      communitiesWithListings: communitiesWithListings.length,
      totalActiveListings,
      averageMedianPrice,
      lastUpdated: new Date(),
      topCommunities: topCommunities.map(c => ({
        name: c.name,
        slug: c.slug,
        listingsCount: c.listingsCount,
        medianPrice: c.liveStats.medianPrice,
      })),
      syncStatus: 'idle' as const,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to get MLS stats:', error);
    return NextResponse.json(
      { error: 'Failed to get MLS statistics' },
      { status: 500 }
    );
  }
}
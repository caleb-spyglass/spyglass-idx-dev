import { NextRequest, NextResponse } from 'next/server';
import { searchMLSCommunities, refreshCommunityCache } from '@/lib/mls-communities-api';
import { cleanupCache } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    console.log('[Admin API] Starting MLS data sync...');
    
    // First cleanup old cache entries
    await cleanupCache();
    
    // Refresh all community caches to force fresh data
    await refreshCommunityCache();
    
    // Fetch communities with fresh MLS data
    const response = await searchMLSCommunities({
      published: true,
      limit: 200,
      includeLiveData: true,
    });

    const communities = response.communities;
    const communitiesWithListings = communities.filter(c => c.listingsCount > 0);
    const totalActiveListings = communities.reduce((sum, c) => sum + c.listingsCount, 0);

    console.log(`[Admin API] MLS sync completed: ${communities.length} communities processed`);
    console.log(`[Admin API] ${communitiesWithListings.length} communities have active listings`);
    console.log(`[Admin API] ${totalActiveListings} total active listings`);

    return NextResponse.json({
      success: true,
      communitiesProcessed: communities.length,
      communitiesWithListings: communitiesWithListings.length,
      totalActiveListings,
      timestamp: new Date().toISOString(),
      message: `Successfully synced ${communities.length} communities with live MLS data`,
    });
    
  } catch (error) {
    console.error('[Admin API] MLS sync failed:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'MLS data sync failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
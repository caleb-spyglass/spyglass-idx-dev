import { NextRequest, NextResponse } from 'next/server';
import { refreshCommunityCache } from '@/lib/mls-communities-api';
import { cleanupCache } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    console.log(`[Admin API] Refreshing cache${slug ? ` for community: ${slug}` : ' for all communities'}...`);
    
    // Clean up expired cache entries first
    await cleanupCache();
    
    // Refresh community cache
    await refreshCommunityCache(slug || undefined);
    
    return NextResponse.json({
      success: true,
      message: slug 
        ? `Cache refreshed for community: ${slug}`
        : 'Cache refreshed for all communities',
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('[Admin API] Cache refresh failed:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Cache refresh failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
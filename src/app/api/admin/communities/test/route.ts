import { NextRequest, NextResponse } from 'next/server';

/**
 * Backend Editor Test Endpoint for Communities
 * GET /api/admin/communities/test
 * 
 * Tests all community data sources and returns diagnostics
 * Use ?fast=true for static data only (recommended for backend editor)
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  const fast = searchParams.get('fast') === 'true';
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    fastMode: fast,
    tests: [] as any[],
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      responseTime: 0
    }
  };

  // Test 1: Static communities data
  try {
    const { COMMUNITIES } = await import('@/data/communities-polygons');
    const featuredCount = COMMUNITIES.filter(c => c.featured).length;
    const countiesSet = new Set(COMMUNITIES.map(c => c.county));
    
    diagnostics.tests.push({
      name: 'Static Communities Data',
      status: 'pass',
      details: {
        total: COMMUNITIES.length,
        featured: featuredCount,
        counties: Array.from(countiesSet),
        sampleCommunity: COMMUNITIES[0]?.name || 'None'
      },
      responseTime: Date.now() - startTime
    });
    diagnostics.summary.passed++;
  } catch (error) {
    diagnostics.tests.push({
      name: 'Static Communities Data',
      status: 'fail',
      error: error instanceof Error ? error.message : String(error),
      responseTime: Date.now() - startTime
    });
    diagnostics.summary.failed++;
  }

  // Test 2: Communities API endpoint (static mode)
  if (!fast) {
    try {
      const response = await fetch(new URL('/api/communities?static=true&pageSize=5', request.url));
      const data = await response.json();
      
      diagnostics.tests.push({
        name: 'Communities API (Static)',
        status: response.ok ? 'pass' : 'fail',
        details: {
          status: response.status,
          source: data.source,
          total: data.total,
          communities: data.communities?.length || 0,
          sampleCommunity: data.communities?.[0]?.name || 'None'
        },
        responseTime: Date.now() - startTime
      });
      
      if (response.ok) diagnostics.summary.passed++;
      else diagnostics.summary.failed++;
    } catch (error) {
      diagnostics.tests.push({
        name: 'Communities API (Static)',
        status: 'fail',
        error: error instanceof Error ? error.message : String(error),
        responseTime: Date.now() - startTime
      });
      diagnostics.summary.failed++;
    }
  }

  // Test 3: Individual community route test
  try {
    const { COMMUNITIES } = await import('@/data/communities-polygons');
    const testSlug = COMMUNITIES[0]?.slug;
    
    if (testSlug) {
      const communityResponse = await fetch(new URL(`/api/communities/${testSlug}`, request.url));
      const communityData = await communityResponse.json();
      
      diagnostics.tests.push({
        name: 'Individual Community API',
        status: communityResponse.ok ? 'pass' : 'fail',
        details: {
          testSlug,
          status: communityResponse.status,
          hasName: !!communityData.community?.name,
          hasPolygon: !!communityData.community?.polygon?.length
        },
        responseTime: Date.now() - startTime
      });
      
      if (communityResponse.ok) diagnostics.summary.passed++;
      else diagnostics.summary.failed++;
    }
  } catch (error) {
    diagnostics.tests.push({
      name: 'Individual Community API',
      status: 'fail',
      error: error instanceof Error ? error.message : String(error),
      responseTime: Date.now() - startTime
    });
    diagnostics.summary.failed++;
  }

  // Test 4: Routes accessibility
  try {
    // Check if communities page route exists
    const fs = await import('fs');
    const path = await import('path');
    
    const communitiesPageExists = fs.existsSync(path.join(process.cwd(), 'src/app/communities/page.tsx'));
    const communitySlugExists = fs.existsSync(path.join(process.cwd(), 'src/app/communities/[slug]/page.tsx'));
    
    diagnostics.tests.push({
      name: 'Frontend Routes',
      status: (communitiesPageExists && communitySlugExists) ? 'pass' : 'fail',
      details: {
        communitiesPage: communitiesPageExists,
        communityDetailPage: communitySlugExists,
        routesActive: 'Communities moved from _temp to active'
      },
      responseTime: Date.now() - startTime
    });
    
    if (communitiesPageExists && communitySlugExists) diagnostics.summary.passed++;
    else diagnostics.summary.failed++;
  } catch (error) {
    diagnostics.tests.push({
      name: 'Frontend Routes',
      status: 'fail',
      error: error instanceof Error ? error.message : String(error),
      responseTime: Date.now() - startTime
    });
    diagnostics.summary.failed++;
  }

  diagnostics.summary.total = diagnostics.tests.length;
  diagnostics.summary.responseTime = Date.now() - startTime;

  return NextResponse.json({
    ...diagnostics,
    recommendation: fast 
      ? 'Fast mode: Use /api/communities?static=true for backend editor'
      : diagnostics.summary.passed >= diagnostics.summary.total * 0.75 
        ? 'System healthy: Communities should work in backend editor'
        : 'Issues detected: Check failed tests above',
    backendEditorUrl: fast 
      ? '/api/communities?static=true'
      : '/api/communities?fast=true'
  });
}
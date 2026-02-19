#!/usr/bin/env node

/**
 * MLS Data Sync Script
 * Syncs community data with live MLS listings and market data
 */

import { config } from 'dotenv';

// Load environment variables
config();

// Dynamic imports for better compatibility

async function syncCommunitiesData() {
  console.log('🏘️  Fetching communities from Mission Control...');
  
  try {
    const { searchMLSCommunities } = await import('../src/lib/mls-communities-api.ts');
    
    // Fetch all published communities with live MLS data
    const response = await searchMLSCommunities({
      published: true,
      limit: 200,
      includeLiveData: true,
    });
    
    console.log(`📊 Enhanced ${response.communities.length} communities with live MLS data`);
    
    // Show summary stats
    const totalListings = response.communities.reduce((sum, c) => sum + c.listingsCount, 0);
    const avgMedianPrice = Math.round(
      response.communities
        .filter(c => c.liveStats.medianPrice > 0)
        .reduce((sum, c) => sum + c.liveStats.medianPrice, 0) /
      response.communities.filter(c => c.liveStats.medianPrice > 0).length
    );
    
    console.log(`📈 Total active listings across all communities: ${totalListings.toLocaleString()}`);
    console.log(`💰 Average median price: $${avgMedianPrice.toLocaleString()}`);
    
    // Show top communities by listing count
    console.log('\n🏆 Top 10 communities by active listings:');
    const topCommunities = response.communities
      .filter(c => c.listingsCount > 0)
      .sort((a, b) => b.listingsCount - a.listingsCount)
      .slice(0, 10);
    
    topCommunities.forEach((community, index) => {
      console.log(`${index + 1}. ${community.name}: ${community.listingsCount} listings, $${community.liveStats.medianPrice.toLocaleString()} median`);
    });
    
    return response.communities;
    
  } catch (error) {
    console.error('❌ Failed to sync communities data:', error);
    throw error;
  }
}

async function refreshCache() {
  console.log('\n🔄 Refreshing community cache...');
  
  try {
    const { refreshCommunityCache } = await import('../src/lib/mls-communities-api.ts');
    await refreshCommunityCache(); // Refresh all
    console.log('✅ Community cache refreshed successfully');
  } catch (error) {
    console.error('❌ Failed to refresh cache:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting MLS Data Sync...\n');
  
  const startTime = Date.now();
  
  try {
    // Sync communities with live MLS data
    const communities = await syncCommunitiesData();
    
    // Refresh cache for next requests
    await refreshCache();
    
    const duration = Date.now() - startTime;
    console.log(`\n✅ MLS data sync completed in ${Math.round(duration / 1000)}s`);
    console.log(`📊 Processed ${communities.length} communities with live MLS data`);
    
  } catch (error) {
    console.error('\n❌ MLS data sync failed:', error);
    process.exit(1);
  } finally {
    try {
      const { closeDatabase } = await import('../src/lib/database.ts');
      await closeDatabase();
      console.log('🔒 Database connection closed.');
    } catch (e) {
      console.warn('Warning: Could not close database connection:', e.message);
    }
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: node sync-mls-data.mjs [options]

Options:
  --help, -h     Show this help message
  
This script:
1. Fetches all published communities from Mission Control
2. Enhances each community with live MLS data from Repliers API
3. Caches the results in PostgreSQL for fast retrieval
4. Shows summary statistics and top communities

The script uses the Repliers geo-spatial API to get accurate listing counts
and market data for each community polygon.
  `);
  process.exit(0);
}

main().catch(console.error);
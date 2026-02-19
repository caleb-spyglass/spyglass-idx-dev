#!/usr/bin/env node

/**
 * Sync static communities data to Mission Control database
 * This script pushes all communities from the static data files to Mission Control API
 * 
 * Usage:
 * npm run sync-communities
 * 
 * Or with environment overrides:
 * MISSION_CONTROL_URL=https://custom.url.com PULSE_API_KEY=key npm run sync-communities
 */

import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration from environment or defaults
const MISSION_CONTROL_URL = process.env.MISSION_CONTROL_URL || 'https://missioncontrol-tjfm.onrender.com';
const PULSE_API_KEY = process.env.PULSE_API_KEY;

if (!PULSE_API_KEY) {
  console.error('❌ PULSE_API_KEY environment variable is required');
  process.exit(1);
}

/**
 * Load communities data from static files
 */
async function loadStaticCommunities() {
  try {
    // Import the communities data
    const communitiesPath = path.resolve(__dirname, '../src/data/communities-polygons.ts');
    
    // Read the file content
    const fileContent = fs.readFileSync(communitiesPath, 'utf8');
    
    // Extract the COMMUNITIES array using a regex
    const communitiesMatch = fileContent.match(/export const COMMUNITIES[^=]*=\s*(\[[\s\S]*?\]);/);
    
    if (!communitiesMatch) {
      throw new Error('Could not find COMMUNITIES array in the file');
    }
    
    // Parse the extracted array
    const communitiesString = communitiesMatch[1];
    const communities = eval(communitiesString); // Note: eval is safe here as we control the source
    
    console.log(`📂 Loaded ${communities.length} communities from static data`);
    return communities;
    
  } catch (error) {
    console.error('❌ Error loading static communities data:', error);
    throw error;
  }
}

/**
 * Sync communities to Mission Control in batches
 */
async function syncCommunities() {
  try {
    console.log('🚀 Starting community sync to Mission Control...');
    console.log(`📍 Target URL: ${MISSION_CONTROL_URL}`);
    
    // Load static data
    const communities = await loadStaticCommunities();
    
    // Process in batches to avoid payload size limits
    const BATCH_SIZE = 10;
    const batches = [];
    
    for (let i = 0; i < communities.length; i += BATCH_SIZE) {
      batches.push(communities.slice(i, i + BATCH_SIZE));
    }
    
    console.log(`📤 Syncing ${communities.length} communities in ${batches.length} batches of ${BATCH_SIZE}...`);
    
    let totalSynced = 0;
    let totalErrors = 0;
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      
      console.log(`⏳ Processing batch ${i + 1}/${batches.length} (${batch.length} communities)...`);
      
      const payload = {
        apiKey: PULSE_API_KEY,
        communities: batch.map(community => ({
          slug: community.slug,
          name: community.name,
          county: community.county || 'Travis',
          polygon: community.polygon,
          displayPolygon: community.displayPolygon,
          featured: community.featured || false,
        })),
      };
      
      try {
        // Make the sync request
        const response = await fetch(`${MISSION_CONTROL_URL}/api/public/communities/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        totalSynced += result.synced || 0;
        totalErrors += result.errors || 0;
        
        console.log(`   ✅ Batch ${i + 1}: ${result.synced} synced, ${result.errors} errors`);
        
        // Add a small delay between batches to be nice to the server
        if (i < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
      } catch (error) {
        console.error(`   ❌ Batch ${i + 1} failed:`, error.message);
        totalErrors += batch.length;
      }
    }
    
    console.log('✅ Sync completed!');
    console.log(`📊 Final Results:`);
    console.log(`   • Total Synced: ${totalSynced} communities`);
    console.log(`   • Total Errors: ${totalErrors} communities`);
    
    if (totalErrors > 0) {
      console.warn('⚠️  Some communities had sync errors. Check Mission Control logs for details.');
    }
    
  } catch (error) {
    console.error('❌ Error syncing communities:', error);
    process.exit(1);
  }
}

/**
 * Verify API connectivity
 */
async function verifyConnection() {
  try {
    console.log('🔍 Verifying Mission Control connectivity...');
    
    const response = await fetch(`${MISSION_CONTROL_URL}/api/public/communities?limit=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    console.log('✅ Connection verified!');
    return true;
    
  } catch (error) {
    console.error('❌ Connection verification failed:', error);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🏠 Community Sync Tool');
  console.log('=======================');
  
  // Skip connection verification for now since GET routes are having auth issues
  console.log('⚠️  Skipping connection verification due to known API auth issues');
  console.log('🔄 Proceeding directly to sync with authentication...');
  
  // Proceed with sync
  await syncCommunities();
  
  console.log('\n🎉 All done! Communities have been synced to Mission Control.');
  console.log('💡 You can now manage these communities through the Mission Control admin interface.');
}

// Run the script
main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
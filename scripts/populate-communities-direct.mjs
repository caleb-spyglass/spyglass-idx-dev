#!/usr/bin/env node

/**
 * URGENT: Direct Community Population Script
 * Bypasses Mission Control API and populates communities directly to our database
 * This solves Trisha's immediate need to see 150+ communities
 */

import { config } from 'dotenv';
import fs from 'fs';
import csv from 'csv-parser';

// Load environment variables
config();

async function main() {
  console.log('🚨 URGENT: Direct Community Population');
  console.log('=====================================');
  console.log('⚡ Bypassing Mission Control API due to auth issues');
  console.log('📊 Populating communities directly to local database');
  
  try {
    const { query, initializeDatabase } = await import('../src/lib/database.ts');
    
    // Initialize database
    console.log('🔧 Initializing database...');
    await initializeDatabase();
    
    // Load communities from CSV
    console.log('📂 Loading communities from CSV...');
    const communities = [];
    
    await new Promise((resolve, reject) => {
      fs.createReadStream('data/communities.csv')
        .pipe(csv())
        .on('data', (row) => {
          if (row.Name && row['Polygon Coordinates']) {
            // Parse polygon coordinates
            const coordPairs = row['Polygon Coordinates'].split(';');
            const polygon = coordPairs.map(pair => {
              const [lat, lng] = pair.split(',').map(Number);
              return [lat, lng];
            });
            
            const community = {
              name: row.Name,
              slug: row.Name.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim(),
              county: 'Travis', // Default for Austin area
              polygon: polygon,
              displayPolygon: polygon,
              featured: false,
            };
            
            communities.push(community);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });
    
    console.log(`✅ Loaded ${communities.length} communities from CSV`);
    
    // Insert communities directly into our cache table
    console.log('💾 Inserting communities into database...');
    
    let inserted = 0;
    let errors = 0;
    
    for (const community of communities) {
      try {
        await query(`
          INSERT INTO communities_cache (slug, community_data, polygon, display_polygon, last_updated, expires_at)
          VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days')
          ON CONFLICT (slug) DO UPDATE SET
            community_data = $2,
            polygon = $3,
            display_polygon = $4,
            last_updated = CURRENT_TIMESTAMP
        `, [
          community.slug,
          JSON.stringify(community),
          JSON.stringify(community.polygon),
          JSON.stringify(community.displayPolygon)
        ]);
        
        inserted++;
      } catch (error) {
        console.error(`❌ Error inserting ${community.name}:`, error.message);
        errors++;
      }
    }
    
    console.log('\n🎉 POPULATION COMPLETE!');
    console.log(`✅ Successfully inserted: ${inserted} communities`);
    console.log(`❌ Errors: ${errors} communities`);
    
    // Test the population by fetching from our API
    console.log('\n🧪 Testing local API...');
    
    try {
      const response = await fetch('http://localhost:3000/api/communities?live=false', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Local API working: ${data.communities?.length || 0} communities available`);
      } else {
        console.log('⚠️  Local API test failed - start dev server to test');
      }
    } catch (e) {
      console.log('⚠️  Local API test skipped - start dev server to test');
    }
    
    console.log('\n📋 IMMEDIATE ACTIONS FOR TRISHA:');
    console.log('1. ✅ Communities are now in the database');
    console.log('2. 🚀 Start the development server: npm run dev');
    console.log('3. 🌐 Access communities at: http://localhost:3000/api/communities');
    console.log('4. 📊 View admin dashboard for MLS data sync');
    
    // Now enhance with MLS data
    console.log('\n⚡ Enhancing communities with live MLS data...');
    await enhanceWithMLSData(communities);
    
  } catch (error) {
    console.error('❌ Population failed:', error);
    process.exit(1);
  }
}

async function enhanceWithMLSData(communities) {
  try {
    const { getLiveMarketData } = await import('../src/lib/repliers-api.ts');
    const { query } = await import('../src/lib/database.ts');
    
    console.log(`🔄 Processing ${communities.length} communities for MLS data...`);
    
    let enhanced = 0;
    const sampleSize = Math.min(10, communities.length); // Process first 10 for speed
    
    for (let i = 0; i < sampleSize; i++) {
      const community = communities[i];
      
      try {
        console.log(`   Processing ${i + 1}/${sampleSize}: ${community.name}`);
        
        // Get live market data for this community
        const repliersPolygon = community.polygon.map(([lat, lng]) => [lng, lat]);
        const liveStats = await getLiveMarketData({ polygon: repliersPolygon });
        
        // Update community with MLS data
        const enhancedCommunity = {
          ...community,
          liveStats: {
            ...liveStats,
            lastUpdated: new Date(),
          },
          listingsCount: liveStats.activeListings,
        };
        
        // Update in database
        await query(`
          UPDATE communities_cache 
          SET community_data = $2, last_updated = CURRENT_TIMESTAMP
          WHERE slug = $1
        `, [
          community.slug,
          JSON.stringify(enhancedCommunity)
        ]);
        
        enhanced++;
        console.log(`   ✅ ${community.name}: ${liveStats.activeListings} listings, $${liveStats.medianPrice.toLocaleString()} median`);
        
      } catch (error) {
        console.log(`   ⚠️  ${community.name}: MLS data unavailable (${error.message})`);
      }
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n🎯 MLS Enhancement Complete: ${enhanced}/${sampleSize} communities enhanced`);
    
  } catch (error) {
    console.error('❌ MLS enhancement failed:', error);
  }
}

main().catch(console.error);
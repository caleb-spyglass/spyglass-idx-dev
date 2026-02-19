#!/usr/bin/env node

/**
 * URGENT: Emergency Community Population
 * Direct database population bypassing all complex imports
 */

import { config } from 'dotenv';
import fs from 'fs';
import csv from 'csv-parser';
import pkg from 'pg';

const { Pool } = pkg;

// Load environment variables
config();

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  console.log('🚨 URGENT: Emergency Community Population');
  console.log('=========================================');
  console.log('📊 Direct database population starting...');
  
  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL not found');
    process.exit(1);
  }
  
  // Create database connection
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  
  try {
    // Test connection
    console.log('🔧 Testing database connection...');
    const testResult = await pool.query('SELECT NOW() as current_time');
    console.log('✅ Database connected:', testResult.rows[0].current_time);
    
    // Create table if not exists
    console.log('🔧 Ensuring communities_cache table exists...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS communities_cache (
        slug VARCHAR(100) PRIMARY KEY,
        community_data JSONB NOT NULL,
        polygon JSONB,
        display_polygon JSONB,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days')
      )
    `);
    
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
              county: 'Travis',
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
    
    // Insert communities
    console.log('💾 Inserting communities into database...');
    
    let inserted = 0;
    let updated = 0;
    let errors = 0;
    
    for (const community of communities) {
      try {
        const result = await pool.query(`
          INSERT INTO communities_cache (slug, community_data, polygon, display_polygon)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (slug) DO UPDATE SET
            community_data = $2,
            polygon = $3,
            display_polygon = $4,
            last_updated = CURRENT_TIMESTAMP
          RETURNING (xmax = 0) AS inserted
        `, [
          community.slug,
          JSON.stringify(community),
          JSON.stringify(community.polygon),
          JSON.stringify(community.displayPolygon)
        ]);
        
        if (result.rows[0].inserted) {
          inserted++;
        } else {
          updated++;
        }
        
        if ((inserted + updated) % 50 === 0) {
          console.log(`   Progress: ${inserted + updated}/${communities.length} processed...`);
        }
        
      } catch (error) {
        console.error(`❌ Error with ${community.name}:`, error.message);
        errors++;
      }
    }
    
    console.log('\n🎉 DATABASE POPULATION COMPLETE!');
    console.log(`✅ Inserted: ${inserted} new communities`);
    console.log(`🔄 Updated: ${updated} existing communities`);  
    console.log(`❌ Errors: ${errors} communities`);
    console.log(`📊 Total in database: ${inserted + updated} communities`);
    
    // Verify data
    const countResult = await pool.query('SELECT COUNT(*) as total FROM communities_cache');
    console.log(`🔍 Database verification: ${countResult.rows[0].total} communities in cache`);
    
    // Sample some communities
    const sampleResult = await pool.query(`
      SELECT community_data->>'name' as name, 
             jsonb_array_length(polygon) as polygon_points
      FROM communities_cache 
      LIMIT 5
    `);
    
    console.log('\n📋 Sample communities in database:');
    sampleResult.rows.forEach((row, i) => {
      console.log(`   ${i + 1}. ${row.name} (${row.polygon_points} boundary points)`);
    });
    
    console.log('\n🚀 NEXT STEPS FOR TRISHA:');
    console.log('1. ✅ Communities are now in the database');
    console.log('2. 🌐 Start dev server: npm run dev');
    console.log('3. 📊 Access: http://localhost:3000/api/communities');
    console.log('4. 🎯 View admin dashboard for MLS sync controls');
    
  } catch (error) {
    console.error('❌ Population failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
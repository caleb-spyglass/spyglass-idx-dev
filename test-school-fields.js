#!/usr/bin/env node
/**
 * Test script to check what fields are available in Repliers API responses
 * Usage: node test-school-fields.js
 */

import { searchListings } from './src/lib/repliers-api.js';

async function testSchoolFields() {
  console.log('🔍 Testing Repliers API for school fields...\n');
  
  try {
    // Get a small sample of listings
    const results = await searchListings({
      pageSize: 3,
      area: 'Travis'  // Austin area
    });
    
    console.log(`📊 Found ${results.total} total listings, showing ${results.listings.length} samples\n`);
    
    results.listings.forEach((listing, index) => {
      console.log(`=== LISTING ${index + 1}: ${listing.mlsNumber} ===`);
      console.log(`Address: ${listing.address.full}`);
      console.log(`Price: $${listing.price.toLocaleString()}`);
      
      // Check the raw listing data that comes from Repliers API
      // We need to access the original data before transformation
      console.log('\n📋 Available fields in listing:');
      console.log(Object.keys(listing).sort());
      
      // Look for any school-related fields
      console.log('\n🏫 School-related fields:');
      Object.entries(listing).forEach(([key, value]) => {
        if (key.toLowerCase().includes('school') || 
            key.toLowerCase().includes('district') ||
            key.toLowerCase().includes('elementary') ||
            key.toLowerCase().includes('middle') ||
            key.toLowerCase().includes('high')) {
          console.log(`  ${key}: ${value}`);
        }
      });
      
      console.log('\n' + '='.repeat(50) + '\n');
    });
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testSchoolFields().catch(console.error);
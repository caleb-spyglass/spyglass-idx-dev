#!/usr/bin/env node
/**
 * Test script to check what fields are available in Repliers API responses
 * Usage: cd spyglass-idx && node test-school-fields.mjs
 */

import fetch from 'node-fetch';

const REPLIERS_API_URL = process.env.REPLIERS_API_URL || 'https://api.repliers.io';
const REPLIERS_API_KEY = process.env.REPLIERS_API_KEY;

console.log('🔍 Testing Repliers API for school fields...\n');
console.log('API URL:', REPLIERS_API_URL);
console.log('API Key exists:', !!REPLIERS_API_KEY);

if (!REPLIERS_API_KEY) {
  console.error('❌ No REPLIERS_API_KEY found in environment variables');
  console.log('Please set the API key and try again.');
  process.exit(1);
}

async function testSchoolFields() {
  try {
    console.log('\n📡 Making API request...');
    
    const response = await fetch(`${REPLIERS_API_URL}/listings?resultsPerPage=2&status=A&area=Travis`, {
      headers: {
        'Content-Type': 'application/json',
        'REPLIERS-API-KEY': REPLIERS_API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.listings || data.listings.length === 0) {
      console.log('❌ No listings returned from API');
      return;
    }
    
    console.log(`📊 Found ${data.count} total listings, showing ${data.listings.length} samples\n`);
    
    data.listings.forEach((listing, index) => {
      console.log(`=== RAW LISTING ${index + 1}: ${listing.mlsNumber} ===`);
      console.log(`Address: ${listing.address?.streetNumber} ${listing.address?.streetName}, ${listing.address?.city}`);
      console.log(`Price: $${listing.listPrice?.toLocaleString()}`);
      
      // Show ALL fields in the details object
      if (listing.details) {
        console.log('\n📋 ALL DETAIL FIELDS:');
        const sortedKeys = Object.keys(listing.details).sort();
        console.log(sortedKeys);
        
        console.log('\n🏫 SCHOOL-RELATED FIELDS:');
        let foundSchoolFields = false;
        Object.entries(listing.details).forEach(([key, value]) => {
          const lowerKey = key.toLowerCase();
          if (lowerKey.includes('school') || 
              lowerKey.includes('district') ||
              lowerKey.includes('elementary') ||
              lowerKey.includes('middle') ||
              lowerKey.includes('high') ||
              lowerKey.includes('education')) {
            console.log(`  ✅ ${key}: "${value}"`);
            foundSchoolFields = true;
          }
        });
        
        if (!foundSchoolFields) {
          console.log('  ❌ No school-related fields found');
        }
        
        // Show a few sample detail fields for context
        console.log('\n📝 SAMPLE DETAIL FIELDS:');
        Object.entries(listing.details).slice(0, 10).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      } else {
        console.log('❌ No details object found');
      }
      
      console.log('\n' + '='.repeat(60) + '\n');
    });
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

// Run the test
testSchoolFields();
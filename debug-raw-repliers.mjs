#!/usr/bin/env node
/**
 * Direct test of Repliers API to see ALL available fields
 * This bypasses the transformation layer to see raw MLS data
 */

// Read environment variables from .env file
import { readFileSync } from 'fs';
import fetch from 'node-fetch';

// Parse .env file manually
try {
  const envContent = readFileSync('.env', 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  // Set environment variables
  Object.assign(process.env, envVars);
} catch (error) {
  console.log('No .env file found or error reading it');
}

const REPLIERS_API_URL = process.env.REPLIERS_API_URL || 'https://api.repliers.io';
const REPLIERS_API_KEY = process.env.REPLIERS_API_KEY;

console.log('🔍 DIRECT Repliers API School Fields Test');
console.log('==========================================');
console.log('API URL:', REPLIERS_API_URL);
console.log('API Key exists:', !!REPLIERS_API_KEY);
console.log('');

if (!REPLIERS_API_KEY) {
  console.error('❌ ERROR: No REPLIERS_API_KEY found');
  console.log('💡 SOLUTION: Set the API key in .env file:');
  console.log('   REPLIERS_API_KEY=your_actual_key_here');
  process.exit(1);
}

async function testRawRepliers() {
  try {
    console.log('📡 Making direct API call to Repliers...');
    
    const url = `${REPLIERS_API_URL}/listings?resultsPerPage=2&status=A&area=Travis`;
    console.log('URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'REPLIERS-API-KEY': REPLIERS_API_KEY
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText}\n${errorText}`);
    }
    
    const data = await response.json();
    console.log(`✅ API call successful! Found ${data.count} listings\n`);
    
    if (!data.listings || data.listings.length === 0) {
      console.log('❌ No listings in response');
      return;
    }
    
    // Examine the first listing's raw structure
    const listing = data.listings[0];
    
    console.log('🏠 SAMPLE LISTING:');
    console.log('================');
    console.log('MLS#:', listing.mlsNumber);
    console.log('Address:', `${listing.address?.streetNumber} ${listing.address?.streetName}, ${listing.address?.city}`);
    console.log('Price: $' + listing.listPrice?.toLocaleString());
    console.log('');
    
    console.log('📋 ALL TOP-LEVEL FIELDS:');
    console.log('========================');
    console.log(Object.keys(listing).sort());
    console.log('');
    
    if (listing.details) {
      console.log('🔍 ALL DETAIL FIELDS (' + Object.keys(listing.details).length + ' total):');
      console.log('============================');
      const detailKeys = Object.keys(listing.details).sort();
      console.log(detailKeys);
      console.log('');
      
      console.log('🏫 SCHOOL-RELATED FIELDS:');
      console.log('=========================');
      let foundSchoolFields = [];
      
      Object.entries(listing.details).forEach(([key, value]) => {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('school') || 
            lowerKey.includes('district') ||
            lowerKey.includes('elementary') ||
            lowerKey.includes('middle') ||
            lowerKey.includes('high') ||
            lowerKey.includes('education')) {
          foundSchoolFields.push(`${key}: "${value}"`);
        }
      });
      
      if (foundSchoolFields.length > 0) {
        console.log('✅ FOUND SCHOOL FIELDS:');
        foundSchoolFields.forEach(field => console.log('  ' + field));
        console.log('');
        console.log('🎯 CONCLUSION: Scenario 1 (Direct API Filtering) IS POSSIBLE!');
      } else {
        console.log('❌ No school fields found in details object');
        console.log('');
        console.log('🔄 CONCLUSION: Need Scenario 2 (Post-filtering) or Scenario 3 (External data)');
      }
      
      console.log('');
      console.log('📝 SAMPLE DETAIL FIELDS (first 10):');
      console.log('===================================');
      Object.entries(listing.details).slice(0, 10).forEach(([key, value]) => {
        console.log(`  ${key}: ${JSON.stringify(value)}`);
      });
      
    } else {
      console.log('❌ No details object found in listing');
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.log('');
    console.log('🔧 TROUBLESHOOTING:');
    console.log('1. Check if REPLIERS_API_KEY is correct in .env file');
    console.log('2. Verify API endpoint is accessible');
    console.log('3. Check network connectivity');
  }
}

// Run the test
testRawRepliers();
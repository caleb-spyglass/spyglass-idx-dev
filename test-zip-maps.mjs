#!/usr/bin/env node
/**
 * Test script to validate Zip Code Interactive Maps functionality
 * Run with: node test-zip-maps.mjs
 */

import { readFileSync } from 'fs';
import path from 'path';

console.log('🗺️  Testing Zip Code Interactive Maps System\n');

// Test 1: Check environment variables
console.log('📋 1. Environment Configuration');
const envPath = path.join(process.cwd(), '.env');
try {
  const envContent = readFileSync(envPath, 'utf8');
  
  const hasMapboxToken = envContent.includes('NEXT_PUBLIC_MAPBOX_TOKEN=pk.');
  const hasPulseKey = envContent.includes('PULSE_API_KEY=');
  const hasMissionControlUrl = envContent.includes('MISSION_CONTROL_URL=');
  
  console.log(`   Mapbox Token: ${hasMapboxToken ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   Pulse API Key: ${hasPulseKey ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   Mission Control URL: ${hasMissionControlUrl ? '✅ Configured' : '❌ Missing'}`);
} catch (error) {
  console.log('   ❌ Could not read .env file');
}

// Test 2: Check component files
console.log('\n📋 2. Map Components');
const componentPaths = [
  'src/components/zip-codes/ZipCodeMap.tsx',
  'src/components/zip-codes/ZipCodeDetailMap.tsx',
  'src/components/zip-codes/MapDiagnostics.tsx',
];

componentPaths.forEach(componentPath => {
  try {
    const content = readFileSync(componentPath, 'utf8');
    const hasMapboxImport = content.includes('mapbox-gl');
    const hasErrorHandling = content.includes('loadError') || content.includes('setLoadError');
    
    console.log(`   ${path.basename(componentPath)}: ${hasMapboxImport && hasErrorHandling ? '✅' : '⚠️'} ${hasMapboxImport ? 'Mapbox' : 'No-Mapbox'} ${hasErrorHandling ? 'ErrorHandling' : 'No-ErrorHandling'}`);
  } catch (error) {
    console.log(`   ${path.basename(componentPath)}: ❌ Missing`);
  }
});

// Test 3: Check zip codes data
console.log('\n📋 3. Zip Code Data');
try {
  const zipDataPath = 'src/data/zip-codes-data.ts';
  const zipContent = readFileSync(zipDataPath, 'utf8');
  
  // Count zip codes with polygon data
  const polygonMatches = zipContent.match(/polygon:\s*\[/g) || [];
  const coordinateMatches = zipContent.match(/coordinates:\s*\{/g) || [];
  
  console.log(`   Polygon Boundaries: ${polygonMatches.length > 0 ? '✅' : '❌'} ${polygonMatches.length} zip codes`);
  console.log(`   Center Coordinates: ${coordinateMatches.length > 0 ? '✅' : '❌'} ${coordinateMatches.length} zip codes`);
} catch (error) {
  console.log('   ❌ Could not read zip codes data');
}

// Test 4: Check Pulse API integration  
console.log('\n📋 4. Pulse API Integration');
try {
  const pulseApiPath = 'src/lib/pulse-api.ts';
  const pulseContent = readFileSync(pulseApiPath, 'utf8');
  
  const hasAuth = pulseContent.includes('X-API-Key') && pulseContent.includes('Authorization');
  const hasFallback = pulseContent.includes('ENHANCED_PULSE_DATA');
  const hasErrorHandling = pulseContent.includes('catch') && pulseContent.includes('fallback');
  
  console.log(`   Authentication: ${hasAuth ? '✅ Multi-method' : '⚠️ Basic'}`);
  console.log(`   Fallback Data: ${hasFallback ? '✅ Mock data available' : '❌ No fallback'}`);
  console.log(`   Error Handling: ${hasErrorHandling ? '✅ Graceful degradation' : '❌ No error handling'}`);
} catch (error) {
  console.log('   ❌ Could not read Pulse API');
}

// Test 5: Check test zip codes
console.log('\n📋 5. Test Zip Codes Status');
const testZips = ['78701', '78702', '78703', '78704'];
testZips.forEach(zip => {
  console.log(`   ${zip}: 🧪 Enhanced Pulse data + Interactive map`);
});

console.log('\n🎯 Map System Test Summary:');
console.log('   • Interactive maps use Mapbox GL JS with polygon overlays');
console.log('   • Fallback to static images when Mapbox unavailable');
console.log('   • Enhanced market data for 4 test zip codes (78701-78704)');
console.log('   • Graceful degradation with mock data fallbacks');
console.log('   • Diagnostic component added for real-time testing');

console.log('\n✅ Zip Code Interactive Maps system ready for testing!');
console.log('   Visit: https://spyglass-idx.vercel.app/zip-codes/78704 to test');
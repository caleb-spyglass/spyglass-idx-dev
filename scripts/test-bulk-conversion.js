#!/usr/bin/env node

const fs = require('fs');
const { convertAllCommunities, parseCSV } = require('./merge-communities.js');
const { convertIdxToRepliers } = require('./convert-to-repliers.js');

function testBulkConversion() {
  console.log('🧪 Testing Bulk IDX to Repliers Conversion');
  console.log('==========================================');

  // Read existing communities
  const existingContent = fs.readFileSync('data/communities.csv', 'utf8');
  const { communities } = parseCSV(existingContent);
  
  console.log(`📖 Loaded ${communities.length} existing communities`);
  console.log('\n🔄 Converting first 5 communities...\n');

  communities.slice(0, 5).forEach((community, index) => {
    console.log(`${index + 1}. ${community.name}`);
    console.log(`   IDX: ${community.coordinates.substring(0, 60)}...`);
    
    const converted = convertIdxToRepliers(community.coordinates);
    if (converted && converted.length > 0) {
      console.log(`   ✅ Repliers: [${converted[0][0]}, ${converted[0][1]}] ... (${converted.length} points)`);
    } else {
      console.log(`   ❌ Conversion failed`);
    }
    console.log('');
  });

  // Test conversion stats
  let successful = 0;
  let failed = 0;
  
  communities.forEach(community => {
    const converted = convertIdxToRepliers(community.coordinates);
    if (converted) {
      successful++;
    } else {
      failed++;
    }
  });

  console.log('📊 Conversion Statistics:');
  console.log(`   ✅ Successful: ${successful}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${((successful / communities.length) * 100).toFixed(1)}%`);

  return { successful, failed, total: communities.length };
}

if (require.main === module) {
  testBulkConversion();
}

module.exports = { testBulkConversion };
#!/usr/bin/env node

/**
 * Community Data Merger
 * Merges new community data with existing data, removing duplicates
 * Usage: node scripts/merge-communities.js <new-csv-file>
 */

const fs = require('fs');
const path = require('path');

function parseCSV(content) {
  const lines = content.trim().split('\n');
  const header = lines[0];
  const communities = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Find the first quote after a comma to split name and coordinates
    const firstQuoteIndex = line.indexOf(',"');
    if (firstQuoteIndex === -1) continue;
    
    const name = line.substring(0, firstQuoteIndex).trim();
    const coordinates = line.substring(firstQuoteIndex + 2, line.length - 1); // Remove ," and closing "
    
    if (name && coordinates) {
      communities.push({
        name: name,
        coordinates: coordinates
      });
    }
  }
  
  return { header, communities };
}

function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove multiple hyphens
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

function normalizeName(name) {
  // Normalize for comparison (uppercase, remove extra spaces, etc.)
  return name.trim().toUpperCase();
}

function mergeCommunities(existing, newData) {
  const merged = [...existing];
  const existingNames = new Set(existing.map(c => normalizeName(c.name)));
  
  let addedCount = 0;
  let duplicateCount = 0;
  const duplicates = [];
  
  for (const newCommunity of newData) {
    const normalizedName = normalizeName(newCommunity.name);
    
    if (existingNames.has(normalizedName)) {
      duplicateCount++;
      duplicates.push(newCommunity.name);
    } else {
      merged.push(newCommunity);
      existingNames.add(normalizedName);
      addedCount++;
    }
  }
  
  return {
    communities: merged,
    stats: {
      existingCount: existing.length,
      newCount: newData.length,
      addedCount,
      duplicateCount,
      finalCount: merged.length,
      duplicates
    }
  };
}

function writeCSV(communities, header, outputPath) {
  const lines = [header];
  
  for (const community of communities) {
    lines.push(`${community.name},"${community.coordinates}"`);
  }
  
  fs.writeFileSync(outputPath, lines.join('\n'));
}

function main() {
  const newCsvFile = process.argv[2];
  
  if (!newCsvFile) {
    console.error('Usage: node scripts/merge-communities.js <new-csv-file>');
    process.exit(1);
  }
  
  if (!fs.existsSync(newCsvFile)) {
    console.error(`Error: File '${newCsvFile}' not found`);
    process.exit(1);
  }
  
  const existingFile = path.join(__dirname, '../data/communities.csv');
  
  console.log('🔄 Community Data Merger');
  console.log('========================');
  
  // Read existing data
  console.log('📖 Reading existing communities...');
  const existingContent = fs.readFileSync(existingFile, 'utf8');
  const { header, communities: existingCommunities } = parseCSV(existingContent);
  console.log(`   Found ${existingCommunities.length} existing communities`);
  
  // Read new data
  console.log('📖 Reading new communities...');
  const newContent = fs.readFileSync(newCsvFile, 'utf8');
  const { communities: newCommunities } = parseCSV(newContent);
  console.log(`   Found ${newCommunities.length} new communities`);
  
  // Merge data
  console.log('🔀 Merging communities...');
  const result = mergeCommunities(existingCommunities, newCommunities);
  
  // Create backup
  const backupFile = path.join(__dirname, '../data/communities.csv.backup');
  fs.copyFileSync(existingFile, backupFile);
  console.log(`💾 Backup created: ${backupFile}`);
  
  // Write merged data
  writeCSV(result.communities, header, existingFile);
  
  // Report results
  console.log('\n✅ Merge Complete!');
  console.log('==================');
  console.log(`📊 Statistics:`);
  console.log(`   • Existing communities: ${result.stats.existingCount}`);
  console.log(`   • New communities: ${result.stats.newCount}`);
  console.log(`   • Added to system: ${result.stats.addedCount}`);
  console.log(`   • Duplicates skipped: ${result.stats.duplicateCount}`);
  console.log(`   • Final total: ${result.stats.finalCount}`);
  
  if (result.stats.duplicates.length > 0) {
    console.log(`\n⚠️  Duplicate Communities Skipped:`);
    result.stats.duplicates.slice(0, 10).forEach(name => {
      console.log(`   • ${name}`);
    });
    if (result.stats.duplicates.length > 10) {
      console.log(`   ... and ${result.stats.duplicates.length - 10} more`);
    }
  }
  
  if (result.stats.addedCount > 0) {
    console.log('\n🚀 Next Steps:');
    console.log('   1. Run: npm run build');
    console.log('   2. Deploy: vercel --prod');
    console.log(`   3. New static pages will be generated for ${result.stats.addedCount} communities`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { mergeCommunities, parseCSV, normalizeName };
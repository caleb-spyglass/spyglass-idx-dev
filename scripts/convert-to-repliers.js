#!/usr/bin/env node

/**
 * IDX to Repliers Coordinate Converter
 * Converts IDX polygon coordinates to Repliers "map" parameter format
 * Usage: node scripts/convert-to-repliers.js
 */

/**
 * Convert IDX coordinate string to Repliers map format
 * @param {string} idxCoordinates - "lat,lng;lat,lng;lat,lng"
 * @returns {Array} Repliers format [[lng,lat],[lng,lat],[lng,lat]]
 */
function convertIdxToRepliers(idxCoordinates) {
  if (!idxCoordinates || typeof idxCoordinates !== 'string') {
    return null;
  }

  try {
    // Split by semicolon to get individual coordinate pairs
    const coordinatePairs = idxCoordinates.split(';');
    
    const repliersCoordinates = coordinatePairs.map(pair => {
      const [lat, lng] = pair.split(',').map(coord => parseFloat(coord.trim()));
      
      if (isNaN(lat) || isNaN(lng)) {
        throw new Error(`Invalid coordinate pair: ${pair}`);
      }
      
      // Repliers format: [longitude, latitude] (lng first!)
      return [lng, lat];
    });

    return repliersCoordinates;
  } catch (error) {
    console.error('Error converting coordinates:', error.message);
    return null;
  }
}

/**
 * Create Repliers API map parameter object
 * @param {string} communityName 
 * @param {string} idxCoordinates 
 * @returns {Object} Ready for Repliers API
 */
function createRepliersMapParameter(communityName, idxCoordinates) {
  const coordinates = convertIdxToRepliers(idxCoordinates);
  
  if (!coordinates) {
    return null;
  }

  return {
    communityName,
    repliersMapParam: {
      map: [coordinates] // Single polygon wrapped in array
    }
  };
}

/**
 * Convert all communities from IDX format
 * @param {Array} communities - Array of {name, coordinates}
 * @returns {Array} Array of converted communities
 */
function convertAllCommunities(communities) {
  const converted = [];
  const failed = [];

  communities.forEach((community, index) => {
    const result = createRepliersMapParameter(community.name, community.coordinates);
    
    if (result) {
      converted.push(result);
    } else {
      failed.push({
        name: community.name,
        index: index + 1,
        coordinates: community.coordinates?.substring(0, 50) + '...'
      });
    }
  });

  return { converted, failed };
}

/**
 * Generate Repliers API request for listings in community
 * @param {Object} repliersMapParam 
 * @param {Object} filters - Additional filters (minBeds, maxPrice, etc.)
 * @returns {Object} Complete API request object
 */
function generateListingsRequest(repliersMapParam, filters = {}) {
  const request = {
    method: 'POST',
    url: 'https://api.repliers.io/listings',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      ...repliersMapParam,
      ...filters
    }
  };

  return request;
}

// Example usage and testing
function runExample() {
  console.log('🔄 IDX to Repliers Coordinate Converter');
  console.log('======================================');

  // Test with sample IDX coordinates
  const sampleIdxCoords = "30.456707349558,-97.792307359674;30.452867912188,-97.791539155662;30.448674860008,-97.790700219901";
  
  console.log('\n📍 Sample IDX Coordinates:');
  console.log(sampleIdxCoords.substring(0, 80) + '...');

  const converted = convertIdxToRepliers(sampleIdxCoords);
  console.log('\n🗺️  Converted to Repliers Format:');
  console.log(JSON.stringify(converted, null, 2));

  const mapParam = createRepliersMapParameter("Anderson Mill", sampleIdxCoords);
  console.log('\n📋 Repliers Map Parameter:');
  console.log(JSON.stringify(mapParam, null, 2));

  const apiRequest = generateListingsRequest(mapParam.repliersMapParam, {
    minBeds: 3,
    maxPrice: 800000,
    city: 'Austin'
  });
  console.log('\n🚀 Complete API Request:');
  console.log(JSON.stringify(apiRequest, null, 2));
}

if (require.main === module) {
  runExample();
}

module.exports = {
  convertIdxToRepliers,
  createRepliersMapParameter,
  convertAllCommunities,
  generateListingsRequest
};
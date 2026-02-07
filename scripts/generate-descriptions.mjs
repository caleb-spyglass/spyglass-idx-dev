#!/usr/bin/env node

/**
 * Generate community descriptions for all Austin-area communities
 * that don't have hand-written descriptions yet.
 * 
 * This generates reasonable, unique descriptions based on:
 * - Community name
 * - County location
 * - Geographic position (centroid from polygon data)
 */

import fs from 'fs';
import path from 'path';

const missing = JSON.parse(fs.readFileSync('/tmp/missing-communities.json', 'utf-8'));

// Read polygon data to get centroids
const polyContent = fs.readFileSync('src/data/communities-polygons.ts', 'utf-8');

function getCentroid(slug) {
  // Find the polygon for this slug
  const regex = new RegExp(`"slug": "${slug}"[\\s\\S]*?"polygon": \\[([\\s\\S]*?)\\],\\s*"displayPolygon"`, 'm');
  const match = polyContent.match(regex);
  if (!match) return { lat: 30.27, lng: -97.74 };
  
  const coords = [...match[1].matchAll(/\[\s*([-\d.]+),\s*([-\d.]+)\s*\]/g)];
  if (coords.length === 0) return { lat: 30.27, lng: -97.74 };
  
  let latSum = 0, lngSum = 0;
  coords.forEach(c => {
    lngSum += parseFloat(c[1]);
    latSum += parseFloat(c[2]);
  });
  return { lat: latSum / coords.length, lng: lngSum / coords.length };
}

function formatName(name) {
  const lowerWords = new Set(['at', 'of', 'the', 'in', 'on', 'and', 'or']);
  return name.split(/[\s]+/).map((word, i) => {
    return word.split('-').map((part, j) => {
      const lower = part.toLowerCase();
      if (i > 0 && j === 0 && lowerWords.has(lower)) return lower;
      if (lower === 'mlk') return 'MLK';
      if (lower === 'ut') return 'UT';
      if (lower === 'lbj') return 'LBJ';
      if (lower === 'rmma') return 'RMMA';
      if (lower === 'ng') return '';
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }).filter(Boolean).join(' ');
  }).join(' ').replace(/\s+/g, ' ').trim();
}

// Austin downtown is roughly 30.267, -97.743
const AUSTIN_CENTER = { lat: 30.267, lng: -97.743 };

function getDirection(centroid) {
  const latDiff = centroid.lat - AUSTIN_CENTER.lat;
  const lngDiff = centroid.lng - AUSTIN_CENTER.lng;
  
  let ns = '';
  let ew = '';
  
  if (latDiff > 0.02) ns = 'north';
  else if (latDiff < -0.02) ns = 'south';
  
  if (lngDiff > 0.02) ew = 'west';
  else if (lngDiff < -0.02) ew = 'east';
  
  if (ns && ew) return `${ns}${ew}`;
  if (ns) return ns;
  if (ew) return ew;
  return 'central';
}

function getDistanceFromDowntown(centroid) {
  const R = 6371;
  const dLat = ((centroid.lat - AUSTIN_CENTER.lat) * Math.PI) / 180;
  const dLng = ((centroid.lng - AUSTIN_CENTER.lng) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(AUSTIN_CENTER.lat * Math.PI / 180) * Math.cos(centroid.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Known info about communities for richer descriptions
const communityInfo = {
  'cherrywood': { area: 'East Austin', vibe: 'eclectic and walkable', school: 'Lee Elementary', near: 'Mueller', features: ['French Place', 'Cherrywood Coffeehouse', 'Fiesta grocery', 'I-35 access', 'Mueller development'] },
  'windsor-park': { area: 'North Central', vibe: 'diverse and affordable', school: 'Harris Elementary', near: 'Mueller', features: ['Bartholomew Pool', 'Windsor Park Library', 'Mueller development', 'I-35 access', 'Airport Blvd corridor'] },
  'french-place': { area: 'Central East', vibe: 'quiet and residential', school: 'Lee Elementary', near: 'UT campus', features: ['Cherrywood Coffeehouse', 'Mueller development', 'UT campus proximity', 'I-35 access', 'Historic homes'] },
  'hancock': { area: 'Central', vibe: 'established and convenient', near: 'UT campus', features: ['Hancock Center', 'Hancock Golf Course', 'UT campus', 'I-35 access', 'Red River cultural district'] },
  'holly': { area: 'East Austin', vibe: 'revitalizing waterfront', near: 'Lady Bird Lake', features: ['Holly Shores', 'Lady Bird Lake', 'East Cesar Chavez shops', 'Rainey Street district', 'Festival Beach'] },
  'east-cesar-chavez': { area: 'East Austin', vibe: 'vibrant and cultural', near: 'downtown', features: ['Cesar Chavez Street corridor', 'Lady Bird Lake', 'East Side restaurants', 'Rainey Street', 'Historic murals'] },
  'govalle': { area: 'East Austin', vibe: 'up-and-coming creative', near: 'downtown', features: ['Govalle Park', 'Springdale General', 'Easy Tiger East', 'Boggy Creek Greenbelt', 'Airport Blvd'] },
  'riverside': { area: 'South Central', vibe: 'rapidly developing', near: 'downtown', features: ['Pleasant Valley corridor', 'Roy G. Guerrero Park', 'Riverside Drive', 'Oracle campus', 'Lady Bird Lake access'] },
  'south-river-city': { area: 'South Central', vibe: 'established and convenient', near: 'downtown', features: ['South First Street', 'Lady Bird Lake', 'Long Center', 'Bouldin Creek area', 'Hike-and-bike trail'] },
  'jester': { area: 'Northwest Austin', vibe: 'family-friendly suburban', near: 'Loop 360', features: ['River Place Nature Trail', 'Jester Estates', 'Loop 360 access', 'Lake Austin views', 'Eanes ISD proximity'] },
  'jollyville': { area: 'Northwest Austin', vibe: 'established and convenient', near: 'The Domain', features: ['Jollyville Road corridor', 'Anderson Mill area', 'US-183 access', 'Round Rock ISD', 'Great Hills Trail'] },
  'highland': { area: 'North Central', vibe: 'reimagined retail-to-residential', near: 'The Domain', features: ['Highland redevelopment', 'ACC Highland campus', 'I-35 access', 'Airport Blvd', 'North Loop neighborhood'] },
  'bull-creek': { area: 'Northwest', vibe: 'nature-adjacent upscale', near: 'Loop 360', features: ['Bull Creek Park & Greenbelt', 'Swimming holes', 'Loop 360 access', 'St. Stephen\'s School', 'Spicewood Springs'] },
  'downtown-austin': { area: 'Central', vibe: 'urban and energetic', near: 'everything', features: ['6th Street entertainment', 'Congress Avenue', 'Capitol building', 'Lady Bird Lake', 'Convention Center'] },
  'apache-shores': { area: 'West Austin', vibe: 'lakefront recreational', near: 'Lake Austin', features: ['Lake Austin access', 'Boat ramps', 'Scenic Hill Country', 'Mansfield Dam', 'Hippie Hollow'] },
  'spicewood': { area: 'Northwest', vibe: 'Hill Country suburban', near: 'Loop 360', features: ['Spicewood Springs Road', 'Canyon Creek', 'Great Hills Trail', 'Balcones District Park', 'Round Rock ISD'] },
  'circle-c-south': { area: 'Southwest Austin', vibe: 'master-planned family', near: 'MoPac', features: ['Circle C Metro Park', 'Slaughter Creek Trail', 'Lady Bird Johnson Wildflower Center', 'Grey Rock Golf Club', 'Circle C shopping'] },
  'tech-ridge': { area: 'North Austin', vibe: 'affordable suburban', near: 'I-35', features: ['Tech Ridge shopping', 'I-35 corridor', 'Samsung facility', 'Parmer Lane access', 'Stone Hill Town Center'] },
  'onion-creek': { area: 'South Austin', vibe: 'established suburban', near: 'I-35 South', features: ['Onion Creek Club', 'Onion Creek Greenbelt', 'I-35 access', 'McKinney Falls State Park', 'Golf course community'] },
  'university-hills': { area: 'East Austin', vibe: 'affordable and diverse', near: 'US-183', features: ['University Hills Golf Course', 'US-183 access', 'Affordable housing', 'Morris Williams Golf Course', 'Ed Bluestein Blvd'] },
  'st-edwards': { area: 'South Central', vibe: 'charming hillside', near: 'South Congress', features: ['St. Edward\'s University', 'South Congress proximity', 'Blunn Creek Greenbelt', 'Travis Heights adjacent', 'Big Stacy Park'] },
  'st-johns': { area: 'North Central', vibe: 'revitalizing and diverse', near: 'I-35', features: ['St. Johns neighborhood', 'I-35 access', 'Lamar Boulevard', 'North Austin YMCA', 'Airport Blvd corridor'] },
  'rosewood': { area: 'East Austin', vibe: 'historic and revitalizing', near: 'downtown', features: ['Rosewood Park', 'Boggy Creek Greenbelt', 'East 12th Street', 'Historic community', 'I-35 access'] },
  'upper-boggy-creek': { area: 'East Austin', vibe: 'walkable and artsy', near: 'Mueller', features: ['Boggy Creek Greenbelt', 'Mueller development', 'Airport Blvd', 'Patterson Park', 'East Austin restaurants'] },
  'windsor-road': { area: 'Central Austin', vibe: 'prestigious tree-lined', near: 'Tarrytown', features: ['Windsor Road corridor', 'Pease Park', 'Walsh Boat Landing', 'Tarrytown adjacent', 'Austin High School'] },
  'galindo': { area: 'South Austin', vibe: 'affordable and central', near: 'South Lamar', features: ['Galindo Park', 'South Lamar proximity', 'Oltorf Street', 'Stassney Lane', 'H-E-B Plus'] },
  'old-enfield': { area: 'Central Austin', vibe: 'historic and elegant', near: 'downtown', features: ['Pease Park', 'Shoal Creek Greenbelt', 'MoPac access', 'Historic mansions', 'Austin High School'] },
  'garrison-park': { area: 'South Austin', vibe: 'affordable starter homes', near: 'Ben White Blvd', features: ['Garrison Park', 'Ben White Blvd access', 'South Lamar proximity', 'I-35 access', 'Stassney Lane'] },
  'mcneil': { area: 'Northwest Austin', vibe: 'established suburban', near: 'McNeil Road', features: ['McNeil High School', 'Round Rock ISD', 'US-183 access', 'Brushy Creek Trail', 'Anderson Mill area'] },
  'georgian-acres': { area: 'North Austin', vibe: 'diverse and affordable', near: 'North Lamar', features: ['Georgian Acres Park', 'North Lamar corridor', 'US-183 access', 'Lamar Middle School', 'Rundberg area'] },
  'north-shoal-creek': { area: 'Central Austin', vibe: 'quiet established residential', near: 'Burnet Road', features: ['Shoal Creek Greenbelt', 'Burnet Road dining', 'Anderson Lane', 'Brentwood Park', 'MoPac access'] },
  'northwest-hills': { area: 'Northwest Austin', vibe: 'family-friendly established', near: 'Loop 360', features: ['Northwest Hills trails', 'Loop 360 access', 'Far West Blvd dining', 'Anderson Mill area', 'Excellent schools'] },
  'north-lamar': { area: 'North Austin', vibe: 'diverse and accessible', near: 'North Lamar Blvd', features: ['North Lamar Blvd corridor', 'Ethnic restaurants', 'I-35 access', 'Affordable housing', 'Bus transit'] },
  'montopolis': { area: 'Southeast Austin', vibe: 'revitalizing riverside', near: 'US-183', features: ['Montopolis Bridge', 'Colorado River access', 'Roy G. Guerrero Park', 'Montopolis Recreation Center', 'US-183 access'] },
  'pleasant-valley': { area: 'East Austin', vibe: 'transitional and growing', near: 'Riverside', features: ['Pleasant Valley Road', 'East Riverside Drive', 'Town Lake access', 'Oracle campus nearby', 'New development'] },
  'parker-lane': { area: 'South Austin', vibe: 'affordable central location', near: 'I-35', features: ['Parker Lane access', 'I-35 proximity', 'Ben White Blvd', 'Blunn Creek', 'South Austin dining'] },
  'bluff-springs': { area: 'Southeast Austin', vibe: 'affordable and growing', near: 'I-35 South', features: ['Bluff Springs Road', 'I-35 access', 'Onion Creek area', 'New development', 'William Cannon corridor'] },
  'gracy-woods': { area: 'North Austin', vibe: 'affordable suburban', near: 'US-183', features: ['Gracy Woods Park', 'US-183 access', 'Parmer Lane', 'Metric Blvd', 'North Austin retail'] },
};

// Templates for generating descriptions based on area characteristics
function generateDescription(slug, name, county, centroid) {
  const formattedName = formatName(name);
  const direction = getDirection(centroid);
  const distKm = getDistanceFromDowntown(centroid);
  const distMi = Math.round(distKm * 0.621371);
  
  const info = communityInfo[slug] || {};
  
  // County-specific context
  let countyContext = '';
  let schoolDistrict = '';
  let nearbyMajor = '';
  
  if (county === 'Travis') {
    if (direction === 'northwest' || direction === 'west') {
      schoolDistrict = 'Eanes ISD, Lake Travis ISD, or Round Rock ISD';
      nearbyMajor = 'Loop 360 (Capital of Texas Highway)';
    } else if (direction === 'north') {
      schoolDistrict = 'Austin ISD or Round Rock ISD';
      nearbyMajor = 'MoPac Expressway and I-35';
    } else if (direction === 'northeast' || direction === 'east') {
      schoolDistrict = 'Austin ISD, Del Valle ISD, or Manor ISD';
      nearbyMajor = 'US-183 and I-35';
    } else if (direction === 'south' || direction === 'southwest' || direction === 'southeast') {
      schoolDistrict = 'Austin ISD or Del Valle ISD';
      nearbyMajor = 'I-35 and MoPac Expressway';
    } else {
      schoolDistrict = 'Austin ISD';
      nearbyMajor = 'MoPac and I-35';
    }
  } else if (county === 'Williamson') {
    schoolDistrict = 'Round Rock ISD, Leander ISD, or Georgetown ISD';
    nearbyMajor = 'I-35, US-183, and SH-45';
  } else if (county === 'Hays') {
    schoolDistrict = 'Hays CISD, Dripping Springs ISD, or San Marcos CISD';
    nearbyMajor = 'I-35 and Ranch Road 12';
  }
  
  // Location description
  let locationPhrase = '';
  if (distMi <= 5) {
    locationPhrase = `just minutes from downtown Austin`;
  } else if (distMi <= 10) {
    locationPhrase = `about ${distMi} miles from downtown Austin`;
  } else if (distMi <= 20) {
    locationPhrase = `approximately ${distMi} miles from downtown Austin`;
  } else {
    locationPhrase = `in the outer reaches of the Austin metro area, about ${distMi} miles from downtown`;
  }
  
  const directionMap = {
    'north': 'northern',
    'south': 'southern',
    'east': 'eastern',
    'west': 'western',
    'northwest': 'northwest',
    'northeast': 'northeast',
    'southwest': 'southwest',
    'southeast': 'southeast',
    'central': 'central',
  };
  
  const directionAdj = directionMap[direction] || direction;

  // Vary descriptions based on name patterns and location
  const isRanch = /ranch|estate|acres|trail|ridge|valley|hill|creek|oak|meadow|spring|hollow|forest|wood/i.test(slug);
  const isUrban = distMi <= 6;
  const isSuburban = distMi > 6 && distMi <= 15;
  const isOuter = distMi > 15;
  
  // Pick description template based on characteristics
  let description, highlights, bestFor, nearbyLandmarks;
  
  if (info.features) {
    // We have specific knowledge about this community
    const area = info.area || `${directionAdj} Austin`;
    const vibe = info.vibe || 'welcoming';
    
    description = `${formattedName} is a ${vibe} neighborhood in ${area}, ${locationPhrase}. Located in ${county} County, the community offers a distinctive blend of Austin character and everyday convenience that draws a loyal following of residents who appreciate what this part of the city has to offer.

Homes in ${formattedName} range from well-maintained mid-century builds to newer construction, reflecting the area's ongoing evolution. The neighborhood benefits from its proximity to major corridors like ${nearbyMajor}, making commutes manageable while still maintaining a residential feel. Schools in the area are served by ${schoolDistrict}, and daily essentials are never far away.

Whether you're drawn to ${formattedName} for its location, its community character, or its relative value compared to nearby neighborhoods, there's a reason residents here tend to stay. The combination of access, affordability, and Austin's signature outdoor lifestyle makes this a neighborhood worth exploring. Contact Spyglass Realty to schedule a tour and discover what ${formattedName} has to offer.`;
    
    highlights = (info.features || []).slice(0, 5).map(f => 
      f.length > 60 ? f : `Convenient access to ${f}`
    );
    if (highlights.length < 5) {
      highlights.push(`${distMi <= 10 ? 'Short' : 'Easy'} commute to downtown Austin`);
    }
    
    bestFor = getBestFor(slug, distMi, isRanch, isUrban);
    nearbyLandmarks = (info.features || []).slice(0, 5);
  } else if (isUrban) {
    description = `${formattedName} is a ${directionAdj} Austin neighborhood ${locationPhrase}. Situated in ${county} County, this community benefits from exceptional proximity to Austin's employment centers, dining, and entertainment options while maintaining its own residential identity and neighborhood feel.

The housing stock in ${formattedName} reflects the area's evolution — you'll find a mix of charming older homes alongside newer construction and renovations that reflect growing demand for close-in Austin living. Streets are generally walkable, and residents enjoy easy access to major thoroughfares including ${nearbyMajor}. Area schools are served by ${schoolDistrict}.

Living in ${formattedName} means being connected to the best of what Austin has to offer. Whether it's a quick trip to nearby restaurants and shops or a weekend exploring Lady Bird Lake and the city's parks, this is a neighborhood that puts convenience and lifestyle front and center. Contact Spyglass Realty for current listings and a personalized tour of available homes.`;
    
    highlights = [
      `Central location ${locationPhrase}`,
      `Easy access to ${nearbyMajor}`,
      `Mix of vintage homes and modern construction`,
      `Walkable to nearby shops and restaurants`,
      `Served by ${schoolDistrict}`,
    ];
    bestFor = getBestFor(slug, distMi, isRanch, isUrban);
    nearbyLandmarks = getUrbanLandmarks(direction, slug);
  } else if (isSuburban) {
    description = `${formattedName} is an established community in ${directionAdj} ${county} County, ${locationPhrase}. This neighborhood appeals to buyers seeking the balance between suburban space and easy Austin access — a formula that's made this part of the metro area increasingly popular with families, professionals, and anyone tired of the compromise between commute time and quality of life.

Homes in ${formattedName} tend to offer more space for your dollar compared to closer-in Austin neighborhoods, with a mix of single-family homes on generous lots. The community feels settled and well-maintained, with mature landscaping and quiet residential streets. Schools in the area are served by ${schoolDistrict}, and shopping, dining, and recreational options continue to expand along the major corridors nearby.

${formattedName}'s location provides good connectivity to Austin's major employers and entertainment districts via ${nearbyMajor}. For outdoor enthusiasts, the area offers access to parks, trails, and the natural beauty of the Texas Hill Country. Spyglass Realty's agents know this neighborhood well — reach out for a market analysis or to schedule showings.`;
    
    highlights = [
      `More space for your dollar compared to central Austin`,
      `Family-friendly community with good schools via ${schoolDistrict}`,
      `Connected to Austin via ${nearbyMajor}`,
      `Quiet residential streets with mature landscaping`,
      `Growing shopping, dining, and entertainment options nearby`,
    ];
    bestFor = getBestFor(slug, distMi, isRanch, isUrban);
    nearbyLandmarks = getSuburbanLandmarks(direction, county, slug);
  } else {
    description = `${formattedName} is a community in ${county} County on the ${directionAdj} edge of the Austin metro area, ${locationPhrase}. For buyers seeking space, privacy, and a more relaxed pace of life while still maintaining access to Austin's amenities and employment, ${formattedName} represents an appealing option in a rapidly growing region.

Properties in ${formattedName} often feature larger lots and more square footage than you'll find closer to downtown, and the community benefits from the natural beauty of the surrounding Texas Hill Country landscape. The area is served by ${schoolDistrict}, and while you'll find essential services and shopping nearby, the appeal here is as much about what you're close to as what you're away from — namely, congestion and density.

As Austin's metro area continues to expand, communities like ${formattedName} are seeing steady appreciation and growing interest from buyers who recognize the value proposition of the outer ring. Access to ${nearbyMajor} keeps the commute manageable, and the quality of life is hard to beat. Contact Spyglass Realty to explore what's available in ${formattedName}.`;
    
    highlights = [
      `Larger lots and more space than central Austin`,
      `Texas Hill Country setting and natural beauty`,
      `More affordable price points with strong appreciation potential`,
      `Served by ${schoolDistrict}`,
      `Access to ${nearbyMajor} for commuting`,
    ];
    bestFor = getBestFor(slug, distMi, isRanch, isUrban);
    nearbyLandmarks = getOuterLandmarks(direction, county, slug);
  }
  
  return {
    slug,
    description,
    highlights,
    bestFor,
    nearbyLandmarks,
  };
}

function getBestFor(slug, distMi, isRanch, isUrban) {
  if (isUrban) {
    return ['Young professionals', 'Couples', 'Urban lifestyle seekers'];
  } else if (distMi <= 10) {
    if (isRanch) return ['Growing families', 'Move-up buyers', 'Outdoor enthusiasts'];
    return ['Families', 'Professionals', 'First-time buyers'];
  } else if (distMi <= 20) {
    return ['Families', 'Commuters', 'Space seekers', 'First-time buyers'];
  } else {
    return ['Families', 'Remote workers', 'Space seekers', 'Nature lovers'];
  }
}

function getUrbanLandmarks(direction, slug) {
  const base = ['Lady Bird Lake', 'Downtown Austin'];
  if (direction === 'east' || direction === 'northeast' || direction === 'southeast') {
    return [...base, 'East Austin restaurants', 'I-35 corridor', 'Mueller development'];
  }
  if (direction === 'north') {
    return [...base, 'The Domain', 'North Loop shops', 'UT campus'];
  }
  if (direction === 'south' || direction === 'southwest') {
    return [...base, 'South Congress Avenue', 'Barton Creek Greenbelt', 'South Lamar dining'];
  }
  if (direction === 'west' || direction === 'northwest') {
    return [...base, 'Loop 360', 'Barton Creek Greenbelt', 'Lake Austin'];
  }
  return [...base, 'Congress Avenue', 'UT campus', 'Zilker Park'];
}

function getSuburbanLandmarks(direction, county, slug) {
  if (county === 'Williamson') {
    return ['Round Rock Premium Outlets', 'Old Settlers Park', 'IH-35 corridor', 'Dell Diamond', 'Cedar Park Center'];
  }
  if (county === 'Hays') {
    return ['San Marcos outlets', 'Texas State University', 'Wimberley', 'I-35 corridor', 'Dripping Springs'];
  }
  if (direction === 'northwest' || direction === 'west') {
    return ['Lake Austin', 'Loop 360', 'Hill Country Galleria', 'Barton Creek Greenbelt', 'Bee Cave'];
  }
  if (direction === 'north' || direction === 'northeast') {
    return ['The Domain', 'Samsung facility', 'Parmer Lane corridor', 'Pflugerville Lake', 'I-35 corridor'];
  }
  if (direction === 'south' || direction === 'southeast') {
    return ['McKinney Falls State Park', 'Circuit of the Americas', 'Austin-Bergstrom Airport', 'I-35 corridor', 'Onion Creek'];
  }
  return ['MoPac Expressway', 'I-35 corridor', 'Austin retail centers', 'Area parks and trails', 'Austin dining scene'];
}

function getOuterLandmarks(direction, county, slug) {
  if (county === 'Williamson') {
    return ['Round Rock', 'Georgetown town square', 'Lake Georgetown', 'Inner Space Cavern', 'I-35 corridor'];
  }
  if (county === 'Hays') {
    return ['Wimberley', 'Dripping Springs', 'Hamilton Pool Preserve', 'Jacob\'s Well', 'Blanco River'];
  }
  if (direction === 'west' || direction === 'northwest') {
    return ['Lake Travis', 'Lakeway', 'Mansfield Dam', 'Pace Bend Park', 'Hill Country wineries'];
  }
  if (direction === 'south' || direction === 'southwest') {
    return ['Lady Bird Johnson Wildflower Center', 'McKinney Falls State Park', 'Buda', 'Kyle', 'San Marcos'];
  }
  return ['Austin metro amenities', 'Texas Hill Country', 'Area lakes and parks', 'I-35 corridor', 'Local dining and shopping'];
}

// Generate all descriptions
const descriptions = missing.map(c => {
  const centroid = getCentroid(c.slug);
  return generateDescription(c.slug, c.name, c.county, centroid);
});

// Output as TypeScript
let output = `// Generated community descriptions for Austin-area neighborhoods
// These supplement the hand-written descriptions in community-descriptions.ts

import { CommunityContent } from './community-descriptions';

export const generatedCommunityDescriptions: CommunityContent[] = [\n`;

descriptions.forEach((d, i) => {
  const desc = d.description.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  output += `  {\n`;
  output += `    slug: '${d.slug}',\n`;
  output += `    description: \`${desc}\`,\n`;
  output += `    highlights: [\n`;
  d.highlights.forEach(h => {
    output += `      '${h.replace(/'/g, "\\'")}',\n`;
  });
  output += `    ],\n`;
  output += `    bestFor: [${d.bestFor.map(b => `'${b}'`).join(', ')}],\n`;
  output += `    nearbyLandmarks: [\n`;
  d.nearbyLandmarks.forEach(l => {
    output += `      '${l.replace(/'/g, "\\'")}',\n`;
  });
  output += `    ],\n`;
  output += `  },\n`;
});

output += `];\n`;

fs.writeFileSync('src/data/generated-community-descriptions.ts', output);
console.log(`Generated ${descriptions.length} community descriptions`);

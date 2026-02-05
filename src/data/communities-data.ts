import { CommunityPolygon } from '@/types/community';

// Extended community type with county grouping
export interface CommunityData extends CommunityPolygon {
  county?: 'featured' | 'Travis' | 'Williamson' | 'Hays' | 'Other';
}

// Austin Featured Neighborhoods + Counties
// Polygon coordinates are approximate - replace with actual boundaries
export const communitiesData: CommunityData[] = [
  // ============ FEATURED NEIGHBORHOODS ============
  {
    id: 'barton-creek',
    name: 'Barton Creek',
    slug: 'barton-creek',
    county: 'featured',
    description: 'Prestigious gated community known for luxury estates and world-class golf.',
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    listingsCount: 45,
    medianPrice: 1850000,
    coordinates: [
      { lat: 30.2850, lng: -97.8500 },
      { lat: 30.2850, lng: -97.8100 },
      { lat: 30.2550, lng: -97.8100 },
      { lat: 30.2550, lng: -97.8500 },
    ],
    bounds: { north: 30.2850, south: 30.2550, east: -97.8100, west: -97.8500 }
  },
  {
    id: 'westlake-hills',
    name: 'Westlake Hills',
    slug: 'westlake-hills',
    county: 'featured',
    description: 'Affluent community with top-rated schools and stunning Hill Country views.',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    listingsCount: 38,
    medianPrice: 1650000,
    coordinates: [
      { lat: 30.3100, lng: -97.8100 },
      { lat: 30.3100, lng: -97.7700 },
      { lat: 30.2800, lng: -97.7700 },
      { lat: 30.2800, lng: -97.8100 },
    ],
    bounds: { north: 30.3100, south: 30.2800, east: -97.7700, west: -97.8100 }
  },
  {
    id: 'rollingwood',
    name: 'Rollingwood',
    slug: 'rollingwood',
    county: 'featured',
    description: 'Small, exclusive enclave with mature trees and proximity to downtown.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    listingsCount: 12,
    medianPrice: 1450000,
    coordinates: [
      { lat: 30.2750, lng: -97.7850 },
      { lat: 30.2750, lng: -97.7650 },
      { lat: 30.2600, lng: -97.7650 },
      { lat: 30.2600, lng: -97.7850 },
    ],
    bounds: { north: 30.2750, south: 30.2600, east: -97.7650, west: -97.7850 }
  },
  {
    id: 'tarrytown',
    name: 'Tarrytown',
    slug: 'tarrytown',
    county: 'featured',
    description: 'Historic neighborhood with tree-lined streets near Lake Austin.',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    listingsCount: 28,
    medianPrice: 1350000,
    coordinates: [
      { lat: 30.3050, lng: -97.7750 },
      { lat: 30.3050, lng: -97.7500 },
      { lat: 30.2850, lng: -97.7500 },
      { lat: 30.2850, lng: -97.7750 },
    ],
    bounds: { north: 30.3050, south: 30.2850, east: -97.7500, west: -97.7750 }
  },
  {
    id: 'zilker',
    name: 'Zilker',
    slug: 'zilker',
    county: 'featured',
    description: 'Vibrant area near Zilker Park and Barton Springs with eclectic homes.',
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    listingsCount: 22,
    medianPrice: 950000,
    coordinates: [
      { lat: 30.2750, lng: -97.7900 },
      { lat: 30.2750, lng: -97.7700 },
      { lat: 30.2600, lng: -97.7700 },
      { lat: 30.2600, lng: -97.7900 },
    ],
    bounds: { north: 30.2750, south: 30.2600, east: -97.7700, west: -97.7900 }
  },
  {
    id: 'travis-heights',
    name: 'Travis Heights',
    slug: 'travis-heights',
    county: 'featured',
    description: 'Charming South Austin neighborhood with historic bungalows and local flavor.',
    imageUrl: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800',
    listingsCount: 18,
    medianPrice: 875000,
    coordinates: [
      { lat: 30.2480, lng: -97.7500 },
      { lat: 30.2480, lng: -97.7350 },
      { lat: 30.2320, lng: -97.7350 },
      { lat: 30.2320, lng: -97.7500 },
    ],
    bounds: { north: 30.2480, south: 30.2320, east: -97.7350, west: -97.7500 }
  },
  {
    id: 'bouldin-creek',
    name: 'Bouldin Creek',
    slug: 'bouldin-creek',
    county: 'featured',
    description: 'Hip South Austin area known for food trailers and creative community.',
    imageUrl: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
    listingsCount: 15,
    medianPrice: 825000,
    coordinates: [
      { lat: 30.2520, lng: -97.7650 },
      { lat: 30.2520, lng: -97.7500 },
      { lat: 30.2380, lng: -97.7500 },
      { lat: 30.2380, lng: -97.7650 },
    ],
    bounds: { north: 30.2520, south: 30.2380, east: -97.7500, west: -97.7650 }
  },
  {
    id: 'barton-hills',
    name: 'Barton Hills',
    slug: 'barton-hills',
    county: 'featured',
    description: 'Nature-lovers paradise with greenbelt access and Barton Springs.',
    imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    listingsCount: 20,
    medianPrice: 950000,
    coordinates: [
      { lat: 30.2600, lng: -97.7900 },
      { lat: 30.2600, lng: -97.7700 },
      { lat: 30.2450, lng: -97.7700 },
      { lat: 30.2450, lng: -97.7900 },
    ],
    bounds: { north: 30.2600, south: 30.2450, east: -97.7700, west: -97.7900 }
  },

  // ============ TRAVIS COUNTY ============
  {
    id: 'downtown-austin',
    name: 'Downtown Austin',
    slug: 'downtown-austin',
    county: 'Travis',
    description: 'Urban living with high-rises, entertainment, and walkability.',
    listingsCount: 85,
    medianPrice: 650000,
    coordinates: [
      { lat: 30.2800, lng: -97.7550 },
      { lat: 30.2800, lng: -97.7300 },
      { lat: 30.2600, lng: -97.7300 },
      { lat: 30.2600, lng: -97.7550 },
    ],
    bounds: { north: 30.2800, south: 30.2600, east: -97.7300, west: -97.7550 }
  },
  {
    id: 'east-austin',
    name: 'East Austin',
    slug: 'east-austin',
    county: 'Travis',
    description: 'Trendy and diverse area with arts, music, and eclectic dining.',
    listingsCount: 120,
    medianPrice: 575000,
    coordinates: [
      { lat: 30.2700, lng: -97.7200 },
      { lat: 30.2700, lng: -97.6900 },
      { lat: 30.2400, lng: -97.6900 },
      { lat: 30.2400, lng: -97.7200 },
    ],
    bounds: { north: 30.2700, south: 30.2400, east: -97.6900, west: -97.7200 }
  },
  {
    id: 'south-austin',
    name: 'South Austin',
    slug: 'south-austin',
    county: 'Travis',
    description: 'Laid-back vibe with diverse neighborhoods and local businesses.',
    listingsCount: 200,
    medianPrice: 525000,
    coordinates: [
      { lat: 30.2300, lng: -97.8000 },
      { lat: 30.2300, lng: -97.7300 },
      { lat: 30.1800, lng: -97.7300 },
      { lat: 30.1800, lng: -97.8000 },
    ],
    bounds: { north: 30.2300, south: 30.1800, east: -97.7300, west: -97.8000 }
  },
  {
    id: 'north-austin',
    name: 'North Austin',
    slug: 'north-austin',
    county: 'Travis',
    description: 'Growing area with tech employers and family-friendly neighborhoods.',
    listingsCount: 180,
    medianPrice: 485000,
    coordinates: [
      { lat: 30.4200, lng: -97.7500 },
      { lat: 30.4200, lng: -97.6800 },
      { lat: 30.3500, lng: -97.6800 },
      { lat: 30.3500, lng: -97.7500 },
    ],
    bounds: { north: 30.4200, south: 30.3500, east: -97.6800, west: -97.7500 }
  },
  {
    id: 'bee-cave',
    name: 'Bee Cave',
    slug: 'bee-cave',
    county: 'Travis',
    description: 'Hill Country city with upscale shopping and Lake Travis access.',
    listingsCount: 65,
    medianPrice: 875000,
    coordinates: [
      { lat: 30.3200, lng: -97.9700 },
      { lat: 30.3200, lng: -97.9200 },
      { lat: 30.2800, lng: -97.9200 },
      { lat: 30.2800, lng: -97.9700 },
    ],
    bounds: { north: 30.3200, south: 30.2800, east: -97.9200, west: -97.9700 }
  },
  {
    id: 'lakeway',
    name: 'Lakeway',
    slug: 'lakeway',
    county: 'Travis',
    description: 'Resort-style living on Lake Travis with golf and water activities.',
    listingsCount: 95,
    medianPrice: 750000,
    coordinates: [
      { lat: 30.3700, lng: -97.9900 },
      { lat: 30.3700, lng: -97.9300 },
      { lat: 30.3200, lng: -97.9300 },
      { lat: 30.3200, lng: -97.9900 },
    ],
    bounds: { north: 30.3700, south: 30.3200, east: -97.9300, west: -97.9900 }
  },
  {
    id: 'pflugerville',
    name: 'Pflugerville',
    slug: 'pflugerville',
    county: 'Travis',
    description: 'Fast-growing suburb with excellent schools and family amenities.',
    listingsCount: 150,
    medianPrice: 425000,
    coordinates: [
      { lat: 30.4700, lng: -97.6500 },
      { lat: 30.4700, lng: -97.5800 },
      { lat: 30.4100, lng: -97.5800 },
      { lat: 30.4100, lng: -97.6500 },
    ],
    bounds: { north: 30.4700, south: 30.4100, east: -97.5800, west: -97.6500 }
  },
  {
    id: 'manor',
    name: 'Manor',
    slug: 'manor',
    county: 'Travis',
    description: 'Affordable community east of Austin with rapid development.',
    listingsCount: 110,
    medianPrice: 350000,
    coordinates: [
      { lat: 30.3700, lng: -97.5700 },
      { lat: 30.3700, lng: -97.5200 },
      { lat: 30.3200, lng: -97.5200 },
      { lat: 30.3200, lng: -97.5700 },
    ],
    bounds: { north: 30.3700, south: 30.3200, east: -97.5200, west: -97.5700 }
  },

  // ============ WILLIAMSON COUNTY ============
  {
    id: 'cedar-park',
    name: 'Cedar Park',
    slug: 'cedar-park',
    county: 'Williamson',
    description: 'Family-friendly suburb with great schools and HEB Center events.',
    listingsCount: 140,
    medianPrice: 525000,
    coordinates: [
      { lat: 30.5300, lng: -97.8500 },
      { lat: 30.5300, lng: -97.7800 },
      { lat: 30.4800, lng: -97.7800 },
      { lat: 30.4800, lng: -97.8500 },
    ],
    bounds: { north: 30.5300, south: 30.4800, east: -97.7800, west: -97.8500 }
  },
  {
    id: 'leander',
    name: 'Leander',
    slug: 'leander',
    county: 'Williamson',
    description: 'One of Texas fastest growing cities with new master-planned communities.',
    listingsCount: 180,
    medianPrice: 475000,
    coordinates: [
      { lat: 30.6000, lng: -97.8800 },
      { lat: 30.6000, lng: -97.8000 },
      { lat: 30.5300, lng: -97.8000 },
      { lat: 30.5300, lng: -97.8800 },
    ],
    bounds: { north: 30.6000, south: 30.5300, east: -97.8000, west: -97.8800 }
  },
  {
    id: 'round-rock',
    name: 'Round Rock',
    slug: 'round-rock',
    county: 'Williamson',
    description: 'Major suburb known for Dell headquarters and excellent amenities.',
    listingsCount: 220,
    medianPrice: 485000,
    coordinates: [
      { lat: 30.5400, lng: -97.7200 },
      { lat: 30.5400, lng: -97.6400 },
      { lat: 30.4800, lng: -97.6400 },
      { lat: 30.4800, lng: -97.7200 },
    ],
    bounds: { north: 30.5400, south: 30.4800, east: -97.6400, west: -97.7200 }
  },
  {
    id: 'georgetown',
    name: 'Georgetown',
    slug: 'georgetown',
    county: 'Williamson',
    description: 'Charming downtown square with Sun City 55+ community.',
    listingsCount: 175,
    medianPrice: 450000,
    coordinates: [
      { lat: 30.6600, lng: -97.7000 },
      { lat: 30.6600, lng: -97.6200 },
      { lat: 30.6000, lng: -97.6200 },
      { lat: 30.6000, lng: -97.7000 },
    ],
    bounds: { north: 30.6600, south: 30.6000, east: -97.6200, west: -97.7000 }
  },
  {
    id: 'liberty-hill',
    name: 'Liberty Hill',
    slug: 'liberty-hill',
    county: 'Williamson',
    description: 'Hill Country community with small-town feel and new developments.',
    listingsCount: 85,
    medianPrice: 425000,
    coordinates: [
      { lat: 30.7000, lng: -97.9500 },
      { lat: 30.7000, lng: -97.8800 },
      { lat: 30.6500, lng: -97.8800 },
      { lat: 30.6500, lng: -97.9500 },
    ],
    bounds: { north: 30.7000, south: 30.6500, east: -97.8800, west: -97.9500 }
  },

  // ============ HAYS COUNTY ============
  {
    id: 'dripping-springs',
    name: 'Dripping Springs',
    slug: 'dripping-springs',
    county: 'Hays',
    description: 'Hill Country living with wineries, breweries, and natural beauty.',
    listingsCount: 75,
    medianPrice: 650000,
    coordinates: [
      { lat: 30.2200, lng: -98.1200 },
      { lat: 30.2200, lng: -98.0500 },
      { lat: 30.1600, lng: -98.0500 },
      { lat: 30.1600, lng: -98.1200 },
    ],
    bounds: { north: 30.2200, south: 30.1600, east: -98.0500, west: -98.1200 }
  },
  {
    id: 'buda',
    name: 'Buda',
    slug: 'buda',
    county: 'Hays',
    description: 'Small-town charm south of Austin with growing community.',
    listingsCount: 95,
    medianPrice: 425000,
    coordinates: [
      { lat: 30.1100, lng: -97.8700 },
      { lat: 30.1100, lng: -97.8100 },
      { lat: 30.0600, lng: -97.8100 },
      { lat: 30.0600, lng: -97.8700 },
    ],
    bounds: { north: 30.1100, south: 30.0600, east: -97.8100, west: -97.8700 }
  },
  {
    id: 'kyle',
    name: 'Kyle',
    slug: 'kyle',
    county: 'Hays',
    description: 'Fast-growing city on I-35 with affordable homes.',
    listingsCount: 130,
    medianPrice: 375000,
    coordinates: [
      { lat: 30.0300, lng: -97.9000 },
      { lat: 30.0300, lng: -97.8300 },
      { lat: 29.9700, lng: -97.8300 },
      { lat: 29.9700, lng: -97.9000 },
    ],
    bounds: { north: 30.0300, south: 29.9700, east: -97.8300, west: -97.9000 }
  },
  {
    id: 'san-marcos',
    name: 'San Marcos',
    slug: 'san-marcos',
    county: 'Hays',
    description: 'College town with Texas State University and outlet shopping.',
    listingsCount: 85,
    medianPrice: 350000,
    coordinates: [
      { lat: 29.9200, lng: -97.9700 },
      { lat: 29.9200, lng: -97.9000 },
      { lat: 29.8600, lng: -97.9000 },
      { lat: 29.8600, lng: -97.9700 },
    ],
    bounds: { north: 29.9200, south: 29.8600, east: -97.9000, west: -97.9700 }
  },
];

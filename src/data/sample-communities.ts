// Sample community polygons for development
// Replace with imported data from Google Sheets

import { CommunityPolygon } from '@/types/community';

export const sampleCommunities: CommunityPolygon[] = [
  {
    id: 'bouldin-creek',
    name: 'Bouldin Creek',
    slug: 'bouldin-creek',
    coordinates: [
      { lat: 30.2520, lng: -97.7650 },
      { lat: 30.2520, lng: -97.7500 },
      { lat: 30.2380, lng: -97.7500 },
      { lat: 30.2380, lng: -97.7650 },
    ],
    geoJson: {
      type: 'Polygon',
      coordinates: [[
        [-97.7650, 30.2520],
        [-97.7500, 30.2520],
        [-97.7500, 30.2380],
        [-97.7650, 30.2380],
        [-97.7650, 30.2520]
      ]]
    },
    bounds: {
      north: 30.2520,
      south: 30.2380,
      east: -97.7500,
      west: -97.7650
    }
  },
  {
    id: 'travis-heights',
    name: 'Travis Heights',
    slug: 'travis-heights',
    coordinates: [
      { lat: 30.2480, lng: -97.7500 },
      { lat: 30.2480, lng: -97.7350 },
      { lat: 30.2320, lng: -97.7350 },
      { lat: 30.2320, lng: -97.7500 },
    ],
    geoJson: {
      type: 'Polygon',
      coordinates: [[
        [-97.7500, 30.2480],
        [-97.7350, 30.2480],
        [-97.7350, 30.2320],
        [-97.7500, 30.2320],
        [-97.7500, 30.2480]
      ]]
    },
    bounds: {
      north: 30.2480,
      south: 30.2320,
      east: -97.7350,
      west: -97.7500
    }
  },
  {
    id: 'zilker',
    name: 'Zilker',
    slug: 'zilker',
    coordinates: [
      { lat: 30.2750, lng: -97.7900 },
      { lat: 30.2750, lng: -97.7700 },
      { lat: 30.2600, lng: -97.7700 },
      { lat: 30.2600, lng: -97.7900 },
    ],
    geoJson: {
      type: 'Polygon',
      coordinates: [[
        [-97.7900, 30.2750],
        [-97.7700, 30.2750],
        [-97.7700, 30.2600],
        [-97.7900, 30.2600],
        [-97.7900, 30.2750]
      ]]
    },
    bounds: {
      north: 30.2750,
      south: 30.2600,
      east: -97.7700,
      west: -97.7900
    }
  },
  {
    id: 'barton-hills',
    name: 'Barton Hills',
    slug: 'barton-hills',
    coordinates: [
      { lat: 30.2600, lng: -97.7900 },
      { lat: 30.2600, lng: -97.7700 },
      { lat: 30.2450, lng: -97.7700 },
      { lat: 30.2450, lng: -97.7900 },
    ],
    geoJson: {
      type: 'Polygon',
      coordinates: [[
        [-97.7900, 30.2600],
        [-97.7700, 30.2600],
        [-97.7700, 30.2450],
        [-97.7900, 30.2450],
        [-97.7900, 30.2600]
      ]]
    },
    bounds: {
      north: 30.2600,
      south: 30.2450,
      east: -97.7700,
      west: -97.7900
    }
  }
];

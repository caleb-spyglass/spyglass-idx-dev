// Austin Zip Codes Data - Focused on specific zip codes for the interactive zip code finder

export interface ZipCodeData {
  zipCode: string;
  name: string; // Neighborhood/area name
  slug: string;
  county: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  polygon: Array<{ lat: number; lng: number }>;
  description: string;
  neighborhoods: string[];
  // Market data placeholders - these would come from your Pulse app or MLS API
  marketData?: {
    activeListings: number;
    medianPrice: number;
    pricePerSqft: number;
    avgDaysOnMarket: number;
    marketTemperature: 'hot' | 'warm' | 'cool' | 'cold';
  };
}

// Initial zip codes for demonstration - 78704 and 78705
export const AUSTIN_ZIP_CODES: ZipCodeData[] = [
  {
    zipCode: '78704',
    name: 'South Austin - SoCo & Barton Hills',
    slug: '78704',
    county: 'Travis',
    coordinates: {
      lat: 30.2379,
      lng: -97.7722,
    },
    polygon: [
      // Approximate boundary for 78704 - you'd want to replace with actual polygon data
      { lat: 30.2520, lng: -97.7900 },
      { lat: 30.2520, lng: -97.7500 },
      { lat: 30.2200, lng: -97.7500 },
      { lat: 30.2200, lng: -97.7900 },
    ],
    description: 'The 78704 zip code encompasses some of Austin\'s most vibrant and sought-after neighborhoods, including the trendy South Austin area known as SoCo (South of the Colorado). This area is famous for its eclectic mix of music venues, local eateries, and the iconic "Keep Austin Weird" culture.',
    neighborhoods: [
      'Barton Hills',
      'Travis Heights', 
      'South Lamar',
      'Zilker',
      'South Austin',
    ],
    marketData: {
      activeListings: 45,
      medianPrice: 895000,
      pricePerSqft: 425,
      avgDaysOnMarket: 28,
      marketTemperature: 'warm',
    },
  },
  {
    zipCode: '78705',
    name: 'Central Austin - West Campus & Clarksville',
    slug: '78705',
    county: 'Travis',
    coordinates: {
      lat: 30.2941,
      lng: -97.7491,
    },
    polygon: [
      // Approximate boundary for 78705 - you'd want to replace with actual polygon data
      { lat: 30.3100, lng: -97.7700 },
      { lat: 30.3100, lng: -97.7300 },
      { lat: 30.2800, lng: -97.7300 },
      { lat: 30.2800, lng: -97.7700 },
    ],
    description: 'The 78705 zip code covers key central Austin areas including West Campus near UT, the historic Clarksville neighborhood, and portions of downtown. This area combines university energy with established residential communities and easy access to Austin\'s core amenities.',
    neighborhoods: [
      'West Campus',
      'Clarksville', 
      'Downtown Austin',
      'Old West Austin',
      'Pease Park',
    ],
    marketData: {
      activeListings: 32,
      medianPrice: 1150000,
      pricePerSqft: 520,
      avgDaysOnMarket: 22,
      marketTemperature: 'hot',
    },
  },
];

export function getZipCodeBySlug(slug: string): ZipCodeData | null {
  return AUSTIN_ZIP_CODES.find(zip => zip.slug === slug) || null;
}

export function getAllZipCodes(): ZipCodeData[] {
  return AUSTIN_ZIP_CODES;
}

// Utility function to get market temperature color
export function getMarketTempColor(temperature: string): string {
  switch (temperature) {
    case 'hot':
      return 'text-red-600';
    case 'warm':
      return 'text-orange-500';  
    case 'cool':
      return 'text-blue-500';
    case 'cold':
      return 'text-blue-800';
    default:
      return 'text-gray-600';
  }
}

// Utility function to get market temperature background
export function getMarketTempBg(temperature: string): string {
  switch (temperature) {
    case 'hot':
      return 'bg-red-50 border-red-200';
    case 'warm':
      return 'bg-orange-50 border-orange-200';
    case 'cool':
      return 'bg-blue-50 border-blue-200';
    case 'cold':
      return 'bg-blue-50 border-blue-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
}
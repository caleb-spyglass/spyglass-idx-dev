export interface Listing {
  id: string;
  mlsNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    full: string;
    neighborhood?: string;
  };
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize?: number;
  yearBuilt?: number;
  propertyType: 'Single Family' | 'Condo' | 'Townhouse' | 'Multi-Family' | 'Land';
  status: 'Active' | 'Pending' | 'Sold' | 'Coming Soon';
  daysOnMarket: number;
  photos: string[];
  description?: string;
  features?: string[];
  virtualTour?: string;
  pricePerSqft?: number;
  garage?: number;
  stories?: number;
  pool?: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  listDate: string;
  updatedAt: string;
}

export interface SearchFilters {
  page?: number;
  pageSize?: number;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  maxBeds?: number;
  minBaths?: number;
  maxBaths?: number;
  minSqft?: number;
  maxSqft?: number;
  propertyTypes?: string[];
  status?: string[];
  type?: 'Sale' | 'Lease';  // Sale = for sale, Lease = rental
  city?: string;
  area?: string;
  zip?: string;
  neighborhood?: string;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  polygon?: Array<{ lat: number; lng: number } | [number, number]>;
  sort?: 'price-asc' | 'price-desc' | 'date-desc' | 'sqft-desc';
}

export interface SearchResults {
  listings: Listing[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

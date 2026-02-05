// Coordinate can be either {lat, lng} object or [lat, lng] tuple
export type Coordinate = { lat: number; lng: number } | [number, number];

export interface CommunityPolygon {
  id: string;
  name: string;
  slug?: string;
  coordinates: Coordinate[];
  center?: { lat: number; lng: number };
  // GeoJSON format for map libraries
  geoJson?: GeoJSON.Polygon;
  // Bounding box for quick filtering
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  // Optional metadata
  description?: string;
  imageUrl?: string;
  listingsCount?: number;
  medianPrice?: number;
}

export interface CommunityPage {
  community: CommunityPolygon;
  stats: {
    activeListings: number;
    medianPrice: number;
    avgPricePerSqft: number;
    avgDaysOnMarket: number;
  };
  schools?: Array<{
    name: string;
    type: 'Elementary' | 'Middle' | 'High';
    rating?: number;
  }>;
  demographics?: {
    population?: number;
    medianIncome?: number;
    medianAge?: number;
  };
}

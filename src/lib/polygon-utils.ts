import { CommunityPolygon } from '@/types/community';

/**
 * Parse polygon coordinates from spreadsheet format
 * Format: "lat,lng;lat,lng;lat,lng..."
 */
export function parsePolygonString(coordString: string): Array<{ lat: number; lng: number }> {
  if (!coordString || typeof coordString !== 'string') {
    return [];
  }

  const coordinates: Array<{ lat: number; lng: number }> = [];
  
  // Split by semicolon to get coordinate pairs
  const pairs = coordString.split(';').filter(p => p.trim());
  
  for (const pair of pairs) {
    const [latStr, lngStr] = pair.split(',').map(s => s.trim());
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      coordinates.push({ lat, lng });
    }
  }

  return coordinates;
}

/**
 * Convert coordinates to GeoJSON Polygon format
 * Note: GeoJSON uses [lng, lat] order (opposite of Google Maps)
 */
export function toGeoJsonPolygon(coords: Array<{ lat: number; lng: number }>): GeoJSON.Polygon {
  // GeoJSON requires the polygon to be closed (first point = last point)
  const ring = coords.map(c => [c.lng, c.lat] as [number, number]);
  
  // Close the ring if not already closed
  if (ring.length > 0) {
    const first = ring[0];
    const last = ring[ring.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      ring.push([...first] as [number, number]);
    }
  }

  return {
    type: 'Polygon',
    coordinates: [ring]
  };
}

/**
 * Convert coordinates to Repliers API format
 * Repliers expects: [[lng, lat], [lng, lat], ...] (array of [lng, lat] pairs)
 * Input from spreadsheet is: lat,lng format
 */
export function toRepliersPolygon(coords: Array<{ lat: number; lng: number }>): Array<[number, number]> {
  const ring = coords.map(c => [c.lng, c.lat] as [number, number]);
  
  // Close the ring if not already closed
  if (ring.length > 0) {
    const first = ring[0];
    const last = ring[ring.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      ring.push([...first] as [number, number]);
    }
  }
  
  return ring;
}

/**
 * Convert Repliers polygon format back to our internal format
 * Repliers uses [lng, lat], we use { lat, lng }
 */
export function fromRepliersPolygon(coords: Array<[number, number]>): Array<{ lat: number; lng: number }> {
  return coords.map(([lng, lat]) => ({ lat, lng }));
}

/**
 * Calculate bounding box from coordinates
 */
export function calculateBounds(coords: Array<{ lat: number; lng: number }>) {
  if (coords.length === 0) {
    return { north: 0, south: 0, east: 0, west: 0 };
  }

  let north = -Infinity;
  let south = Infinity;
  let east = -Infinity;
  let west = Infinity;

  for (const coord of coords) {
    north = Math.max(north, coord.lat);
    south = Math.min(south, coord.lat);
    east = Math.max(east, coord.lng);
    west = Math.min(west, coord.lng);
  }

  return { north, south, east, west };
}

/**
 * Create URL-friendly slug from community name
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Check if a point is inside a polygon using ray casting algorithm
 */
export function isPointInPolygon(
  point: { lat: number; lng: number },
  polygon: Array<{ lat: number; lng: number }>
): boolean {
  if (polygon.length < 3) return false;

  let inside = false;
  const x = point.lng;
  const y = point.lat;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;

    if (
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    ) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Parse CSV row into CommunityPolygon
 */
export function parseCommunityRow(name: string, coordString: string): CommunityPolygon | null {
  if (!name || !coordString) return null;

  const coordinates = parsePolygonString(coordString);
  if (coordinates.length < 3) {
    console.warn(`Invalid polygon for ${name}: less than 3 coordinates`);
    return null;
  }

  const slug = slugify(name);
  const bounds = calculateBounds(coordinates);
  const geoJson = toGeoJsonPolygon(coordinates);

  return {
    id: slug,
    name: name.trim(),
    slug,
    coordinates,
    geoJson,
    bounds
  };
}

/**
 * Parse full CSV content into CommunityPolygon array
 */
export function parsePolygonCsv(csvContent: string): CommunityPolygon[] {
  const lines = csvContent.split('\n');
  const communities: CommunityPolygon[] = [];

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // CSV parsing - handle quoted fields
    const match = line.match(/^"?([^",]+)"?,(.+)$/);
    if (match) {
      const [, name, coords] = match;
      const community = parseCommunityRow(name, coords);
      if (community) {
        communities.push(community);
      }
    }
  }

  return communities;
}

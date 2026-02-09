import { NextRequest, NextResponse } from 'next/server';
import { SearchFilters } from '@/types/listing';
import { searchListings } from '@/lib/repliers-api';
import { createRequestLogger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const log = createRequestLogger('GET', '/api/listings');
  try {
    const { searchParams } = new URL(request.url);
    
    const zip = searchParams.get('zip') || undefined;
    const city = searchParams.get('city') || undefined;
    const polygonStr = searchParams.get('polygon');
    
    // Parse polygon from query string (format: "lat,lng;lat,lng;...")
    let polygon: Array<{lat: number; lng: number}> | undefined;
    if (polygonStr) {
      polygon = polygonStr.split(';').map(pair => {
        const [lat, lng] = pair.split(',').map(Number);
        return { lat, lng };
      }).filter(p => !isNaN(p.lat) && !isNaN(p.lng));
      
      if (polygon.length < 3) polygon = undefined;
    }
    
    const filters: SearchFilters = {
      page: parseInt(searchParams.get('page') || '1'),
      pageSize: parseInt(searchParams.get('pageSize') || '24'),
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
      minBeds: searchParams.get('minBeds') ? parseInt(searchParams.get('minBeds')!) : undefined,
      minBaths: searchParams.get('minBaths') ? parseInt(searchParams.get('minBaths')!) : undefined,
      city,
      zip,
      polygon,
      // Only default to Travis if no location filter provided
      area: searchParams.get('area') || (zip || city || polygon ? undefined : 'Travis'),
      sort: (searchParams.get('sort') as SearchFilters['sort']) || 'date-desc',
    };

    log.info('Listings search started', { city: filters.city, zip: filters.zip, area: filters.area, page: filters.page });
    const results = await searchListings(filters);
    log.done('Listings search completed', { resultCount: results.listings.length, total: results.total });
    
    return NextResponse.json(results, { headers: { 'X-Request-Id': log.requestId } });
  } catch (error) {
    log.error('Listings search failed', { error: String(error) });
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500, headers: { 'X-Request-Id': log.requestId } }
    );
  }
}

export async function POST(request: NextRequest) {
  const log = createRequestLogger('POST', '/api/listings');
  try {
    const filters: SearchFilters = await request.json();
    
    // Default to Austin area if no location specified
    if (!filters.area && !filters.city && !filters.zip && !filters.bounds && !filters.polygon) {
      filters.area = 'Travis';
    }
    
    log.info('Listings POST search started', { hasPolygon: !!filters.polygon, area: filters.area });
    const results = await searchListings(filters);
    log.done('Listings POST search completed', { resultCount: results.listings.length, total: results.total });
    
    return NextResponse.json(results, { headers: { 'X-Request-Id': log.requestId } });
  } catch (error) {
    log.error('Listings POST search failed', { error: String(error) });
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500, headers: { 'X-Request-Id': log.requestId } }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getZipCodeMLSListings } from '@/lib/mls-communities-api';
import { searchListings } from '@/lib/repliers-api';
import { getZipCodeBySlug } from '@/data/zip-codes-data';

interface RouteContext {
  params: Promise<{ zipcode: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { zipcode } = await context.params;
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '24');
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined;
    const minBeds = searchParams.get('minBeds') ? parseInt(searchParams.get('minBeds')!) : undefined;
    const minBaths = searchParams.get('minBaths') ? parseInt(searchParams.get('minBaths')!) : undefined;
    const sort = (searchParams.get('sort') as any) || 'date-desc';
    const usePolygon = searchParams.get('polygon') === 'true';

    // Get zip code data (includes polygon if available)
    const zipData = getZipCodeBySlug(zipcode);
    
    if (!zipData) {
      return NextResponse.json(
        { error: 'Zip code not found' },
        { status: 404 }
      );
    }

    const filters = {
      page,
      pageSize,
      minPrice,
      maxPrice,
      minBeds,
      minBaths,
      sort,
    };

    let results;
    let source = 'standard';

    // Use polygon-based search if polygon data is available and requested
    if (usePolygon && zipData.polygon && zipData.polygon.length > 0) {
      try {
        // Convert from {lat, lng} to [lng, lat] for Repliers API
        const repliersPolygon = zipData.polygon.map(coord => [coord.lng, coord.lat]) as Array<[number, number]>;
        results = await getZipCodeMLSListings(zipData.zipCode, repliersPolygon, filters);
        source = 'polygon-enhanced';
      } catch (polygonError) {
        console.warn(`[Zip Code API] Polygon search failed for ${zipcode}, falling back to standard:`, polygonError);
        // Fall back to standard zip code search
        results = await searchListings({
          ...filters,
          zip: zipData.zipCode,
        });
        source = 'standard-fallback';
      }
    } else {
      // Standard zip code search
      results = await searchListings({
        ...filters,
        zip: zipData.zipCode,
      });
    }

    // Calculate enhanced stats
    const { listings, total } = results;
    const prices = listings.map(l => l.price).filter(p => p > 0).sort((a, b) => a - b);
    const sqftListings = listings.filter(l => l.sqft > 0);

    const stats = {
      activeListings: total,
      medianPrice: prices.length > 0 ? prices[Math.floor(prices.length / 2)] : 0,
      avgPrice: prices.length > 0 ? Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length) : 0,
      minPrice: prices.length > 0 ? prices[0] : 0,
      maxPrice: prices.length > 0 ? prices[prices.length - 1] : 0,
      pricePerSqft: sqftListings.length > 0 
        ? Math.round(sqftListings.reduce((sum, l) => sum + (l.price / l.sqft), 0) / sqftListings.length)
        : 0,
      avgDaysOnMarket: listings.length > 0
        ? Math.round(listings.reduce((sum, l) => sum + (l.daysOnMarket || 0), 0) / listings.length)
        : 0,
      avgSqft: sqftListings.length > 0
        ? Math.round(sqftListings.reduce((sum, l) => sum + l.sqft, 0) / sqftListings.length)
        : 0,
      propertyTypes: {
        singleFamily: listings.filter(l => l.propertyType === 'Single Family').length,
        condo: listings.filter(l => l.propertyType === 'Condo').length,
        townhouse: listings.filter(l => l.propertyType === 'Townhouse').length,
        multiFamily: listings.filter(l => l.propertyType === 'Multi-Family').length,
        land: listings.filter(l => l.propertyType === 'Land').length,
      },
      priceTiers: {
        under500k: listings.filter(l => l.price < 500000).length,
        range500kTo750k: listings.filter(l => l.price >= 500000 && l.price < 750000).length,
        range750kTo1m: listings.filter(l => l.price >= 750000 && l.price < 1000000).length,
        over1m: listings.filter(l => l.price >= 1000000).length,
      },
    };

    return NextResponse.json({
      zipCode: {
        code: zipData.zipCode,
        name: zipData.name,
        slug: zipData.slug,
        county: zipData.county,
        hasPolygon: !!(zipData.polygon && zipData.polygon.length > 0),
      },
      listings,
      stats,
      total,
      page,
      pageSize,
      source,
      filters: {
        ...filters,
        usePolygon,
      },
    });

  } catch (error) {
    console.error('Zip code listings API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch zip code listings' },
      { status: 500 }
    );
  }
}
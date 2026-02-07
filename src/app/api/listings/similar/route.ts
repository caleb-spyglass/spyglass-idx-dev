import { NextRequest, NextResponse } from 'next/server';
import { searchListings } from '@/lib/repliers-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const mlsNumber = searchParams.get('mlsNumber') || '';
    const price = parseInt(searchParams.get('price') || '0');
    const city = searchParams.get('city') || undefined;

    if (!price || !mlsNumber) {
      return NextResponse.json(
        { error: 'Missing required params: mlsNumber, price' },
        { status: 400 }
      );
    }

    const minPrice = Math.round(price * 0.75);
    const maxPrice = Math.round(price * 1.25);

    const results = await searchListings({
      minPrice,
      maxPrice,
      city,
      pageSize: 8,
      page: 1,
      sort: 'date-desc',
    });

    // Filter out the current listing
    const filtered = results.listings.filter(
      (l) => l.mlsNumber !== mlsNumber
    );

    return NextResponse.json({
      ...results,
      listings: filtered.slice(0, 6),
      total: filtered.length,
    });
  } catch (error) {
    console.error('Similar listings API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch similar listings', details: String(error) },
      { status: 500 }
    );
  }
}

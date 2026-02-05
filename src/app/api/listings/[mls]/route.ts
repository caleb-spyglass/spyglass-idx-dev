import { NextRequest, NextResponse } from 'next/server';
import { getListing } from '@/lib/repliers-api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mls: string }> }
) {
  try {
    const { mls } = await params;
    
    if (!mls) {
      return NextResponse.json(
        { error: 'MLS number is required' },
        { status: 400 }
      );
    }

    const listing = await getListing(mls);

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
      { status: 500 }
    );
  }
}

import { NextRequest } from 'next/server';
import { getZipCodeBySlug } from '@/data/zip-codes-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ zipcode: string }> }
) {
  try {
    const { zipcode } = await params;
    
    // Get zip code data
    const zipCodeData = getZipCodeBySlug(zipcode);
    
    if (!zipCodeData) {
      return Response.json(
        { error: 'Zip code not found' },
        { status: 404 }
      );
    }

    // Mock data for now - in production, this would fetch from Pulse app or MLS API
    const stats = {
      zipCode: zipCodeData.zipCode,
      activeListings: zipCodeData.marketData?.activeListings || 0,
      medianPrice: zipCodeData.marketData?.medianPrice || 0,
      avgPrice: Math.round((zipCodeData.marketData?.medianPrice || 0) * 1.15),
      pricePerSqft: zipCodeData.marketData?.pricePerSqft || 0,
      avgDaysOnMarket: zipCodeData.marketData?.avgDaysOnMarket || 0,
      marketTemperature: zipCodeData.marketData?.marketTemperature || 'cool',
      
      // Additional mock data that could come from Pulse app
      minPrice: Math.round((zipCodeData.marketData?.medianPrice || 500000) * 0.6),
      maxPrice: Math.round((zipCodeData.marketData?.medianPrice || 500000) * 2.1),
      singleFamilyCount: Math.round((zipCodeData.marketData?.activeListings || 0) * 0.65),
      condoCount: Math.round((zipCodeData.marketData?.activeListings || 0) * 0.25),
      townhouseCount: Math.round((zipCodeData.marketData?.activeListings || 0) * 0.1),
      avgBedrooms: 3.2,
      avgBathrooms: 2.5,
      avgSqft: Math.round((zipCodeData.marketData?.medianPrice || 500000) / (zipCodeData.marketData?.pricePerSqft || 300)),
      
      // Price distribution
      under500k: Math.round((zipCodeData.marketData?.activeListings || 0) * 0.2),
      range500kTo750k: Math.round((zipCodeData.marketData?.activeListings || 0) * 0.3),
      range750kTo1m: Math.round((zipCodeData.marketData?.activeListings || 0) * 0.3),
      over1m: Math.round((zipCodeData.marketData?.activeListings || 0) * 0.2),
    };

    return Response.json({
      success: true,
      zipCode: zipCodeData.zipCode,
      stats,
      lastUpdated: new Date().toISOString(),
      // This could indicate data source in the future
      dataSource: 'mock', // In production: 'pulse-app' or 'mls-api'
    });

  } catch (error) {
    console.error('Error fetching zip code stats:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// This endpoint could be called by your Pulse app to update real-time data
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ zipcode: string }> }
) {
  try {
    const { zipcode } = await params;
    const body = await request.json();
    
    // Validate the data format
    const requiredFields = ['activeListings', 'medianPrice', 'pricePerSqft', 'avgDaysOnMarket'];
    const missingFields = requiredFields.filter(field => !(field in body));
    
    if (missingFields.length > 0) {
      return Response.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // In production, you would:
    // 1. Validate the API key/authentication 
    // 2. Update your database with the new market data
    // 3. Possibly trigger cache invalidation for the zip code pages
    
    return Response.json({
      success: true,
      message: `Market data updated for zip code ${zipcode}`,
      updated: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error updating zip code stats:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
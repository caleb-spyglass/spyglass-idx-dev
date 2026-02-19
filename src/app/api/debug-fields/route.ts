import { NextRequest, NextResponse } from 'next/server';
import { searchListings } from '@/lib/repliers-api';

/**
 * Debug endpoint to show ALL available fields in Repliers API response
 * GET /api/debug-fields
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing Repliers API for all available fields...');
    
    // Get just 1 listing to examine structure
    const results = await searchListings({
      pageSize: 1,
      area: 'Travis'
    });
    
    if (results.listings.length === 0) {
      return NextResponse.json({
        error: 'No listings found',
        total: results.total
      });
    }
    
    const listing = results.listings[0];
    
    // Get raw data from Repliers before transformation
    // We need to modify repliers-api.ts to expose raw data for debugging
    
    const debugInfo = {
      mlsNumber: listing.mlsNumber,
      address: listing.address.full,
      price: listing.price,
      availableFields: {
        topLevel: Object.keys(listing).sort(),
        // We need to get raw details object from Repliers response
        message: 'Raw details object not accessible in current implementation'
      },
      schoolSearch: {
        status: 'Testing for school fields...',
        commonSchoolFields: [
          'elementarySchool', 'middleSchool', 'highSchool',
          'schoolDistrict', 'school1', 'school2', 'school3',
          'ElementarySchool', 'MiddleSchool', 'HighSchool',
          'SchoolDistrict', 'School1', 'School2', 'School3'
        ]
      }
    };
    
    return NextResponse.json(debugInfo, { 
      headers: { 'Content-Type': 'application/json' } 
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Debug test failed',
        message: String(error),
        suggestion: 'Check REPLIERS_API_KEY environment variable'
      },
      { status: 500 }
    );
  }
}
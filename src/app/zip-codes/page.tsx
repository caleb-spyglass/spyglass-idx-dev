import React from 'react';
import { Header } from '@/components/ui/Header';
import { getAllZipCodes } from '@/data/zip-codes-data';
import ZipCodeMap from '@/components/zip-codes/ZipCodeMap';
import ZipCodeGrid from '@/components/zip-codes/ZipCodeGrid';
import { MapPinIcon, HomeIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function ZipCodesPage() {
  const zipCodes = getAllZipCodes();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-spyglass-orange to-red-700 text-white">
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Austin, TX Zip Codes
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Explore our Austin Zipcode Neighborhood Search. Each zip code has a wide selection of Austin homes and condos for sale, duplexes, townhouses, and vacant lots.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5" />
                <span>Interactive Zip Code Map</span>
              </div>
              <div className="flex items-center gap-2">
                <HomeIcon className="w-5 h-5" />
                <span>Active Listings by Area</span>
              </div>
              <div className="flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5" />
                <span>Market Data & Trends</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Austin and Surrounding Area Zip Codes
            </h2>
            <p className="text-gray-600">
              Click on any zip code to view detailed market information, active listings, and neighborhood insights.
            </p>
          </div>
          
          <div className="h-96">
            <ZipCodeMap zipCodes={zipCodes} />
          </div>
        </div>
      </div>

      {/* Zip Codes Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Zip Codes</h2>
        <ZipCodeGrid zipCodes={zipCodes} />
      </div>

      {/* Quick Overview Text */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Austin Real Estate by Zip Code
          </h3>
          <div className="prose prose-gray max-w-none text-gray-600">
            <p className="mb-4">
              Here's a quick overview of some of the zip codes within Austin. Experience the vibrant and lively life of{' '}
              <a href="/zip-codes/78704" className="text-spyglass-orange hover:text-red-700 font-medium">
                Downtown Austin
              </a>{' '}
              at 78704, 78702 upcoming community that reflects the diverse culture and artistry of the residents. 
            </p>
            <p className="mb-4">
              Find homes to the west of Austin's urban core, take a look at the neighborhoods within{' '}
              <a href="/zip-codes/78705" className="text-spyglass-orange hover:text-red-700 font-medium">
                78705
              </a>{' '}
              such as West Campus, Clarksville, and parks of Lake Austin.
            </p>
            <p>
              Whether you're looking for a modern downtown condo, a historic home in an established neighborhood, 
              or a family-friendly community with top-rated schools, Austin's diverse zip codes offer something 
              for every lifestyle and budget. Our experienced agents at Spyglass Realty know these areas inside 
              and out and can help you find your perfect home.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
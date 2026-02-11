'use client';

import { useState } from 'react';
import { ZipCodeData } from '@/data/zip-codes-data';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  HomeIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

interface ZipCodeMapProps {
  zipCodes: ZipCodeData[];
}

export default function ZipCodeMap({ zipCodes }: ZipCodeMapProps) {
  const [selectedZip, setSelectedZip] = useState<ZipCodeData | null>(null);
  const router = useRouter();

  // Simple map representation - in a real implementation you'd use Google Maps or Mapbox
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50" />
      
      {/* Zip Code Regions */}
      <div className="relative w-full h-full">
        {zipCodes.map((zipCode, index) => (
          <div
            key={zipCode.zipCode}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110 ${
              selectedZip?.zipCode === zipCode.zipCode ? 'z-10 scale-110' : 'z-0'
            }`}
            style={{
              left: `${30 + (index * 25)}%`,
              top: `${40 + (index * 15)}%`,
            }}
            onClick={() => setSelectedZip(zipCode)}
          >
            {/* Zip Code Marker */}
            <div
              className={`w-16 h-16 rounded-full border-4 shadow-lg flex items-center justify-center text-white font-bold text-sm transition-all duration-200 ${
                selectedZip?.zipCode === zipCode.zipCode
                  ? 'bg-spyglass-orange border-white scale-110 shadow-xl'
                  : zipCode.marketData?.marketTemperature === 'hot'
                  ? 'bg-red-500 border-red-300 hover:bg-red-600'
                  : zipCode.marketData?.marketTemperature === 'warm'
                  ? 'bg-orange-500 border-orange-300 hover:bg-orange-600'
                  : 'bg-blue-500 border-blue-300 hover:bg-blue-600'
              }`}
            >
              {zipCode.zipCode}
            </div>
            
            {/* Hover Label */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-gray-600 font-medium">
              {zipCode.marketData?.activeListings || 0} homes
            </div>
          </div>
        ))}

        {/* Austin Label */}
        <div className="absolute top-4 left-4 bg-white/90 rounded-lg px-3 py-2 shadow-sm">
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-900">Austin, TX</span>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white/90 rounded-lg p-3 shadow-sm">
          <div className="text-xs font-medium text-gray-900 mb-2">Market Temperature</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-xs text-gray-600">Hot</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full" />
              <span className="text-xs text-gray-600">Warm</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-xs text-gray-600">Cool</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Zip Info Panel */}
      {selectedZip && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-lg text-gray-900">
                  {selectedZip.zipCode}
                </h3>
                {selectedZip.marketData && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${
                      selectedZip.marketData.marketTemperature === 'hot'
                        ? 'bg-red-100 text-red-800'
                        : selectedZip.marketData.marketTemperature === 'warm'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {selectedZip.marketData.marketTemperature}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {selectedZip.description.substring(0, 100)}...
              </p>

              {selectedZip.marketData && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-1">
                    <HomeIcon className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {selectedZip.marketData.activeListings}
                      </div>
                      <div className="text-xs text-gray-500">Active</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <CurrencyDollarIcon className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatPrice(selectedZip.marketData.medianPrice)}
                      </div>
                      <div className="text-xs text-gray-500">Median</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 text-gray-400">📍</div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        ${selectedZip.marketData.pricePerSqft}
                      </div>
                      <div className="text-xs text-gray-500">Per Sqft</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => router.push(`/zip-codes/${selectedZip.slug}`)}
              className="ml-4 inline-flex items-center gap-1 px-3 py-2 bg-spyglass-orange text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              View Details
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!selectedZip && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 rounded-lg px-4 py-2 text-sm text-gray-600">
          Click on any zip code to view details
        </div>
      )}
    </div>
  );
}
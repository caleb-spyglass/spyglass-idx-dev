'use client';

import { ZipCodeData, getMarketTempColor, getMarketTempBg } from '@/data/zip-codes-data';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  HomeIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon,
  MapPinIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

interface ZipCodeGridProps {
  zipCodes: ZipCodeData[];
}

export default function ZipCodeGrid({ zipCodes }: ZipCodeGridProps) {
  const router = useRouter();

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {zipCodes.map((zipCode) => (
        <div
          key={zipCode.zipCode}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => router.push(`/zip-codes/${zipCode.slug}`)}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {zipCode.zipCode}
                </h3>
                <p className="text-gray-600 text-sm">{zipCode.name}</p>
              </div>
              
              {zipCode.marketData && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getMarketTempBg(zipCode.marketData.marketTemperature)} ${getMarketTempColor(zipCode.marketData.marketTemperature)}`}>
                  {zipCode.marketData.marketTemperature}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <MapPinIcon className="w-4 h-4" />
              <span>{zipCode.county} County</span>
            </div>
          </div>

          {/* Market Stats */}
          {zipCode.marketData && (
            <div className="p-6 border-b border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                    <HomeIcon className="w-4 h-4" />
                    <span className="text-xs">Active Listings</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {zipCode.marketData.activeListings}
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                    <CurrencyDollarIcon className="w-4 h-4" />
                    <span className="text-xs">Median Price</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatPrice(zipCode.marketData.medianPrice)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                    <ChartBarIcon className="w-4 h-4" />
                    <span className="text-xs">Price/Sqft</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    ${zipCode.marketData.pricePerSqft}
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                    <ClockIcon className="w-4 h-4" />
                    <span className="text-xs">Avg Days</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {zipCode.marketData.avgDaysOnMarket}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Description & Neighborhoods */}
          <div className="p-6">
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {zipCode.description}
            </p>

            {zipCode.neighborhoods && zipCode.neighborhoods.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-500 mb-2">
                  Neighborhoods:
                </div>
                <div className="flex flex-wrap gap-1">
                  {zipCode.neighborhoods.slice(0, 3).map((neighborhood, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-1"
                    >
                      {neighborhood}
                    </span>
                  ))}
                  {zipCode.neighborhoods.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{zipCode.neighborhoods.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* View Details Button */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                View market data & listings
              </span>
              <ArrowRightIcon className="w-4 h-4 text-spyglass-orange" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
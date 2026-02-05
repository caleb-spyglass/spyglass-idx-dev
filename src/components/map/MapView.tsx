'use client';

import { useEffect, useRef, useState } from 'react';
import { Listing } from '@/types/listing';
import { formatPrice } from '@/lib/mock-data';

interface MapViewProps {
  listings: Listing[];
  selectedListing?: Listing | null;
  onSelectListing?: (listing: Listing) => void;
  onBoundsChange?: (bounds: { north: number; south: number; east: number; west: number }) => void;
}

// Map placeholder - will be replaced with Leaflet/Mapbox integration
export function MapView({ 
  listings, 
  selectedListing, 
  onSelectListing,
  onBoundsChange 
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Austin center coordinates
  const center = { lat: 30.2672, lng: -97.7431 };

  useEffect(() => {
    // Placeholder: Initialize map here
    // Will add Leaflet or Mapbox integration
    setIsMapReady(true);
  }, []);

  return (
    <div ref={mapRef} className="relative w-full h-full bg-gray-100">
      {/* Map placeholder with listing markers visualization */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-full h-full min-h-[400px]">
            {/* Simple SVG map visualization placeholder */}
            <svg viewBox="0 0 400 300" className="w-full h-full">
              {/* Background */}
              <rect fill="#e5e7eb" width="400" height="300" />
              
              {/* Grid lines to simulate map */}
              {[...Array(10)].map((_, i) => (
                <g key={i}>
                  <line x1={i * 40} y1="0" x2={i * 40} y2="300" stroke="#d1d5db" strokeWidth="0.5" />
                  <line x1="0" y1={i * 30} x2="400" y2={i * 30} stroke="#d1d5db" strokeWidth="0.5" />
                </g>
              ))}

              {/* Listing markers */}
              {listings.map((listing, index) => {
                // Simple positioning based on index for placeholder
                const x = 50 + (index % 3) * 120;
                const y = 50 + Math.floor(index / 3) * 80;
                const isSelected = selectedListing?.id === listing.id;

                return (
                  <g 
                    key={listing.id} 
                    onClick={() => onSelectListing?.(listing)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Marker */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 18 : 14}
                      fill={isSelected ? '#E85A24' : '#2D2D2D'}
                      stroke="white"
                      strokeWidth="2"
                    />
                    {/* Price label */}
                    <rect
                      x={x - 30}
                      y={y - 35}
                      width="60"
                      height="20"
                      rx="4"
                      fill={isSelected ? '#E85A24' : 'white'}
                      stroke={isSelected ? '#E85A24' : '#d1d5db'}
                    />
                    <text
                      x={x}
                      y={y - 21}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="600"
                      fill={isSelected ? 'white' : '#1f2937'}
                    >
                      {listing.price >= 1000000 
                        ? `$${(listing.price / 1000000).toFixed(1)}M`
                        : `$${Math.round(listing.price / 1000)}K`
                      }
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          
          {/* Map integration notice */}
          <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-2 rounded-lg shadow-sm text-sm text-gray-600">
            🗺️ Interactive map coming soon (Leaflet/Mapbox)
          </div>
        </div>
      </div>

      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="p-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button className="p-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
      </div>

      {/* Draw polygon button */}
      <div className="absolute top-4 left-4">
        <button className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors text-sm font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Draw
        </button>
      </div>
    </div>
  );
}

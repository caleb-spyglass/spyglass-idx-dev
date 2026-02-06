'use client';

import { Listing } from '@/types/listing';
import { PropertyCard } from './PropertyCard';

interface ListingsGridProps {
  listings: Listing[];
  selectedListing?: Listing | null;
  hoveredListing?: Listing | null;
  onSelectListing?: (listing: Listing) => void;
  onHoverListing?: (listing: Listing | null) => void;
  onDismissListing?: (mlsNumber: string) => void;
  isLoading?: boolean;
}

export function ListingsGrid({ 
  listings, 
  selectedListing,
  hoveredListing,
  onSelectListing,
  onHoverListing,
  onDismissListing,
  isLoading 
}: ListingsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No homes found</h3>
        <p className="text-gray-500 max-w-sm">
          Try adjusting your search filters or zooming out on the map to see more listings.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {listings.map((listing) => (
        <div
          key={listing.id}
          onMouseEnter={() => onHoverListing?.(listing)}
          onMouseLeave={() => onHoverListing?.(null)}
        >
          <PropertyCard
            listing={listing}
            isSelected={selectedListing?.id === listing.id}
            isHovered={hoveredListing?.id === listing.id}
            onSelect={onSelectListing}
            onDismiss={onDismissListing}
          />
        </div>
      ))}
    </div>
  );
}

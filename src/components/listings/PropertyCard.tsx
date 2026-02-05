'use client';

import { Listing } from '@/types/listing';
import { formatPrice, formatNumber } from '@/lib/utils';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
// import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface PropertyCardProps {
  listing: Listing;
  onSelect?: (listing: Listing) => void;
  isSelected?: boolean;
  isHovered?: boolean;
}

export function PropertyCard({ listing, onSelect, isSelected, isHovered }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  const statusColors: Record<string, string> = {
    'Active': 'bg-green-500',
    'Pending': 'bg-yellow-500',
    'Sold': 'bg-red-500',
    'Coming Soon': 'bg-blue-500'
  };

  const hasPhoto = listing.photos.length > 0 && !imageError;
  const photoUrl = hasPhoto ? listing.photos[0] : null;

  const handleCardClick = () => {
    onSelect?.(listing);
    // Update URL without navigation for shareability
    window.history.pushState({}, '', `/listing/${listing.mlsNumber}`);
  };

  const isHighlighted = isSelected || isHovered;

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
        isHighlighted ? 'ring-2 ring-spyglass-orange shadow-lg' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
        
        {/* Price overlay */}
        <div className="absolute bottom-3 left-3 z-20">
          <span className="text-white text-xl font-bold drop-shadow-lg">
            {formatPrice(listing.price)}
          </span>
        </div>

        {/* Status badge */}
        {listing.status !== 'Active' && (
          <div className={`absolute top-3 left-3 z-20 px-2 py-1 rounded text-xs font-semibold text-white ${statusColors[listing.status]}`}>
            {listing.status}
          </div>
        )}

        {/* Days on market */}
        {listing.daysOnMarket <= 7 && listing.status === 'Active' && (
          <div className="absolute top-3 left-3 z-20 px-2 py-1 rounded text-xs font-semibold bg-spyglass-orange text-white">
            New
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          {isFavorite ? (
            <HeartSolidIcon className="w-5 h-5 text-red-500" />
          ) : (
            <HeartIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Actual image or placeholder */}
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={listing.address.street}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L2 12h3v9h14v-9h3L12 3zm0 2.84L18 11v8H6v-8l6-5.16z"/>
            </svg>
          </div>
        )}

        {/* Photo count */}
        {listing.photos.length > 1 && (
          <div className="absolute bottom-3 right-3 z-20 px-2 py-1 bg-black/60 rounded text-xs text-white">
            1/{listing.photos.length}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="flex items-center gap-4 text-sm text-gray-700 mb-2">
          {listing.bedrooms > 0 && (
            <>
              <span className="font-semibold">{listing.bedrooms} bd</span>
              <span className="text-gray-300">|</span>
            </>
          )}
          {listing.bathrooms > 0 && (
            <>
              <span className="font-semibold">{listing.bathrooms} ba</span>
              <span className="text-gray-300">|</span>
            </>
          )}
          {listing.sqft > 0 && (
            <span className="font-semibold">{formatNumber(listing.sqft)} sqft</span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm truncate">
          {listing.address.full}
        </p>
        
        {listing.address.neighborhood && (
          <p className="text-xs text-spyglass-orange mt-1">
            {listing.address.neighborhood}
          </p>
        )}
        
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>{listing.propertyType}</span>
          <span>MLS# {listing.mlsNumber}</span>
        </div>
      </div>
    </div>
  );
}

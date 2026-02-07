'use client';

import { Listing } from '@/types/listing';
import { formatPrice, formatNumber } from '@/lib/utils';
import { HeartIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useState, useRef, TouchEvent } from 'react';
import { useFavorites } from '@/hooks/useFavorites';

interface PropertyCardProps {
  listing: Listing;
  onSelect?: (listing: Listing) => void;
  onDismiss?: (mlsNumber: string) => void;
  isSelected?: boolean;
  isHovered?: boolean;
}

export function PropertyCard({ listing, onSelect, onDismiss, isSelected, isHovered }: PropertyCardProps) {
  const { isFavorite: checkFavorite, toggleFavorite } = useFavorites();
  const isFavorite = checkFavorite(listing.mlsNumber);
  const [imageError, setImageError] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const statusColors: Record<string, string> = {
    'Active': 'bg-green-500',
    'Pending': 'bg-yellow-500',
    'Sold': 'bg-red-500',
    'Coming Soon': 'bg-blue-500'
  };

  const photos = listing.photos || [];
  const hasPhotos = photos.length > 0 && !imageError;
  const photoUrl = hasPhotos ? photos[currentPhotoIndex] : null;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open if clicking on navigation arrows
    if ((e.target as HTMLElement).closest('.photo-nav')) return;
    onSelect?.(listing);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) > swipeThreshold) {
      e.preventDefault();
      if (diff > 0 && photos.length > 1) {
        // Swipe left - next photo
        setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
      } else if (diff < 0 && photos.length > 1) {
        // Swipe right - previous photo
        setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
      }
    }
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
      <div 
        className="relative aspect-[4/3] bg-gray-200"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none" />
        
        {/* Price overlay */}
        <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
          <span className="text-white text-xl font-bold drop-shadow-lg">
            {formatPrice(listing.price)}
          </span>
        </div>

        {/* Status badge */}
        {listing.status !== 'Active' && (
          <div className={`absolute top-3 left-3 z-20 px-2 py-1 rounded text-xs font-semibold text-white ${statusColors[listing.status]} pointer-events-none`}>
            {listing.status}
          </div>
        )}

        {/* Days on market */}
        {listing.daysOnMarket <= 7 && listing.status === 'Active' && (
          <div className="absolute top-3 left-3 z-20 px-2 py-1 rounded text-xs font-semibold bg-spyglass-orange text-white pointer-events-none">
            New
          </div>
        )}

        {/* Action buttons (top right) */}
        <div className="absolute top-3 right-3 z-20 flex gap-1">
          {/* Dismiss button */}
          {onDismiss && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(listing.mlsNumber);
              }}
              className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
              title="Not interested"
            >
              <XMarkIcon className="w-5 h-5 text-gray-600" />
            </button>
          )}
          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(listing.mlsNumber);
            }}
            className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          >
            {isFavorite ? (
              <HeartSolidIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Photo navigation arrows - only show if multiple photos */}
        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrevPhoto}
              className="photo-nav absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-md transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
              style={{ opacity: 1 }}
            >
              <ChevronLeftIcon className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={handleNextPhoto}
              className="photo-nav absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-md transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
              style={{ opacity: 1 }}
            >
              <ChevronRightIcon className="w-4 h-4 text-gray-700" />
            </button>
          </>
        )}

        {/* Actual image or placeholder */}
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={listing.address.street}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImageError(true)}
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L2 12h3v9h14v-9h3L12 3zm0 2.84L18 11v8H6v-8l6-5.16z"/>
            </svg>
          </div>
        )}

        {/* Photo indicator dots */}
        {photos.length > 1 && (
          <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1">
            {photos.length <= 5 ? (
              // Show dots for 5 or fewer photos
              photos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPhotoIndex(idx);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentPhotoIndex ? 'bg-white w-2.5' : 'bg-white/60'
                  }`}
                />
              ))
            ) : (
              // Show count for more than 5 photos
              <span className="px-2 py-1 bg-black/60 rounded text-xs text-white">
                {currentPhotoIndex + 1}/{photos.length}
              </span>
            )}
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

'use client';

import { useState, useEffect } from 'react';
import { Listing } from '@/types/listing';
import { formatPrice, formatNumber } from '@/lib/utils';
import { PhotoGallery } from '@/components/gallery/PhotoGallery';
import { 
  XMarkIcon,
  HeartIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChatBubbleLeftIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { SimilarListings } from '@/components/listings/SimilarListings';
import { useFavorites } from '@/hooks/useFavorites';

interface ListingDetailOverlayProps {
  listing: Listing | null;
  onClose: () => void;
  isOpen: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  onFilterByCity?: (city: string) => void;
  onFilterByZip?: (zip: string) => void;
  onFilterByNeighborhood?: (neighborhood: string) => void;
}

export function ListingDetailOverlay({ 
  listing, 
  onClose, 
  isOpen,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  onFilterByCity,
  onFilterByZip,
  onFilterByNeighborhood
}: ListingDetailOverlayProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const { isFavorite: checkFavorite, toggleFavorite } = useFavorites();
  const isFavorite = listing ? checkFavorite(listing.mlsNumber) : false;
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  // Reset when listing changes
  useEffect(() => {
    setCurrentPhotoIndex(0);
    setShowAllPhotos(false);
  }, [listing?.mlsNumber]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && e.shiftKey && onPrevious) onPrevious();
      if (e.key === 'ArrowRight' && e.shiftKey && onNext) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onPrevious, onNext, onClose]);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!listing) return null;

  const photos = listing.photos || [];

  return (
    <>
      {/* Backdrop - semi-transparent to show search behind */}
      <div 
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Modal overlay - full screen on mobile, spaced on desktop */}
      <div 
        className={`fixed inset-0 md:inset-y-0 md:left-8 md:right-8 bg-white z-50 shadow-2xl md:rounded-lg transform transition-all duration-300 ease-out ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* Top navigation bar */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* Breadcrumb / Address - Clickable like Realty Austin */}
            <div className="flex items-center gap-2 text-sm">
              <button 
                onClick={() => { onFilterByCity?.(listing.address.city); onClose(); }}
                className="text-gray-700 hover:text-spyglass-orange hover:underline font-medium"
              >
                {listing.address.city}
              </button>
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
              <button 
                onClick={() => { onFilterByZip?.(listing.address.zip); onClose(); }}
                className="text-gray-700 hover:text-spyglass-orange hover:underline font-medium"
              >
                {listing.address.zip}
              </button>
              {listing.address.neighborhood && (
                <>
                  <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                  <button 
                    onClick={() => { onFilterByNeighborhood?.(listing.address.neighborhood!); onClose(); }}
                    className="text-gray-700 hover:text-spyglass-orange hover:underline font-medium"
                  >
                    {listing.address.neighborhood}
                  </button>
                </>
              )}
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">{listing.address.full}</span>
            </div>

            {/* Previous / Next / Close */}
            <div className="flex items-center gap-4">
              <button
                onClick={onPrevious}
                disabled={!hasPrevious}
                className={`flex items-center gap-1 text-sm ${hasPrevious ? 'text-gray-700 hover:text-spyglass-orange' : 'text-gray-300 cursor-not-allowed'}`}
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={onNext}
                disabled={!hasNext}
                className={`flex items-center gap-1 text-sm ${hasNext ? 'text-gray-700 hover:text-spyglass-orange' : 'text-gray-300 cursor-not-allowed'}`}
              >
                Next
                <ArrowRightIcon className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto h-[calc(100vh-120px)]">
          <div className="max-w-7xl mx-auto px-4 py-6">
            
            {/* Photo section - swipeable on mobile, grid on desktop */}
            <div className="mb-6">
              {photos.length > 0 ? (
                <>
                  {/* Mobile: Single image with swipe */}
                  <div className="md:hidden relative aspect-[4/3] rounded-lg overflow-hidden">
                    <img
                      src={photos[currentPhotoIndex]}
                      alt={listing.address.street}
                      className="w-full h-full object-cover"
                    />
                    {/* Status badge */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-2 py-1 bg-spyglass-orange text-white text-xs font-semibold rounded">
                        SG
                      </span>
                      <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                        {listing.status.toUpperCase()}
                      </span>
                    </div>
                    {/* Navigation arrows */}
                    {photos.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-md"
                        >
                          <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                          onClick={() => setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-md"
                        >
                          <ChevronRightIcon className="w-5 h-5 text-gray-700" />
                        </button>
                      </>
                    )}
                    {/* Photo counter & see all */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                      <button 
                        onClick={() => setShowAllPhotos(true)}
                        className="px-3 py-1.5 bg-white rounded-full text-sm font-medium"
                      >
                        See all {photos.length}
                      </button>
                      <span className="px-2 py-1 bg-black/60 rounded text-xs text-white">
                        {currentPhotoIndex + 1}/{photos.length}
                      </span>
                    </div>
                  </div>

                  {/* Desktop: Grid layout */}
                  <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[500px] rounded-lg overflow-hidden">
                    {/* Large main photo */}
                    <div 
                      className="col-span-2 row-span-2 relative cursor-pointer group"
                      onClick={() => setShowAllPhotos(true)}
                    >
                      <img
                        src={photos[0]}
                        alt={listing.address.street}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      {/* Status badge */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-2 py-1 bg-spyglass-orange text-white text-xs font-semibold rounded">
                          SG
                        </span>
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                          {listing.status.toUpperCase()}
                        </span>
                      </div>
                      {/* Virtual tour button */}
                      {listing.virtualTour && (
                        <button className="absolute bottom-4 left-4 px-4 py-2 bg-white rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
                          <span className="text-lg">🌐</span>
                          Virtual Tour
                        </button>
                      )}
                      {/* See all photos */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowAllPhotos(true); }}
                        className="absolute bottom-4 left-4 px-4 py-2 bg-white rounded-full text-sm font-medium hover:bg-gray-50"
                      >
                        See all {photos.length} photos
                      </button>
                    </div>
                    
                    {/* Smaller photos grid */}
                    {photos.slice(1, 5).map((photo, idx) => (
                      <div 
                        key={idx}
                        className="relative cursor-pointer group"
                        onClick={() => { setCurrentPhotoIndex(idx + 1); setShowAllPhotos(true); }}
                      >
                        <img
                          src={photo}
                          alt={`${listing.address.street} - ${idx + 2}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        
                        {/* "Unlock more" overlay on last visible photo if there are more */}
                        {idx === 3 && photos.length > 5 && (
                          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                            <span className="text-2xl mb-1">📷</span>
                            <span className="text-sm font-medium">+{photos.length - 5} more</span>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Fill empty slots if less than 5 photos */}
                    {photos.length < 5 && Array.from({ length: 4 - photos.length + 1 }).map((_, idx) => (
                      <div key={`empty-${idx}`} className="bg-gray-100" />
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-64 md:h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-lg">No photos available</span>
                </div>
              )}
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left column - Property details */}
              <div className="lg:col-span-2">
                {/* Title and price */}
                <div className="mb-6">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                    {listing.address.full}
                  </h1>
                  <p className="text-sm text-gray-500 mb-2">MLS# {listing.mlsNumber}</p>
                  <div className="flex flex-wrap items-center gap-3 md:gap-6 text-base md:text-lg">
                    <span className="text-2xl md:text-3xl font-bold text-gray-900">{formatPrice(listing.price)}</span>
                    <span className="text-gray-600">{listing.bedrooms} bd</span>
                    <span className="text-gray-600">{listing.bathrooms} ba</span>
                    <span className="text-gray-600">{formatNumber(listing.sqft)} sqft</span>
                    {listing.lotSize && (
                      <span className="text-gray-600">{(listing.lotSize / 43560).toFixed(2)} acres</span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {listing.description && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">About this home</h2>
                    <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                      {listing.description}
                    </p>
                  </div>
                )}

                {/* Property details */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-4">Property Details</h2>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Property Type</span>
                      <span className="font-medium">{listing.propertyType}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Year Built</span>
                      <span className="font-medium">{listing.yearBuilt || '—'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Days on Market</span>
                      <span className="font-medium">{listing.daysOnMarket}</span>
                    </div>
                    {listing.garage && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Garage</span>
                        <span className="font-medium">{listing.garage} car</span>
                      </div>
                    )}
                    {listing.stories && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Stories</span>
                        <span className="font-medium">{listing.stories}</span>
                      </div>
                    )}
                    {listing.pool !== undefined && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Pool</span>
                        <span className="font-medium">{listing.pool ? 'Yes' : 'No'}</span>
                      </div>
                    )}
                    {listing.pricePerSqft && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Price/sqft</span>
                        <span className="font-medium">${listing.pricePerSqft.toFixed(0)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right column - Contact form */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-24 bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Schedule a Tour</h3>
                  <form className="space-y-3">
                    <input
                      type="text"
                      placeholder="Full name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                    />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                    />
                    <textarea
                      placeholder={`I'd like to tour ${listing.address.street}...`}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-spyglass-orange focus:border-transparent resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-spyglass-orange text-white font-semibold rounded-lg hover:bg-spyglass-orange/90 transition-colors"
                    >
                      Request Tour
                    </button>
                  </form>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Or call 737-727-4889
                  </p>
                </div>
              </div>
            </div>

            {/* Similar Listings */}
            {listing && <SimilarListings listing={listing} />}
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-end gap-6">
            <button
              onClick={onClose}
              className="flex flex-col items-center text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-6 h-6" />
              <span className="text-xs mt-1">Dismiss</span>
            </button>
            <button
              onClick={() => listing && toggleFavorite(listing.mlsNumber)}
              className="flex flex-col items-center text-gray-500 hover:text-red-500"
            >
              {isFavorite ? (
                <HeartSolidIcon className="w-6 h-6 text-red-500" />
              ) : (
                <HeartIcon className="w-6 h-6" />
              )}
              <span className="text-xs mt-1">Favorite</span>
            </button>
            <button className="flex flex-col items-center text-gray-500 hover:text-gray-700">
              <ChatBubbleLeftIcon className="w-6 h-6" />
              <span className="text-xs mt-1">Comment</span>
            </button>
            <button 
              onClick={() => navigator.share?.({ title: listing.address.street, url: window.location.href })}
              className="flex flex-col items-center text-gray-500 hover:text-gray-700"
            >
              <ShareIcon className="w-6 h-6" />
              <span className="text-xs mt-1">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full photo gallery modal */}
      <PhotoGallery
        photos={photos}
        initialIndex={currentPhotoIndex}
        isOpen={showAllPhotos}
        onClose={() => setShowAllPhotos(false)}
      />
    </>
  );
}

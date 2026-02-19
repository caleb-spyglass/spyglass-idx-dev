'use client';

import { useState, useEffect, useRef } from 'react';
import { Listing } from '@/types/listing';
import { formatPrice, formatNumber } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface SimilarListingsProps {
  listing: Listing;
  /** If provided, clicking a card calls this instead of navigating */
  onSelect?: (listing: Listing) => void;
}

export function SimilarListings({ listing, onSelect }: SimilarListingsProps) {
  const [similar, setSimilar] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchSimilar() {
      setLoading(true);
      setError(false);
      try {
        const params = new URLSearchParams({
          mlsNumber: listing.mlsNumber,
          price: String(listing.price),
          ...(listing.address.city && { city: listing.address.city }),
        });

        const res = await fetch(`/api/listings/similar?${params}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (!cancelled) {
          setSimilar(data.listings || []);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSimilar();
    return () => { cancelled = true; };
  }, [listing.mlsNumber, listing.price, listing.address.city]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  // Build "View More" search link with similar filters
  const viewMoreParams = new URLSearchParams({
    ...(listing.address.city && { city: listing.address.city }),
    minPrice: String(Math.round(listing.price * 0.75)),
    maxPrice: String(Math.round(listing.price * 1.25)),
    beds: String(listing.bedrooms || ''),
    baths: String(listing.bathrooms || ''),
  });

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">You Might Also Like</h2>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[280px] animate-pulse">
              <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-3" />
              <div className="h-5 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-36 mb-1" />
              <div className="h-4 bg-gray-200 rounded w-48" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || similar.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">You Might Also Like</h2>
        <div className="flex items-center gap-2">
          {/* Scroll arrows - hidden on mobile (touch scroll), shown on desktop */}
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex p-1.5 rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex p-1.5 rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Horizontal scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-1 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {similar.map((item) => (
          <SimilarCard key={item.mlsNumber} listing={item} onSelect={onSelect} />
        ))}
      </div>

      {/* View More link */}
      <div className="mt-4 text-center">
        <Link
          href={`/buy?${viewMoreParams.toString()}`}
          className="text-spyglass-orange hover:text-spyglass-orange/80 font-medium text-sm hover:underline transition-colors"
        >
          View More Like This →
        </Link>
      </div>
    </div>
  );
}

function SimilarCard({
  listing,
  onSelect,
}: {
  listing: Listing;
  onSelect?: (listing: Listing) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const photo = listing.photos?.[0];
  const hasPhoto = photo && !imgError;

  const content = (
    <div className="flex-shrink-0 w-[280px] snap-start bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all hover:shadow-lg group">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none" />
        {/* Price overlay */}
        <div className="absolute bottom-2 left-2 z-20 pointer-events-none">
          <span className="text-white text-lg font-bold drop-shadow-lg">
            {formatPrice(listing.price)}
          </span>
        </div>
        {/* New badge */}
        {listing.daysOnMarket <= 7 && listing.status === 'Active' && (
          <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded text-xs font-semibold bg-spyglass-orange text-white pointer-events-none">
            New
          </div>
        )}
        {hasPhoto ? (
          <img
            src={photo}
            alt={listing.address.street}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L2 12h3v9h14v-9h3L12 3zm0 2.84L18 11v8H6v-8l6-5.16z" />
            </svg>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-3">
        <div className="flex items-center gap-3 text-sm text-gray-700 mb-1">
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
        <p className="text-gray-600 text-sm truncate">{listing.address.full}</p>
      </div>
    </div>
  );

  if (onSelect) {
    return (
      <div onClick={() => onSelect(listing)}>
        {content}
      </div>
    );
  }

  return (
    <Link href={`/listing/${listing.mlsNumber}`}>
      {content}
    </Link>
  );
}

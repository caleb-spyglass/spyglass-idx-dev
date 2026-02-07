'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { useFavorites } from '@/hooks/useFavorites';
import { Listing } from '@/types/listing';
import { PropertyCard } from '@/components/listings/PropertyCard';
import { ListingDetailOverlay } from '@/components/listings/ListingDetailOverlay';
import { HeartIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function FavoritesPage() {
  const { favorites, clearFavorites, isLoaded } = useFavorites();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Fetch each favorited listing
  useEffect(() => {
    if (!isLoaded) return;
    if (favorites.length === 0) {
      setListings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all(
      favorites.map(async (mls) => {
        try {
          const res = await fetch(`/api/listings/${mls}`);
          if (!res.ok) return null;
          return (await res.json()) as Listing;
        } catch {
          return null;
        }
      })
    ).then((results) => {
      setListings(results.filter((r): r is Listing => r !== null));
      setLoading(false);
    });
  }, [favorites, isLoaded]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
            <p className="text-sm text-gray-500 mt-1">
              {favorites.length === 0
                ? 'You haven\'t saved any listings yet'
                : `${favorites.length} saved listing${favorites.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          {favorites.length > 0 && (
            <button
              onClick={clearFavorites}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <TrashIcon className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && favorites.length === 0 && (
          <div className="text-center py-16">
            <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">No favorites yet</h2>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Tap the heart icon on any listing to save it here for later.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-spyglass-orange text-white font-medium rounded-lg hover:bg-spyglass-orange/90 transition-colors"
            >
              Browse Listings
            </Link>
          </div>
        )}

        {/* Listings grid */}
        {!loading && listings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <PropertyCard
                key={listing.id}
                listing={listing}
                onSelect={setSelectedListing}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail overlay */}
      <ListingDetailOverlay
        listing={selectedListing}
        isOpen={selectedListing !== null}
        onClose={() => setSelectedListing(null)}
      />
    </div>
  );
}

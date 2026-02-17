'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface FeaturedListing {
  mlsNumber: string;
  address: string;
  listPrice: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  photoUrl: string;
  community?: string;
}

export function FeaturedListingsSection() {
  const [listings, setListings] = useState<FeaturedListing[]>([]);

  useEffect(() => {
    // Fetch featured/recent listings
    fetch('/api/listings?limit=4&sortBy=listPrice&sortDir=desc')
      .then(res => res.json())
      .then(data => {
        if (data.listings && data.listings.length > 0) {
          setListings(data.listings.slice(0, 4).map((l: any) => ({
            mlsNumber: l.mlsNumber || l.mls,
            address: (typeof l.address === 'object' ? (l.address.full || l.address.street || 'Austin, TX') : l.address) || l.streetAddress || 'Austin, TX',
            listPrice: l.listPrice || l.price || 0,
            bedrooms: l.bedrooms || l.beds || 0,
            bathrooms: l.bathrooms || l.baths || 0,
            sqft: l.sqft || l.livingArea || 0,
            photoUrl: l.photoUrl || l.photos?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
            community: l.community || l.neighborhood || '',
          })));
        }
      })
      .catch(() => {});
  }, []);

  // Fallback listings if API fails
  const displayListings = listings.length > 0 ? listings : [
    { mlsNumber: '1', address: 'Downtown Austin', listPrice: 1250000, bedrooms: 4, bathrooms: 3, sqft: 3800, photoUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400', community: 'Downtown' },
    { mlsNumber: '2', address: 'South Congress', listPrice: 875000, bedrooms: 3, bathrooms: 2, sqft: 2100, photoUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', community: 'SoCo' },
    { mlsNumber: '3', address: 'Westlake Hills', listPrice: 950000, bedrooms: 4, bathrooms: 3, sqft: 2800, photoUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400', community: 'Westlake' },
    { mlsNumber: '4', address: 'Mueller', listPrice: 2100000, bedrooms: 5, bathrooms: 4, sqft: 4200, photoUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400', community: 'Mueller' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Featured Listings
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayListings.map((listing) => (
            <Link
              key={listing.mlsNumber}
              href={`/listing/${listing.mlsNumber}`}
              className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={listing.photoUrl}
                  alt={listing.address}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-spyglass-orange text-white px-3 py-1 rounded-full text-sm font-bold">
                  ${listing.listPrice.toLocaleString()}
                </div>
              </div>
              <div className="p-4">
                <div className="text-sm text-gray-500 mb-1">
                  {listing.bedrooms} Bed&nbsp;&nbsp;{listing.bathrooms} Bath&nbsp;&nbsp;{listing.sqft.toLocaleString()} sqft
                </div>
                <div className="font-semibold text-gray-900 text-sm truncate">
                  {listing.address}
                </div>
                {listing.community && (
                  <div className="text-xs text-gray-400 mt-1">{listing.community}</div>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/featured-listings"
            className="inline-flex items-center text-spyglass-orange font-semibold hover:text-spyglass-orange-hover transition-colors"
          >
            View All Listings →
          </Link>
        </div>
      </div>
    </section>
  );
}

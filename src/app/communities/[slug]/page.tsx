'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { ListingsGrid } from '@/components/listings/ListingsGrid';
import { communitiesData } from '@/data/communities-data';
import { Listing, SearchFilters } from '@/types/listing';
import { formatPrice } from '@/lib/utils';
import { ArrowLeftIcon, MapPinIcon, HomeIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

// Lazy load map
const LeafletMap = lazy(() =>
  import('@/components/map/LeafletMap').then(mod => ({ default: mod.LeafletMap }))
);

function MapLoadingFallback() {
  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  );
}

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const community = communitiesData.find(c => c.slug === slug || c.id === slug);

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [hoveredListing, setHoveredListing] = useState<Listing | null>(null);

  // Fetch listings for this community
  useEffect(() => {
    if (!community?.bounds) return;

    const fetchListings = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/listings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bounds: community.bounds,
            pageSize: 50,
            sort: 'date-desc',
          } as SearchFilters),
        });

        if (response.ok) {
          const data = await response.json();
          setListings(data.listings || []);
          setTotal(data.total || 0);
        }
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [community]);

  if (!community) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Community Not Found</h1>
          <p className="text-gray-600 mb-8">We couldn't find this community.</p>
          <button
            onClick={() => router.push('/communities')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-spyglass-orange text-white rounded-lg hover:bg-spyglass-orange/90 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Communities
          </button>
        </div>
      </div>
    );
  }

  // Calculate stats from listings
  const avgPrice = listings.length > 0
    ? listings.reduce((sum, l) => sum + l.price, 0) / listings.length
    : community.medianPrice || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <div className="relative bg-gray-900 text-white">
        {community.imageUrl && (
          <div className="absolute inset-0">
            <img
              src={community.imageUrl}
              alt={community.name}
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
          </div>
        )}
        
        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
          <button
            onClick={() => router.push('/communities')}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            All Communities
          </button>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{community.name}</h1>
          
          {community.description && (
            <p className="text-lg text-gray-300 max-w-2xl mb-6">
              {community.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <HomeIcon className="w-5 h-5 text-spyglass-orange" />
              <span className="font-semibold">{total}</span>
              <span className="text-gray-300">Active Listings</span>
            </div>
            {avgPrice > 0 && (
              <div className="flex items-center gap-2">
                <CurrencyDollarIcon className="w-5 h-5 text-spyglass-orange" />
                <span className="font-semibold">{formatPrice(avgPrice)}</span>
                <span className="text-gray-300">Avg Price</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-spyglass-orange" />
              <span className="text-gray-300">Austin, TX Area</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 300px)' }}>
        {/* Listings */}
        <div className="w-full md:w-1/2 lg:w-[45%] overflow-y-auto bg-gray-50">
          <div className="sticky top-0 bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {loading ? 'Loading...' : `${total} homes in ${community.name}`}
            </span>
          </div>

          <ListingsGrid
            listings={listings}
            selectedListing={selectedListing}
            hoveredListing={hoveredListing}
            onSelectListing={setSelectedListing}
            onHoverListing={setHoveredListing}
            isLoading={loading}
          />
        </div>

        {/* Map */}
        <div className="hidden md:block md:w-1/2 lg:w-[55%] border-l border-gray-200">
          <Suspense fallback={<MapLoadingFallback />}>
            <LeafletMap
              listings={listings}
              communities={[community]}
              selectedListing={selectedListing}
              hoveredListing={hoveredListing}
              selectedCommunity={community}
              onSelectListing={setSelectedListing}
              onHoverListing={setHoveredListing}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

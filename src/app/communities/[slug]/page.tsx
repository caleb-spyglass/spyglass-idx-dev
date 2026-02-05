'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { ListingsGrid } from '@/components/listings/ListingsGrid';
import { getCommunityBySlug } from '@/data/communities-polygons';
import { Listing } from '@/types/listing';
import { formatPrice } from '@/lib/utils';
import { ArrowLeftIcon, MapPinIcon, HomeIcon, CurrencyDollarIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import ContactModal from '@/components/forms/ContactModal';

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

function CommunityDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const isEmbed = searchParams.get('embed') === 'true';

  const community = getCommunityBySlug(slug);

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [hoveredListing, setHoveredListing] = useState<Listing | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  // Fetch listings for this community using polygon
  useEffect(() => {
    if (!community?.polygon) return;

    const fetchListings = async () => {
      setLoading(true);
      try {
        // Convert polygon to format Repliers expects
        const polygonString = community.polygon
          .map(([lng, lat]) => `${lat},${lng}`)
          .join(';');

        const response = await fetch(`/api/listings?polygon=${encodeURIComponent(polygonString)}&pageSize=100`);

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
        {!isEmbed && <Header />}
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Community Not Found</h1>
          <p className="text-gray-600 mb-8">We couldn&apos;t find this community.</p>
          <button
            onClick={() => router.push('/communities')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
    : 0;

  // Convert polygon to format LeafletMap expects
  const mapCommunity = {
    id: community.slug,
    name: community.name,
    slug: community.slug,
    coordinates: community.displayPolygon.map(([lat, lng]) => ({ lat, lng })),
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isEmbed && <Header />}

      {/* Hero */}
      <div className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 to-gray-900" />
        
        <div className={`relative max-w-7xl mx-auto px-4 ${isEmbed ? 'py-6' : 'py-12 md:py-16'}`}>
          {!isEmbed && (
            <button
              onClick={() => router.push('/communities')}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              All Communities
            </button>
          )}

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className={`${isEmbed ? 'text-2xl' : 'text-3xl md:text-4xl'} font-bold mb-2`}>
                {community.name}
              </h1>
              
              <div className="flex items-center gap-2 text-gray-300">
                <MapPinIcon className="w-4 h-4" />
                <span>{community.county} County, Austin TX Area</span>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="flex gap-3">
              <a
                href="tel:7377274889"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <PhoneIcon className="w-5 h-5" />
                <span className="hidden sm:inline">737-727-4889</span>
              </a>
              <button
                onClick={() => setShowContactModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
              >
                <EnvelopeIcon className="w-5 h-5" />
                Contact Agent
              </button>
            </div>
          </div>

          {/* Stats */}
          {!isEmbed && (
            <div className="flex flex-wrap gap-6 mt-6">
              <div className="flex items-center gap-2">
                <HomeIcon className="w-5 h-5 text-red-400" />
                <span className="font-semibold">{total}</span>
                <span className="text-gray-300">Active Listings</span>
              </div>
              {avgPrice > 0 && (
                <div className="flex items-center gap-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-red-400" />
                  <span className="font-semibold">{formatPrice(avgPrice)}</span>
                  <span className="text-gray-300">Avg Price</span>
                </div>
              )}
              {community.featured && (
                <span className="px-3 py-1 bg-red-600/30 text-red-200 rounded-full text-sm font-medium">
                  Featured Community
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden" style={{ height: isEmbed ? 'calc(100vh - 100px)' : 'calc(100vh - 280px)' }}>
        {/* Listings */}
        <div className="w-full md:w-1/2 lg:w-[45%] overflow-y-auto bg-gray-50">
          <div className="sticky top-0 bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between z-10">
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
              communities={[mapCommunity]}
              selectedListing={selectedListing}
              hoveredListing={hoveredListing}
              selectedCommunity={mapCommunity}
              onSelectListing={setSelectedListing}
              onHoverListing={setHoveredListing}
            />
          </Suspense>
        </div>
      </div>

      {/* Powered by footer for embeds */}
      {isEmbed && (
        <div className="bg-white border-t border-gray-200 px-4 py-2 text-center text-xs text-gray-500">
          Powered by{' '}
          <a 
            href="https://spyglassrealty.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Spyglass Realty
          </a>
        </div>
      )}

      {/* Contact Modal */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        communityName={community.name}
        variant="info"
        title={`Interested in ${community.name}?`}
      />
    </div>
  );
}

export default function CommunityDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50"><Header /><div className="p-8 text-center">Loading community...</div></div>}>
      <CommunityDetailContent />
    </Suspense>
  );
}

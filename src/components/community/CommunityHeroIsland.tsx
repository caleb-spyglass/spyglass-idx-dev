'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import {
  ArrowLeftIcon,
  MapPinIcon,
  HomeIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChartBarIcon,
  InformationCircleIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import ContactModal from '@/components/forms/ContactModal';
import CommunityStats from '@/components/community/CommunityStats';
import CommunityListingsIsland from '@/components/community/CommunityListingsIsland';
import { formatPrice } from '@/lib/utils';

const LeafletMap = lazy(() =>
  import('@/components/map/LeafletMap').then((mod) => ({ default: mod.LeafletMap }))
);

function MapLoadingFallback() {
  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  );
}

type TabType = 'listings' | 'market' | 'about';

interface CommunityHeroIslandProps {
  communityName: string;
  communitySlug: string;
  county: string;
  polygon: [number, number][];
  displayPolygon: [number, number][];
  /** Server-rendered About content (from page.tsx) passed as children */
  aboutContent: React.ReactNode;
}

export default function CommunityHeroIsland({
  communityName,
  communitySlug,
  county,
  polygon,
  displayPolygon,
  aboutContent,
}: CommunityHeroIslandProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';
  const initialTab = (searchParams.get('tab') as TabType) || 'listings';

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [showContactModal, setShowContactModal] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch stats for the hero section
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/communities/${communitySlug}/stats`);
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
          setTotal(data.stats?.activeListings || 0);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [communitySlug]);

  const mapCommunity = {
    id: communitySlug,
    name: communityName,
    slug: communitySlug,
    coordinates: displayPolygon.map(([lat, lng]) => ({ lat, lng })),
  };

  const tabs = [
    { id: 'listings' as TabType, label: 'Listings', icon: Squares2X2Icon, count: total },
    { id: 'market' as TabType, label: 'Market Data', icon: ChartBarIcon },
    { id: 'about' as TabType, label: 'About', icon: InformationCircleIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isEmbed && <Header />}

      {/* Hero */}
      <div className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 to-gray-900" />

        <div className={`relative max-w-7xl mx-auto px-4 ${isEmbed ? 'py-4' : 'py-8 md:py-12'}`}>
          {!isEmbed && (
            <button
              onClick={() => router.push('/communities')}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-3 transition-colors text-sm"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              All Communities
            </button>
          )}

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className={`${isEmbed ? 'text-2xl' : 'text-3xl md:text-4xl'} font-bold mb-2`}>
                Homes for Sale in {communityName}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-gray-300">
                <div className="flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{county} County, Austin TX</span>
                </div>
                {!loading && total !== null && (
                  <>
                    <div className="flex items-center gap-1">
                      <HomeIcon className="w-4 h-4" />
                      <span>{total} Active Listings</span>
                    </div>
                    {stats?.medianPrice > 0 && (
                      <div className="flex items-center gap-1">
                        <CurrencyDollarIcon className="w-4 h-4" />
                        <span>Median: {formatPrice(stats.medianPrice)}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

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

          {/* Tabs */}
          {!isEmbed && (
            <div className="flex gap-1 mt-6 border-b border-white/20 -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? 'text-white border-red-500'
                      : 'text-white/60 hover:text-white/80 border-transparent'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                  {tab.count !== undefined && tab.count !== null && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        activeTab === tab.id ? 'bg-red-500' : 'bg-white/20'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'listings' && (
        <CommunityListingsIsland
          communitySlug={communitySlug}
          communityName={communityName}
          polygon={polygon}
          displayPolygon={displayPolygon}
          isEmbed={isEmbed}
        />
      )}

      {activeTab === 'market' && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Market Statistics for {communityName}
            </h2>
            <CommunityStats communitySlug={communitySlug} communityName={communityName} />
          </div>
        </div>
      )}

      {activeTab === 'about' && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Server-rendered about content passed from parent */}
            {aboutContent}

            {/* Map preview */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{communityName} Boundaries</h2>
              <div className="h-96 rounded-xl overflow-hidden border border-gray-200">
                <Suspense fallback={<MapLoadingFallback />}>
                  <LeafletMap listings={[]} communities={[mapCommunity]} selectedCommunity={mapCommunity} />
                </Suspense>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 bg-red-50 rounded-xl p-6 text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Ready to explore {communityName}?
              </h3>
              <p className="text-gray-600 mb-4">
                Our agents know this neighborhood inside and out. Let us help you find your perfect home.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="tel:7377274889"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <PhoneIcon className="w-5 h-5" />
                  Call 737-727-4889
                </a>
                <button
                  onClick={() => setShowContactModal(true)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  <EnvelopeIcon className="w-5 h-5" />
                  Send a Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        communityName={communityName}
        variant="info"
        title={`Interested in ${communityName}?`}
      />
    </div>
  );
}

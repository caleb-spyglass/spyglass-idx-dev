'use client';

import { useState, useEffect } from 'react';
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
import AreaCommunityListingsIsland from '@/components/community/AreaCommunityListingsIsland';
import { formatPrice } from '@/lib/utils';

type TabType = 'listings' | 'market' | 'about';

interface AreaCommunityHeroIslandProps {
  communityName: string;
  communitySlug: string;
  county: string;
  areaType: 'zip' | 'city';
  filterValue: string;
  aboutContent: React.ReactNode;
}

export default function AreaCommunityHeroIsland({
  communityName,
  communitySlug,
  county,
  areaType,
  filterValue,
  aboutContent,
}: AreaCommunityHeroIslandProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';
  const initialTab = (searchParams.get('tab') as TabType) || 'listings';

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [showContactModal, setShowContactModal] = useState(false);
  const [total, setTotal] = useState<number | null>(null);
  const [medianPrice, setMedianPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch initial stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const param = areaType === 'zip' ? `zip=${filterValue}` : `city=${encodeURIComponent(filterValue)}`;
        const response = await fetch(`/api/listings?${param}&pageSize=100`);
        if (response.ok) {
          const data = await response.json();
          setTotal(data.total || 0);
          if (data.listings && data.listings.length > 0) {
            const sorted = [...data.listings].sort((a: any, b: any) => a.price - b.price);
            const median = sorted[Math.floor(sorted.length / 2)].price;
            setMedianPrice(median);
          }
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [areaType, filterValue]);

  const tabs = [
    { id: 'listings' as TabType, label: 'Listings', icon: Squares2X2Icon, count: total },
    { id: 'market' as TabType, label: 'Market Data', icon: ChartBarIcon },
    { id: 'about' as TabType, label: 'About', icon: InformationCircleIcon },
  ];

  const locationLabel = areaType === 'zip'
    ? `${filterValue} · ${county} County, Austin TX`
    : `${county} County, TX`;

  const heroTitle = areaType === 'zip'
    ? `Homes for Sale in ${filterValue}`
    : `Homes for Sale in ${communityName}, TX`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-y-auto">
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
                {heroTitle}
              </h1>

              {/* Sub-heading with neighborhood names for zip codes */}
              {areaType === 'zip' && (
                <p className="text-gray-300 text-base mb-2">{communityName}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-gray-300">
                <div className="flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{locationLabel}</span>
                </div>
                {!loading && total !== null && (
                  <>
                    <div className="flex items-center gap-1">
                      <HomeIcon className="w-4 h-4" />
                      <span>{total} Active Listings</span>
                    </div>
                    {medianPrice && medianPrice > 0 && (
                      <div className="flex items-center gap-1">
                        <CurrencyDollarIcon className="w-4 h-4" />
                        <span>Median: {formatPrice(medianPrice)}</span>
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
        <AreaCommunityListingsIsland
          communitySlug={communitySlug}
          communityName={communityName}
          areaType={areaType}
          filterValue={filterValue}
          isEmbed={isEmbed}
        />
      )}

      {activeTab === 'market' && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Market Statistics for {areaType === 'zip' ? filterValue : communityName}
            </h2>
            <CommunityStats communitySlug={communitySlug} communityName={communityName} />
          </div>
        </div>
      )}

      {activeTab === 'about' && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {aboutContent}

            {/* CTA */}
            <div className="mt-8 bg-red-50 rounded-xl p-6 text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Ready to explore {areaType === 'zip' ? `the ${filterValue} area` : communityName}?
              </h3>
              <p className="text-gray-600 mb-4">
                Our agents know this area inside and out. Let us help you find your perfect home.
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
        title={`Interested in ${areaType === 'zip' ? `the ${filterValue} area` : communityName}?`}
      />
    </div>
  );
}

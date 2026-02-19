'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { ZipCodeData, getMarketTempColor, getMarketTempBg } from '@/data/zip-codes-data';
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
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import ContactModal from '@/components/forms/ContactModal';
import AreaCommunityListingsIsland from '@/components/community/AreaCommunityListingsIsland';
import CommunityStats from '@/components/community/CommunityStats';
import { formatPrice } from '@/lib/utils';
import dynamic from 'next/dynamic';

const ZipCodeDetailMap = dynamic(
  () => import('@/components/zip-codes/ZipCodeDetailMap'),
  { ssr: false, loading: () => (
    <div className="w-full h-[300px] md:h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-spyglass-orange mx-auto mb-2"></div>
    </div>
  )}
);
import { getPulseData, formatDollar, formatNumber } from '@/data/pulse-market-data';
import { PulseZipSummary, formatPulseCurrency, formatPulseNumber } from '@/lib/pulse-api';
import PulseMarketInsights from './PulseMarketInsights';

type TabType = 'listings' | 'market' | 'about';

interface ZipCodeHeroIslandProps {
  zipCodeData: ZipCodeData;
  aboutContent: React.ReactNode;
  pulseData?: PulseZipSummary | null;
}

// Austin Metro averages for comparison
const AUSTIN_METRO_MEDIAN = 550000;
const AUSTIN_METRO_PRICE_SQFT = 275;
const AUSTIN_METRO_AVG_DOM = 35;

export default function ZipCodeHeroIsland({
  zipCodeData,
  aboutContent,
  pulseData,
}: ZipCodeHeroIslandProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';
  const initialTab = (searchParams.get('tab') as TabType) || 'listings';

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [showContactModal, setShowContactModal] = useState(false);
  const [total, setTotal] = useState<number | null>(zipCodeData.marketData?.activeListings ?? null);
  const [medianPrice, setMedianPrice] = useState<number | null>(zipCodeData.marketData?.medianPrice ?? null);
  const [loading, setLoading] = useState(true);

  // Legacy static pulse data (fallback)
  const staticPulseData = getPulseData(zipCodeData.zipCode);

  // Determine which market data to display
  const marketData = {
    homeValue: pulseData?.metrics?.home_value || staticPulseData?.medianHomeValue || 0,
    yoyChange: pulseData?.metrics?.home_value_growth_yoy ?? staticPulseData?.yoyChange ?? 0,
    medianIncome: pulseData?.metrics?.median_income || staticPulseData?.medianIncome || 0,
    population: pulseData?.metrics?.population || staticPulseData?.population || 0,
    daysOnMarket: pulseData?.metrics?.days_on_market || 0,
    inventory: pulseData?.metrics?.for_sale_inventory || 0,
    forecast: pulseData?.forecast?.value || 0,
    isPulseData: !!pulseData?.metrics,
  };

  // Fetch real listing stats from the API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/listings?zip=${zipCodeData.zipCode}&pageSize=100`);
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
  }, [zipCodeData.zipCode]);

  const tabs = [
    { 
      id: 'listings' as TabType, 
      label: 'Listings', 
      icon: Squares2X2Icon, 
      count: total 
    },
    { 
      id: 'market' as TabType, 
      label: 'Market Data', 
      icon: ChartBarIcon,
    },
    { id: 'about' as TabType, label: 'About', icon: InformationCircleIcon },
  ];

  const marketData = zipCodeData.marketData;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-y-auto">
      {!isEmbed && <Header />}

      {/* Hero */}
      <div className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 to-gray-900" />

        <div className={`relative max-w-7xl mx-auto px-4 ${isEmbed ? 'py-4' : 'py-8 md:py-12'}`}>
          {!isEmbed && (
            <button
              onClick={() => router.push('/zip-codes')}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-3 transition-colors text-sm"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              All Zip Codes
            </button>
          )}

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className={`${isEmbed ? 'text-2xl' : 'text-3xl md:text-4xl'} font-bold mb-2`}>
                Homes for Sale in {zipCodeData.zipCode}
              </h1>

              <p className="text-gray-300 text-base mb-2">{zipCodeData.name}</p>

              <div className="flex flex-wrap items-center gap-4 text-gray-300">
                <div className="flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{zipCodeData.county} County, Austin TX</span>
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
                href="tel:5128099338"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <PhoneIcon className="w-5 h-5" />
                <span className="hidden sm:inline">512-809-9338</span>
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

          {/* Market Snapshot - Enhanced with Pulse API data */}
          {(marketData.homeValue > 0 || staticPulseData) && !isEmbed && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                <p className="text-white/60 text-xs uppercase tracking-wide">
                  Median Home Value
                  {marketData.isPulseData && (
                    <span className="ml-1 text-xs bg-blue-500 text-white px-1 rounded">LIVE</span>
                  )}
                </p>
                <p className="text-white text-lg font-bold">
                  {marketData.isPulseData 
                    ? formatPulseCurrency(marketData.homeValue)
                    : formatDollar(marketData.homeValue)
                  }
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                <p className="text-white/60 text-xs uppercase tracking-wide">YoY Change</p>
                <p className={`text-lg font-bold flex items-center gap-1 ${
                  marketData.yoyChange >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {marketData.yoyChange >= 0 ? (
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4" />
                  )}
                  {marketData.yoyChange >= 0 ? '+' : ''}{marketData.yoyChange}%
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                <p className="text-white/60 text-xs uppercase tracking-wide">Median Income</p>
                <p className="text-white text-lg font-bold">
                  {marketData.isPulseData 
                    ? formatPulseCurrency(marketData.medianIncome)
                    : formatDollar(marketData.medianIncome)
                  }
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                <p className="text-white/60 text-xs uppercase tracking-wide">Population</p>
                <p className="text-white text-lg font-bold">
                  {marketData.isPulseData 
                    ? formatPulseNumber(marketData.population)
                    : formatNumber(marketData.population)
                  }
                </p>
              </div>
            </div>
          )}

          {/* Additional Pulse Data for Test Zips */}
          {pulseData?.metrics && marketData.isPulseData && !isEmbed && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              {marketData.daysOnMarket > 0 && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                  <p className="text-white/60 text-xs uppercase tracking-wide">Days on Market</p>
                  <p className="text-white text-lg font-bold">{Math.round(marketData.daysOnMarket)} days</p>
                </div>
              )}
              {marketData.inventory > 0 && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                  <p className="text-white/60 text-xs uppercase tracking-wide">Active Inventory</p>
                  <p className="text-white text-lg font-bold">{Math.round(marketData.inventory)}</p>
                </div>
              )}
              {marketData.forecast !== 0 && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                  <p className="text-white/60 text-xs uppercase tracking-wide">12-Mo Forecast</p>
                  <p className={`text-lg font-bold flex items-center gap-1 ${
                    marketData.forecast >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {marketData.forecast >= 0 ? (
                      <ArrowTrendingUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-4 h-4" />
                    )}
                    {marketData.forecast >= 0 ? '+' : ''}{marketData.forecast}%
                  </p>
                </div>
              )}
              {pulseData.metrics.value_income_ratio && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                  <p className="text-white/60 text-xs uppercase tracking-wide">Value/Income Ratio</p>
                  <p className="text-white text-lg font-bold">{pulseData.metrics.value_income_ratio.toFixed(1)}x</p>
                </div>
              )}
            </div>
          )}

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
      {activeTab === 'market' && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
            {/* Enhanced Pulse Market Insights for Test Zip Codes */}
            {pulseData?.metrics && marketData.isPulseData && (
              <PulseMarketInsights pulseData={pulseData} />
            )}
            
            {/* Standard Community Stats */}
            <CommunityStats
              communitySlug={zipCodeData.slug}
              communityName={`${zipCodeData.zipCode} (${zipCodeData.name})`}
              statsUrl={`/api/zip-codes/${zipCodeData.zipCode}/stats`}
            />
          </div>
        </div>
      )}

      {activeTab === 'listings' && (
        <AreaCommunityListingsIsland
          communitySlug={zipCodeData.slug}
          communityName={zipCodeData.name}
          areaType="zip"
          filterValue={zipCodeData.zipCode}
          isEmbed={isEmbed}
        />
      )}

      {activeTab === 'about' && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {aboutContent}
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
        communityName={zipCodeData.name}
        variant="info"
        title={`Interested in the ${zipCodeData.zipCode} area?`}
      />
    </div>
  );
}
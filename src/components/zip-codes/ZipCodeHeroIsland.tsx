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
import { formatPrice } from '@/lib/utils';

type TabType = 'listings' | 'market' | 'about';

interface ZipCodeHeroIslandProps {
  zipCodeData: ZipCodeData;
  aboutContent: React.ReactNode;
}

// Austin Metro averages for comparison
const AUSTIN_METRO_MEDIAN = 550000;
const AUSTIN_METRO_PRICE_SQFT = 275;
const AUSTIN_METRO_AVG_DOM = 35;

export default function ZipCodeHeroIsland({
  zipCodeData,
  aboutContent,
}: ZipCodeHeroIslandProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';
  const initialTab = (searchParams.get('tab') as TabType) || 'market';

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [showContactModal, setShowContactModal] = useState(false);

  const tabs = [
    { 
      id: 'market' as TabType, 
      label: 'Market Data', 
      icon: ChartBarIcon,
      count: zipCodeData.marketData?.activeListings 
    },
    { 
      id: 'listings' as TabType, 
      label: 'Listings', 
      icon: Squares2X2Icon, 
      count: zipCodeData.marketData?.activeListings 
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
                {marketData && (
                  <>
                    <div className="flex items-center gap-1">
                      <HomeIcon className="w-4 h-4" />
                      <span>{marketData.activeListings} Active Listings</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CurrencyDollarIcon className="w-4 h-4" />
                      <span>Median: {formatPrice(marketData.medianPrice)}</span>
                    </div>
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
      {activeTab === 'market' && marketData && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Market Statistics for {zipCodeData.zipCode}
            </h2>

            {/* Market Temperature */}
            <div className={`rounded-xl p-6 mb-8 border ${getMarketTempBg(marketData.marketTemperature)}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Market Temperature</h3>
                <span className={`text-lg font-bold ${getMarketTempColor(marketData.marketTemperature)} capitalize`}>
                  {marketData.marketTemperature}
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                {marketData.marketTemperature === 'hot' 
                  ? 'Homes are selling fast with high competition' 
                  : marketData.marketTemperature === 'warm'
                  ? 'Active market with steady demand'
                  : marketData.marketTemperature === 'cool' 
                  ? 'Buyers have more negotiating power'
                  : 'Buyer-friendly market with less competition'}
              </p>
            </div>

            {/* Market Overview */}
            <h3 className="text-lg font-bold text-gray-900 mb-4">Market Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                    <HomeIcon className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-sm text-gray-500">Active Listings</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{marketData.activeListings}</div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                    <CurrencyDollarIcon className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-sm text-gray-500">Median Price</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{formatPrice(marketData.medianPrice)}</div>
                <div className="flex items-center gap-1 mt-1">
                  {marketData.medianPrice > AUSTIN_METRO_MEDIAN ? (
                    <ArrowTrendingUpIcon className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-3.5 h-3.5 text-red-500" />
                  )}
                  <span className="text-xs text-gray-500">
                    {Math.round(((marketData.medianPrice - AUSTIN_METRO_MEDIAN) / AUSTIN_METRO_MEDIAN) * 100)}% vs metro avg
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-sm text-gray-500">Price/Sqft</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">${marketData.pricePerSqft}</div>
                <div className="flex items-center gap-1 mt-1">
                  {marketData.pricePerSqft > AUSTIN_METRO_PRICE_SQFT ? (
                    <ArrowTrendingUpIcon className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-3.5 h-3.5 text-red-500" />
                  )}
                  <span className="text-xs text-gray-500">Metro avg ${AUSTIN_METRO_PRICE_SQFT}</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                    <ClockIcon className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-sm text-gray-500">Avg Days on Market</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{marketData.avgDaysOnMarket}</div>
                <div className="text-xs text-gray-500 mt-1">days</div>
                <div className="flex items-center gap-1 mt-1">
                  {marketData.avgDaysOnMarket < AUSTIN_METRO_AVG_DOM ? (
                    <ArrowTrendingUpIcon className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-3.5 h-3.5 text-red-500" />
                  )}
                  <span className="text-xs text-gray-500">
                    {marketData.avgDaysOnMarket < AUSTIN_METRO_AVG_DOM ? 'Faster' : 'Slower'} than metro avg ({AUSTIN_METRO_AVG_DOM}d)
                  </span>
                </div>
              </div>
            </div>

            {/* vs Austin Metro Comparison */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5 text-spyglass-orange" />
                vs. Austin Metro Average
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-spyglass-orange/5 rounded-lg px-3 py-2 text-center">
                    <div className="text-sm font-bold text-gray-900">{formatPrice(marketData.medianPrice)}</div>
                    <div className="text-xs text-gray-500">This community</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                    <div className="text-sm font-bold text-gray-500">{formatPrice(AUSTIN_METRO_MEDIAN)}</div>
                    <div className="text-xs text-gray-400">Austin metro</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'listings' && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Active Listings in {zipCodeData.zipCode}
            </h2>
            <div className="bg-white rounded-xl p-6 text-center">
              <p className="text-gray-600 mb-4">
                View all active listings in the {zipCodeData.zipCode} area.
              </p>
              <a
                href={`/search?zip=${zipCodeData.zipCode}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                View {zipCodeData.zipCode} Listings
              </a>
            </div>
          </div>
        </div>
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
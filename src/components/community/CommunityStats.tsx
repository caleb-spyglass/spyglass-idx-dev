'use client';

import { useState, useEffect } from 'react';
import { formatPrice, formatNumber } from '@/lib/utils';
import {
  HomeIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FireIcon,
} from '@heroicons/react/24/outline';

// ─── CONSTANTS ───────────────────────────────────────────────────────────
const AUSTIN_METRO_MEDIAN_PRICE = 550000;
const AUSTIN_METRO_AVG_DOM = 35;
const AUSTIN_METRO_PRICE_PER_SQFT = 275;

// ─── TYPES ───────────────────────────────────────────────────────────────
interface CommunityStats {
  activeListings: number;
  medianPrice: number;
  avgPrice: number;
  pricePerSqft: number;
  avgDaysOnMarket: number;
  minPrice: number;
  maxPrice: number;
  singleFamilyCount: number;
  condoCount: number;
  townhouseCount: number;
  avgBedrooms: number;
  avgBathrooms: number;
  avgSqft: number;
  under500k: number;
  range500kTo750k: number;
  range750kTo1m: number;
  over1m: number;
}

interface DemographicData {
  population: number;
  households: number;
  medianHouseholdIncome: number;
  medianAge: number;
  collegeEducatedPct: number;
  homeownershipRate: number;
  medianHomeValue: number;
  averageHouseholdSize: number;
  unemploymentRate: number;
  under18Pct: number;
}

interface CommunityStatsProps {
  communitySlug: string;
  communityName: string;
  /** Override the default stats API endpoint (e.g. for zip codes) */
  statsUrl?: string;
}

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────

type MarketTemp = 'hot' | 'warm' | 'cool' | 'cold';

function getMarketTemperature(avgDOM: number): MarketTemp {
  if (avgDOM <= 14) return 'hot';
  if (avgDOM <= 30) return 'warm';
  if (avgDOM <= 60) return 'cool';
  return 'cold';
}

function getMarketTempConfig(temp: MarketTemp) {
  switch (temp) {
    case 'hot':
      return {
        label: 'Hot',
        color: 'text-red-600',
        bgColor: 'bg-red-600',
        bgLight: 'bg-red-50',
        borderColor: 'border-red-200',
        emoji: '🔥',
        description: 'Homes are selling fast',
        width: '90%',
      };
    case 'warm':
      return {
        label: 'Warm',
        color: 'text-orange-500',
        bgColor: 'bg-orange-500',
        bgLight: 'bg-orange-50',
        borderColor: 'border-orange-200',
        emoji: '☀️',
        description: 'Active market with steady demand',
        width: '65%',
      };
    case 'cool':
      return {
        label: 'Cool',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500',
        bgLight: 'bg-blue-50',
        borderColor: 'border-blue-200',
        emoji: '❄️',
        description: 'Buyers have more negotiating power',
        width: '40%',
      };
    case 'cold':
      return {
        label: 'Cold',
        color: 'text-blue-800',
        bgColor: 'bg-blue-800',
        bgLight: 'bg-blue-50',
        borderColor: 'border-blue-200',
        emoji: '🧊',
        description: 'Buyer-friendly market with less competition',
        width: '20%',
      };
  }
}

function getMarketType(avgDOM: number): string {
  if (avgDOM <= 21) return "a seller's market";
  if (avgDOM <= 40) return 'a balanced market';
  return "a buyer's market";
}

function getPriceComparison(medianPrice: number): string {
  const pctDiff = ((medianPrice - AUSTIN_METRO_MEDIAN_PRICE) / AUSTIN_METRO_MEDIAN_PRICE) * 100;
  const absPct = Math.abs(Math.round(pctDiff));
  if (absPct < 3) return 'right around the Austin metro average';
  if (pctDiff > 0) return `${absPct}% above the Austin metro average`;
  return `${absPct}% below the Austin metro average`;
}

function generateMarketSnapshot(name: string, stats: CommunityStats): string {
  const marketType = getMarketType(stats.avgDaysOnMarket);
  const priceComparison = getPriceComparison(stats.medianPrice);

  return `${name} is ${marketType} with homes averaging ${stats.avgDaysOnMarket} days before selling. The median listing price of ${formatPrice(stats.medianPrice)} is ${priceComparison}. With ${stats.activeListings} active listings and an average price of ${formatPrice(stats.avgPrice)}, buyers will find homes ranging from ${formatPrice(stats.minPrice)} to ${formatPrice(stats.maxPrice)}.`;
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  comparison,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  subtext?: string;
  comparison?: { direction: 'up' | 'down' | 'neutral'; text: string };
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-red-600" />
        </div>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {subtext && <div className="text-xs text-gray-500 mt-1">{subtext}</div>}
      {comparison && (
        <div className="flex items-center gap-1 mt-1.5">
          {comparison.direction === 'up' && (
            <ArrowTrendingUpIcon className="w-3.5 h-3.5 text-green-600" />
          )}
          {comparison.direction === 'down' && (
            <ArrowTrendingDownIcon className="w-3.5 h-3.5 text-red-500" />
          )}
          <span className="text-xs text-gray-500">{comparison.text}</span>
        </div>
      )}
    </div>
  );
}

function MarketSnapshotCard({
  communityName,
  stats,
}: {
  communityName: string;
  stats: CommunityStats;
}) {
  const temp = getMarketTemperature(stats.avgDaysOnMarket);
  const tempConfig = getMarketTempConfig(temp);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <FireIcon className="w-5 h-5 text-spyglass-orange" />
        <h3 className="font-semibold text-gray-900">Market Snapshot</h3>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed mb-4">
        {generateMarketSnapshot(communityName, stats)}
      </p>

      {/* Market Temperature Gauge */}
      <div
        className={`rounded-xl p-4 ${tempConfig.bgLight} border ${tempConfig.borderColor}`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Market Temperature</span>
          <span className={`text-sm font-bold ${tempConfig.color} flex items-center gap-1`}>
            {tempConfig.emoji} {tempConfig.label}
          </span>
        </div>
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${tempConfig.bgColor} rounded-full transition-all duration-700`}
            style={{ width: tempConfig.width }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">{tempConfig.description}</p>
      </div>
    </div>
  );
}

function MetroComparisonCard({ stats }: { stats: CommunityStats }) {
  const priceDiff =
    ((stats.medianPrice - AUSTIN_METRO_MEDIAN_PRICE) / AUSTIN_METRO_MEDIAN_PRICE) * 100;
  const domDiff =
    ((stats.avgDaysOnMarket - AUSTIN_METRO_AVG_DOM) / AUSTIN_METRO_AVG_DOM) * 100;
  const ppsqftDiff =
    ((stats.pricePerSqft - AUSTIN_METRO_PRICE_PER_SQFT) / AUSTIN_METRO_PRICE_PER_SQFT) * 100;

  const comparisons = [
    {
      label: 'Median Price',
      local: formatPrice(stats.medianPrice),
      metro: formatPrice(AUSTIN_METRO_MEDIAN_PRICE),
      diff: priceDiff,
      higherIsBetter: true,
    },
    {
      label: 'Avg Days on Market',
      local: `${stats.avgDaysOnMarket}`,
      metro: `${AUSTIN_METRO_AVG_DOM}`,
      diff: domDiff,
      higherIsBetter: false,
    },
    {
      label: 'Price / Sqft',
      local: `$${stats.pricePerSqft}`,
      metro: `$${AUSTIN_METRO_PRICE_PER_SQFT}`,
      diff: ppsqftDiff,
      higherIsBetter: true,
    },
  ];

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <ChartBarIcon className="w-5 h-5 text-spyglass-orange" />
        vs. Austin Metro Average
      </h3>
      <div className="space-y-4">
        {comparisons.map((comp, i) => {
          const absDiff = Math.abs(Math.round(comp.diff));
          const isHigher = comp.diff > 0;
          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">{comp.label}</span>
                <div className="flex items-center gap-2">
                  {absDiff >= 3 && (
                    <span
                      className={`text-xs font-medium flex items-center gap-0.5 ${
                        isHigher ? 'text-green-600' : 'text-red-500'
                      }`}
                    >
                      {isHigher ? (
                        <ArrowTrendingUpIcon className="w-3 h-3" />
                      ) : (
                        <ArrowTrendingDownIcon className="w-3 h-3" />
                      )}
                      {absDiff}%
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-spyglass-orange/5 rounded-lg px-3 py-2 text-center">
                  <div className="text-sm font-bold text-gray-900">{comp.local}</div>
                  <div className="text-xs text-gray-500">This community</div>
                </div>
                <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                  <div className="text-sm font-bold text-gray-500">{comp.metro}</div>
                  <div className="text-xs text-gray-400">Austin metro</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PriceRangeBar({ stats }: { stats: CommunityStats }) {
  const total =
    stats.under500k + stats.range500kTo750k + stats.range750kTo1m + stats.over1m;
  if (total === 0) return null;

  const segments = [
    { label: 'Under $500K', count: stats.under500k, color: 'bg-green-500' },
    { label: '$500K-$750K', count: stats.range500kTo750k, color: 'bg-blue-500' },
    { label: '$750K-$1M', count: stats.range750kTo1m, color: 'bg-purple-500' },
    { label: '$1M+', count: stats.over1m, color: 'bg-red-500' },
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-3">Price Distribution</h3>
      <div className="h-4 rounded-full overflow-hidden flex mb-3">
        {segments.map((seg, i) => (
          <div
            key={i}
            className={`${seg.color} transition-all`}
            style={{ width: `${(seg.count / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className={`w-3 h-3 rounded ${seg.color}`} />
            <span className="text-gray-600">{seg.label}</span>
            <span className="text-gray-900 font-medium ml-auto">{seg.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PropertyTypeMix({ stats }: { stats: CommunityStats }) {
  const types = [
    { label: 'Single Family', count: stats.singleFamilyCount, icon: '🏠' },
    { label: 'Condo', count: stats.condoCount, icon: '🏢' },
    { label: 'Townhouse', count: stats.townhouseCount, icon: '🏘️' },
  ].filter((t) => t.count > 0);

  if (types.length === 0) return null;

  const total = types.reduce((a, t) => a + t.count, 0);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-3">Property Types</h3>
      <div className="space-y-2">
        {types.map((type, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xl">{type.icon}</span>
            <span className="text-gray-700 flex-1">{type.label}</span>
            <span className="text-gray-500 text-sm">
              {Math.round((type.count / total) * 100)}%
            </span>
            <span className="font-medium text-gray-900 w-8 text-right">{type.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────

export default function CommunityStats({
  communitySlug,
  communityName,
  statsUrl,
}: CommunityStatsProps) {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [demographics, setDemographics] = useState<DemographicData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const url = statsUrl || `/api/communities/${communitySlug}/stats`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch community stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [communitySlug]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="bg-gray-200 rounded-xl h-32" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats || stats.activeListings === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <p className="text-gray-500">
          No active listings in {communityName} at this time.
        </p>
      </div>
    );
  }

  // Price comparison helpers for stat cards
  const priceVsMetro = stats.medianPrice >= AUSTIN_METRO_MEDIAN_PRICE ? 'up' : 'down';
  const pricePctDiff = Math.abs(
    Math.round(
      ((stats.medianPrice - AUSTIN_METRO_MEDIAN_PRICE) / AUSTIN_METRO_MEDIAN_PRICE) * 100
    )
  );
  const domVsMetro = stats.avgDaysOnMarket <= AUSTIN_METRO_AVG_DOM ? 'up' : 'down';

  return (
    <div className="space-y-6">
      {/* Market Snapshot — the headline interpretation */}
      <MarketSnapshotCard communityName={communityName} stats={stats} />

      {/* Market Overview stat cards */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Market Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={HomeIcon}
            label="Active Listings"
            value={stats.activeListings}
          />
          <StatCard
            icon={CurrencyDollarIcon}
            label="Median Price"
            value={formatPrice(stats.medianPrice)}
            comparison={
              pricePctDiff >= 3
                ? {
                    direction: priceVsMetro as 'up' | 'down',
                    text: `${pricePctDiff}% ${priceVsMetro === 'up' ? 'above' : 'below'} metro avg`,
                  }
                : { direction: 'neutral', text: 'Near metro average' }
            }
          />
          <StatCard
            icon={ChartBarIcon}
            label="Price/Sqft"
            value={`$${stats.pricePerSqft}`}
            comparison={{
              direction:
                stats.pricePerSqft >= AUSTIN_METRO_PRICE_PER_SQFT ? 'up' : 'down',
              text: `Metro avg $${AUSTIN_METRO_PRICE_PER_SQFT}`,
            }}
          />
          <StatCard
            icon={ClockIcon}
            label="Avg Days on Market"
            value={stats.avgDaysOnMarket}
            subtext="days"
            comparison={{
              direction: domVsMetro,
              text:
                domVsMetro === 'up'
                  ? `Faster than metro avg (${AUSTIN_METRO_AVG_DOM}d)`
                  : `Slower than metro avg (${AUSTIN_METRO_AVG_DOM}d)`,
            }}
          />
        </div>
      </div>

      {/* Metro Comparison + Price Distribution */}
      <div className="grid md:grid-cols-2 gap-4">
        <MetroComparisonCard stats={stats} />
        <PriceRangeBar stats={stats} />
      </div>

      {/* Property Details */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Property Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={HomeIcon}
            label="Avg Size"
            value={`${formatNumber(stats.avgSqft)} sqft`}
          />
          <StatCard
            icon={HomeIcon}
            label="Avg Bedrooms"
            value={stats.avgBedrooms}
          />
          <StatCard
            icon={HomeIcon}
            label="Avg Bathrooms"
            value={stats.avgBathrooms}
          />
          <StatCard
            icon={CurrencyDollarIcon}
            label="Price Range"
            value={`${formatPrice(stats.minPrice)} - ${formatPrice(stats.maxPrice)}`}
          />
        </div>
      </div>

      {/* Property Type Mix */}
      <div className="grid md:grid-cols-2 gap-4">
        <PropertyTypeMix stats={stats} />
      </div>

      {/* Demographics placeholder */}
      {demographics && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Demographics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={UserGroupIcon}
              label="Population"
              value={formatNumber(demographics.population)}
            />
            <StatCard
              icon={CurrencyDollarIcon}
              label="Median Income"
              value={formatPrice(demographics.medianHouseholdIncome)}
            />
            <StatCard
              icon={AcademicCapIcon}
              label="College Educated"
              value={`${demographics.collegeEducatedPct}%`}
            />
            <StatCard
              icon={BuildingOfficeIcon}
              label="Homeownership"
              value={`${demographics.homeownershipRate}%`}
            />
          </div>
        </div>
      )}

      {/* Source attribution */}
      <p className="text-xs text-gray-400 text-center">
        Market data from Austin MLS. Updated daily. Austin metro averages are approximate.
      </p>
    </div>
  );
}

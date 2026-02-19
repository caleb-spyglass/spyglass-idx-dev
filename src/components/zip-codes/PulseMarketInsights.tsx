/**
 * Pulse Market Insights Component
 * 
 * Displays comprehensive market data from Mission Control's Pulse API
 * for the 4 test zip codes: 78701, 78702, 78703, 78704
 */

'use client';

import { PulseZipSummary, formatPulseCurrency, formatPulseNumber } from '@/lib/pulse-api';
import {
  HomeIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  AcademicCapIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';

interface PulseMarketInsightsProps {
  pulseData: PulseZipSummary;
  className?: string;
}

interface InsightCard {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export default function PulseMarketInsights({ pulseData, className = '' }: PulseMarketInsightsProps) {
  const metrics = pulseData.metrics || {};

  const insights: InsightCard[] = [
    {
      title: 'Home Value',
      value: formatPulseCurrency(metrics.home_value || 0),
      subtitle: 'Median home value',
      icon: HomeIcon,
      trend: (metrics.home_value_growth_yoy || 0) >= 0 ? 'up' : 'down',
      trendValue: `${(metrics.home_value_growth_yoy || 0) >= 0 ? '+' : ''}${metrics.home_value_growth_yoy || 0}% YoY`,
    },
    {
      title: 'Market Forecast',
      value: `${(metrics.home_price_forecast || 0) >= 0 ? '+' : ''}${metrics.home_price_forecast || 0}%`,
      subtitle: '12-month outlook',
      icon: ChartBarIcon,
      trend: (metrics.home_price_forecast || 0) >= 0 ? 'up' : 'down',
    },
    {
      title: 'Days on Market',
      value: `${Math.round(metrics.days_on_market || 0)}`,
      subtitle: 'Average days to sell',
      icon: ClockIcon,
    },
    {
      title: 'Active Inventory',
      value: formatPulseNumber(metrics.for_sale_inventory || 0),
      subtitle: 'Homes for sale',
      icon: BuildingOffice2Icon,
    },
    {
      title: 'Median Income',
      value: formatPulseCurrency(metrics.median_income || 0),
      subtitle: 'Household income',
      icon: CurrencyDollarIcon,
      trend: (metrics.income_growth || 0) >= 0 ? 'up' : 'down',
      trendValue: `${(metrics.income_growth || 0) >= 0 ? '+' : ''}${metrics.income_growth || 0}% YoY`,
    },
    {
      title: 'Population',
      value: formatPulseNumber(metrics.population || 0),
      subtitle: 'Total residents',
      icon: UserGroupIcon,
      trend: (metrics.population_growth || 0) >= 0 ? 'up' : 'down',
      trendValue: `${(metrics.population_growth || 0) >= 0 ? '+' : ''}${metrics.population_growth || 0}% YoY`,
    },
    {
      title: 'College Degrees',
      value: `${metrics.college_degree_rate || 0}%`,
      subtitle: 'Adults with degrees',
      icon: AcademicCapIcon,
    },
    {
      title: 'Remote Work',
      value: `${metrics.remote_work_pct || 0}%`,
      subtitle: 'Work from home',
      icon: ComputerDesktopIcon,
    }
  ];

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            Market Insights - {pulseData.zip}
          </h3>
          <p className="text-gray-600 text-sm">
            Real-time data from Pulse API • Updated {pulseData.dataDate}
          </p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          LIVE DATA
        </div>
      </div>

      {/* Market Health Scores */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{pulseData.scores?.appreciation || 0}</div>
          <div className="text-xs text-gray-600 uppercase tracking-wide">Appreciation Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{pulseData.scores?.daysOnMarket || 0}</div>
          <div className="text-xs text-gray-600 uppercase tracking-wide">Market Speed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{pulseData.scores?.inventory || 0}</div>
          <div className="text-xs text-gray-600 uppercase tracking-wide">Inventory Health</div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <Icon className="w-5 h-5 text-gray-500 mt-0.5" />
                {insight.trend && (
                  <div className={`flex items-center gap-1 text-xs ${
                    insight.trend === 'up' 
                      ? 'text-green-600' 
                      : insight.trend === 'down'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}>
                    {insight.trend === 'up' && <ArrowTrendingUpIcon className="w-3 h-3" />}
                    {insight.trend === 'down' && <ArrowTrendingDownIcon className="w-3 h-3" />}
                    {insight.trendValue}
                  </div>
                )}
              </div>
              <div className="text-lg font-bold text-gray-900 mb-1">{insight.value}</div>
              <div className="text-xs text-gray-600">{insight.subtitle}</div>
            </div>
          );
        })}
      </div>

      {/* Best Months */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-green-800 font-medium mb-1">Best Month to Buy</div>
          <div className="text-green-900 font-bold text-lg">{pulseData.bestMonthBuy}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-orange-800 font-medium mb-1">Best Month to Sell</div>
          <div className="text-orange-900 font-bold text-lg">{pulseData.bestMonthSell}</div>
        </div>
      </div>

      {/* Advanced Metrics */}
      {(metrics.value_income_ratio || metrics.mortgage_payment || metrics.cap_rate) && (
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-900 mb-3">Investment Metrics</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            {metrics.value_income_ratio && (
              <div>
                <div className="text-gray-600">Value/Income Ratio</div>
                <div className="font-semibold">{metrics.value_income_ratio.toFixed(1)}x</div>
              </div>
            )}
            {metrics.mortgage_payment && (
              <div>
                <div className="text-gray-600">Est. Mortgage Payment</div>
                <div className="font-semibold">{formatPulseCurrency(metrics.mortgage_payment)}/mo</div>
              </div>
            )}
            {metrics.cap_rate && (
              <div>
                <div className="text-gray-600">Cap Rate</div>
                <div className="font-semibold">{metrics.cap_rate}%</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Data Source Footer */}
      <div className="border-t pt-4 mt-4">
        <p className="text-xs text-gray-500">
          Data sources: {pulseData.source} • Market analysis powered by Mission Control Pulse
        </p>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { PropertyData, EstimateData, QualificationData, ContactData } from './HomeValueFlow';
import { searchListings } from '@/lib/repliers-api';
import { getPulseZipSummary } from '@/lib/pulse-api';
import Link from 'next/link';

interface ReportPreviewProps {
  propertyData: PropertyData;
  estimateData: EstimateData;
  qualificationData: QualificationData;
  contactData: ContactData;
  onStartOver: () => void;
}

interface Comparable {
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  daysAgo: number;
}

export function ReportPreview({ 
  propertyData, 
  estimateData, 
  qualificationData, 
  contactData,
  onStartOver 
}: ReportPreviewProps) {
  const [comparables, setComparables] = useState<Comparable[]>([]);
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportData();
  }, [propertyData]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const loadReportData = async () => {
    try {
      // Load comparable sales
      if (propertyData.city && propertyData.state) {
        const compsResponse = await searchListings({
          city: propertyData.city,
          status: ['Sold'],
          pageSize: 5,
          sort: 'date-desc'
        });

        const comps = compsResponse.listings.map(listing => ({
          address: listing.address.street,
          price: listing.price,
          beds: listing.bedrooms,
          baths: listing.bathrooms,
          sqft: listing.sqft,
          daysAgo: listing.listDate ? Math.floor((Date.now() - new Date(listing.listDate).getTime()) / (1000 * 60 * 60 * 24)) : 30
        }));

        setComparables(comps);
      }

      // Load market data if available
      if (propertyData.zip) {
        const pulseData = await getPulseZipSummary(propertyData.zip);
        setMarketData(pulseData);
      }
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate adjusted estimate
  const conditionMultipliers = {
    'excellent': 1.05,
    'good': 1.0,
    'fair': 0.95,
    'needs-work': 0.85
  };

  const multiplier = qualificationData.condition ? conditionMultipliers[qualificationData.condition] : 1.0;
  const finalEstimate = {
    low: Math.round(estimateData.lowEstimate * multiplier),
    high: Math.round(estimateData.highEstimate * multiplier)
  };

  const getConditionLabel = (condition: string) => {
    const labels = {
      'excellent': 'Excellent',
      'good': 'Good',
      'fair': 'Fair',
      'needs-work': 'Needs Work'
    };
    return labels[condition as keyof typeof labels] || condition;
  };

  const getTimelineLabel = (timeline: string) => {
    const labels = {
      'asap': 'ASAP (0-3 months)',
      'this-year': 'This Year',
      'curious': 'Just Curious',
      'exploring': 'Exploring Options'
    };
    return labels[timeline as keyof typeof labels] || timeline;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full mb-4 text-2xl">
            ✓
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Home Valuation Report
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Thank you! Your detailed analysis has been sent to <strong>{contactData.email}</strong>
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Report delivered to your inbox
          </div>
        </div>

        {/* Main Property Value */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
              Estimated Home Value
            </h2>
            <div className="text-4xl md:text-6xl font-bold text-spyglass-orange mb-4">
              {formatPrice(finalEstimate.low)} - {formatPrice(finalEstimate.high)}
            </div>
            <div className="text-lg text-gray-600 mb-6">
              {propertyData.address}, {propertyData.city}, {propertyData.state} {propertyData.zip}
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="h-2 bg-gray-200 rounded-full w-48">
                <div 
                  className="h-2 bg-gradient-to-r from-green-400 to-spyglass-orange rounded-full"
                  style={{ width: `${estimateData.confidence}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">{estimateData.confidence}% confident</span>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-gray-600">Property Condition</div>
                <div className="font-semibold">{getConditionLabel(qualificationData.condition || '')}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-gray-600">Selling Timeline</div>
                <div className="font-semibold">{getTimelineLabel(qualificationData.timeline || '')}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Comparable Sales */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Comparable Sales</h3>
            
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : comparables.length > 0 ? (
              <div className="space-y-4">
                {comparables.slice(0, 4).map((comp, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-gray-900">{comp.address}</div>
                      <div className="text-lg font-bold text-spyglass-orange">{formatPrice(comp.price)}</div>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>{comp.beds} beds</span>
                      <span>{comp.baths} baths</span>
                      <span>{comp.sqft.toLocaleString()} sq ft</span>
                      <span>Sold {comp.daysAgo} days ago</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p>Comparable sales data will be included in your detailed email report.</p>
              </div>
            )}
          </div>

          {/* Market Insights */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Market Insights</h3>
            
            {marketData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-spyglass-orange">
                      {marketData.metrics.days_on_market || 30}
                    </div>
                    <div className="text-sm text-gray-600">Avg Days on Market</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-spyglass-orange">
                      {marketData.metrics.home_value_growth_yoy ? 
                        (marketData.metrics.home_value_growth_yoy > 0 ? '+' : '') + 
                        marketData.metrics.home_value_growth_yoy.toFixed(1) + '%' 
                        : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">YoY Price Change</div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Market Forecast</h4>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      marketData.forecast.direction === 'up' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm text-gray-600">
                      {marketData.forecast.direction === 'up' ? '↗' : '↘'} 
                      {Math.abs(marketData.forecast.value)}% predicted change
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-spyglass-orange">28</div>
                    <div className="text-sm text-gray-600">Avg Days on Market</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-spyglass-orange">+2.1%</div>
                    <div className="text-sm text-gray-600">YoY Price Change</div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Austin Market Trends</h4>
                  <p className="text-sm text-gray-600">
                    The Austin market continues to show strength with steady appreciation and moderate inventory levels.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-spyglass-orange/5 border border-spyglass-orange/20 rounded-lg">
              <h4 className="font-semibold text-spyglass-orange mb-2">Best Time to Sell</h4>
              <p className="text-sm text-gray-600">
                {marketData?.bestMonthSell 
                  ? `Based on historical data, ${marketData.bestMonthSell} is typically the best month to list your home.`
                  : 'Spring and early summer are traditionally the best seasons to list your home for sale.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-spyglass-charcoal text-white rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Take the Next Step?</h3>
            <p className="text-gray-300 text-lg">
              Questions about your home value or thinking about selling? Our local experts are here to help.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="bg-spyglass-orange hover:bg-spyglass-orange-hover px-8 py-3 rounded-lg font-semibold text-center transition-colors"
            >
              Speak with an Agent
            </Link>
            <Link
              href="/sell"
              className="border-2 border-white text-white hover:bg-white hover:text-spyglass-charcoal px-8 py-3 rounded-lg font-semibold text-center transition-colors"
            >
              Learn About Selling
            </Link>
            <button
              onClick={onStartOver}
              className="border-2 border-gray-400 text-gray-300 hover:border-white hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Value Another Home
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p className="text-sm">
            This estimate is based on automated analysis of public records and recent sales data. 
            For a comprehensive market analysis, consult with a Spyglass Realty agent.
          </p>
          <div className="mt-4 flex justify-center items-center gap-4 text-xs">
            <span>Powered by Spyglass Realty</span>
            <span>•</span>
            <span>Data from Austin MLS</span>
            <span>•</span>
            <span>Updated {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
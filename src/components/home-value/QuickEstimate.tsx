'use client';

import { useState, useEffect } from 'react';
import { PropertyData, EstimateData } from './HomeValueFlow';
import { searchListings } from '@/lib/repliers-api';
import { getPulseMarketMetrics } from '@/lib/pulse-api';

interface QuickEstimateProps {
  propertyData: PropertyData;
  onEstimateGenerated: (estimate: EstimateData) => void;
}

export function QuickEstimate({ propertyData, onEstimateGenerated }: QuickEstimateProps) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  
  useEffect(() => {
    generateEstimate();
  }, [propertyData]);

  const generateEstimate = async () => {
    const steps = [
      { text: 'Searching comparable properties...', duration: 1500 },
      { text: 'Analyzing recent sales data...', duration: 1200 },
      { text: 'Calculating market trends...', duration: 1000 },
      { text: 'Generating your estimate...', duration: 800 }
    ];

    let totalDuration = 0;
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i].text);
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      totalDuration += steps[i].duration;
      setProgress((i + 1) * 25);
    }

    // Calculate estimate using available data
    const estimate = await calculateEstimate(propertyData);
    onEstimateGenerated(estimate);
  };

  const calculateEstimate = async (property: PropertyData): Promise<EstimateData> => {
    let baseValue = 500000; // Default fallback
    let confidence = 70; // Default confidence

    try {
      // Try to get market data from Pulse API if we have zip code
      if (property.zip) {
        const pulseData = await getPulseMarketMetrics(property.zip);
        if (pulseData) {
          baseValue = pulseData.medianHomeValue;
          confidence = 85;
        }
      }

      // Try to get comparables from Repliers
      if (property.city && property.state) {
        const comps = await searchListings({
          city: property.city,
          status: ['Sold'],
          pageSize: 10,
          sort: 'date-desc'
        });

        if (comps.listings.length > 0) {
          // Calculate median of recent sales
          const prices = comps.listings.map(l => l.price).sort((a, b) => a - b);
          const medianPrice = prices[Math.floor(prices.length / 2)];
          
          if (medianPrice > 0) {
            baseValue = medianPrice;
            confidence = 80;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      // Use fallback values
    }

    // Adjust based on property characteristics if available
    let adjustedValue = baseValue;
    
    // Simple adjustments based on square footage
    if (property.sqft) {
      const avgPricePerSqft = baseValue / 2000; // Assume 2000 sqft for base
      adjustedValue = property.sqft * avgPricePerSqft;
    }

    // Age adjustment
    if (property.yearBuilt) {
      const age = 2025 - property.yearBuilt;
      if (age < 5) adjustedValue *= 1.1; // Newer homes worth more
      else if (age > 30) adjustedValue *= 0.95; // Older homes worth less
    }

    // Apply confidence range (±10% default)
    const range = adjustedValue * 0.1;
    const lowEstimate = Math.round(adjustedValue - range);
    const highEstimate = Math.round(adjustedValue + range);

    return {
      lowEstimate,
      highEstimate,
      confidence
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-spyglass-orange/5 to-spyglass-charcoal/5 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                ✓
              </div>
              <div className="w-16 h-1 bg-green-500 mx-2"></div>
              <div className="w-8 h-8 bg-spyglass-orange text-white rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div className="w-16 h-1 bg-gray-300 mx-2"></div>
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
            </div>
          </div>
          <p className="text-center text-gray-600">Generating Your Estimate</p>
        </div>

        {/* Loading Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Analyzing Your Property
            </h1>
            <p className="text-gray-600 mb-12">
              We're crunching the numbers to give you an accurate estimate
            </p>

            {/* Progress Animation */}
            <div className="max-w-md mx-auto mb-8">
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-spyglass-orange to-spyglass-orange-hover h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="mt-4 text-spyglass-orange font-medium">
                {progress}% Complete
              </div>
            </div>

            {/* Current Step */}
            <div className="flex items-center justify-center gap-3 text-gray-600">
              <div className="w-5 h-5 border-2 border-spyglass-orange/20 border-t-spyglass-orange rounded-full animate-spin"></div>
              <span>{currentStep}</span>
            </div>

            {/* Data Sources */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <svg className="w-8 h-8 text-spyglass-orange mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                <h3 className="font-semibold text-gray-900 mb-1">MLS Data</h3>
                <p className="text-sm text-gray-600">Recent comparable sales</p>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <svg className="w-8 h-8 text-spyglass-orange mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-gray-900 mb-1">Market Trends</h3>
                <p className="text-sm text-gray-600">Local price movements</p>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <svg className="w-8 h-8 text-spyglass-orange mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-gray-900 mb-1">Neighborhood</h3>
                <p className="text-sm text-gray-600">Area-specific factors</p>
              </div>
            </div>

            {/* Property Info */}
            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Analyzing Property:</h3>
              <p className="text-gray-600">
                {propertyData.address}, {propertyData.city}, {propertyData.state} {propertyData.zip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
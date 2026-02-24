'use client';

import { useState, useEffect } from 'react';
import { getPulseZipSummary, shouldUsePulseData, formatPulseCurrency, formatPulseNumber } from '@/lib/pulse-api';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface MapDiagnosticsProps {
  zipCode: string;
}

export function MapDiagnostics({ zipCode }: MapDiagnosticsProps) {
  const [pulseData, setPulseData] = useState<any>(null);
  const [pulseLoading, setPulseLoading] = useState(false);
  const [pulseError, setPulseError] = useState<string | null>(null);
  const [mapboxAvailable, setMapboxAvailable] = useState(false);

  useEffect(() => {
    // Check Mapbox availability
    setMapboxAvailable(!!MAPBOX_TOKEN);

    // Test Pulse API if this is a test zip code
    if (shouldUsePulseData(zipCode)) {
      setPulseLoading(true);
      getPulseZipSummary(zipCode)
        .then((data) => {
          setPulseData(data);
          setPulseError(null);
        })
        .catch((error) => {
          setPulseError(error.message);
          setPulseData(null);
        })
        .finally(() => {
          setPulseLoading(false);
        });
    }
  }, [zipCode]);

  const diagnostics = [
    {
      name: 'Mapbox Integration',
      status: mapboxAvailable ? 'pass' : 'fail',
      message: mapboxAvailable ? 'Token configured' : 'Token missing',
    },
    {
      name: 'Pulse API Eligibility',
      status: shouldUsePulseData(zipCode) ? 'pass' : 'info',
      message: shouldUsePulseData(zipCode) ? 'Enhanced data available' : 'Standard data only',
    },
    {
      name: 'Pulse Data Loading',
      status: pulseLoading ? 'loading' : pulseError ? 'fail' : pulseData ? 'pass' : 'info',
      message: pulseLoading ? 'Testing API...' : pulseError ? `Error: ${pulseError}` : pulseData ? 'Data loaded successfully' : 'Not applicable',
    },
  ];

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 className="text-sm font-semibold text-gray-900">Map System Status</h3>
      </div>
      
      <div className="space-y-2">
        {diagnostics.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{item.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{item.message}</span>
              <div className={`w-2 h-2 rounded-full ${
                item.status === 'pass' ? 'bg-green-400' :
                item.status === 'fail' ? 'bg-red-400' :
                item.status === 'loading' ? 'bg-yellow-400 animate-pulse' :
                'bg-gray-300'
              }`} />
            </div>
          </div>
        ))}
      </div>

      {pulseData && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Market Data Preview</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Home Value:</span>
              <span className="ml-1 font-medium">{formatPulseCurrency(pulseData.metrics?.home_value || 0)}</span>
            </div>
            <div>
              <span className="text-gray-500">YoY Change:</span>
              <span className={`ml-1 font-medium ${(pulseData.metrics?.home_value_growth_yoy || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {pulseData.metrics?.home_value_growth_yoy?.toFixed(1) || 0}%
              </span>
            </div>
            <div>
              <span className="text-gray-500">Days on Market:</span>
              <span className="ml-1 font-medium">{pulseData.metrics?.days_on_market || 0}</span>
            </div>
            <div>
              <span className="text-gray-500">Inventory:</span>
              <span className="ml-1 font-medium">{formatPulseNumber(pulseData.metrics?.for_sale_inventory || 0)}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-500">
        <span>Zip Code: {zipCode} • Diagnostics updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
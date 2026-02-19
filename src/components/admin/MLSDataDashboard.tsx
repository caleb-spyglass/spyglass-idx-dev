'use client';

import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  MapPinIcon,
  HomeIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface MLSStats {
  totalCommunities: number;
  communitiesWithListings: number;
  totalActiveListings: number;
  averageMedianPrice: number;
  lastUpdated: Date;
  topCommunities: Array<{
    name: string;
    slug: string;
    listingsCount: number;
    medianPrice: number;
  }>;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  syncMessage?: string;
}

interface MLSDataDashboardProps {
  /** Initial stats data */
  initialStats?: MLSStats;
  /** Show admin controls */
  showControls?: boolean;
}

export default function MLSDataDashboard({ 
  initialStats, 
  showControls = true 
}: MLSDataDashboardProps) {
  const [stats, setStats] = useState<MLSStats>(initialStats || {
    totalCommunities: 0,
    communitiesWithListings: 0,
    totalActiveListings: 0,
    averageMedianPrice: 0,
    lastUpdated: new Date(),
    topCommunities: [],
    syncStatus: 'idle',
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!initialStats) {
      loadStats();
    }
  }, [initialStats]);

  async function loadStats() {
    try {
      const response = await fetch('/api/admin/mls-stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load MLS stats:', error);
    }
  }

  async function refreshMLSData() {
    setIsRefreshing(true);
    setStats(prev => ({ ...prev, syncStatus: 'syncing', syncMessage: 'Refreshing MLS data...' }));

    try {
      const response = await fetch('/api/admin/sync-mls', { method: 'POST' });
      const result = await response.json();
      
      if (response.ok) {
        setStats(prev => ({ 
          ...prev, 
          syncStatus: 'success', 
          syncMessage: `Successfully synced ${result.communitiesProcessed} communities` 
        }));
        
        // Reload stats after sync
        await loadStats();
      } else {
        throw new Error(result.error || 'Sync failed');
      }
    } catch (error) {
      setStats(prev => ({ 
        ...prev, 
        syncStatus: 'error', 
        syncMessage: `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }));
    } finally {
      setIsRefreshing(false);
    }
  }

  async function refreshCommunityCache() {
    setIsRefreshing(true);
    
    try {
      const response = await fetch('/api/admin/refresh-cache', { method: 'POST' });
      const result = await response.json();
      
      if (response.ok) {
        setStats(prev => ({ 
          ...prev, 
          syncStatus: 'success', 
          syncMessage: 'Cache refreshed successfully' 
        }));
      } else {
        throw new Error(result.error || 'Cache refresh failed');
      }
    } catch (error) {
      setStats(prev => ({ 
        ...prev, 
        syncStatus: 'error', 
        syncMessage: `Cache refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }));
    } finally {
      setIsRefreshing(false);
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">MLS Data Dashboard</h2>
          <p className="text-sm text-gray-600 mt-1">
            Live MLS data integration with Repliers API
          </p>
        </div>
        
        {showControls && (
          <div className="flex gap-3">
            <button
              onClick={refreshCommunityCache}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Clear Cache
            </button>
            <button
              onClick={refreshMLSData}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowPathIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Syncing...' : 'Sync MLS Data'}
            </button>
          </div>
        )}
      </div>

      {/* Sync Status */}
      {stats.syncStatus !== 'idle' && (
        <div className={`rounded-lg p-4 flex items-center gap-3 ${
          stats.syncStatus === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : stats.syncStatus === 'error'
            ? 'bg-red-50 border border-red-200'
            : 'bg-blue-50 border border-blue-200'
        }`}>
          {stats.syncStatus === 'success' && <CheckCircleIcon className="w-5 h-5 text-green-600" />}
          {stats.syncStatus === 'error' && <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />}
          {stats.syncStatus === 'syncing' && <ArrowPathIcon className="w-5 h-5 text-blue-600 animate-spin" />}
          
          <div>
            <div className={`font-medium ${
              stats.syncStatus === 'success' ? 'text-green-800' :
              stats.syncStatus === 'error' ? 'text-red-800' : 'text-blue-800'
            }`}>
              {stats.syncStatus === 'success' ? 'Sync Completed' :
               stats.syncStatus === 'error' ? 'Sync Failed' : 'Syncing...'}
            </div>
            {stats.syncMessage && (
              <div className={`text-sm ${
                stats.syncStatus === 'success' ? 'text-green-600' :
                stats.syncStatus === 'error' ? 'text-red-600' : 'text-blue-600'
              }`}>
                {stats.syncMessage}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPinIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalCommunities.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Communities</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <HomeIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.communitiesWithListings.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">With Active Listings</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalActiveListings.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Active Listings</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatPrice(stats.averageMedianPrice)}
              </div>
              <div className="text-sm text-gray-600">Avg Median Price</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Communities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Communities by Listings</h3>
          <p className="text-sm text-gray-600 mt-1">Communities with the most active MLS listings</p>
        </div>
        
        <div className="p-6">
          {stats.topCommunities.length > 0 ? (
            <div className="space-y-4">
              {stats.topCommunities.map((community, index) => (
                <div key={community.slug} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{community.name}</div>
                      <div className="text-sm text-gray-600">{community.listingsCount} active listings</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatPrice(community.medianPrice)}
                    </div>
                    <div className="text-sm text-gray-600">Median Price</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ChartBarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No community data available</p>
              <p className="text-sm text-gray-500">Run MLS sync to populate data</p>
            </div>
          )}
        </div>
      </div>

      {/* Last Updated */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <ClockIcon className="w-4 h-4" />
        <span>Last updated: {new Date(stats.lastUpdated).toLocaleString()}</span>
      </div>
    </div>
  );
}
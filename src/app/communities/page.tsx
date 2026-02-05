'use client';

import { useState, lazy, Suspense } from 'react';
import { Header } from '@/components/ui/Header';
import { communitiesData } from '@/data/communities-data';
import { CommunityPolygon } from '@/types/community';
import Link from 'next/link';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';

// Lazy load map
const CommunitiesMap = lazy(() => 
  import('@/components/map/CommunitiesMap').then(mod => ({ default: mod.CommunitiesMap }))
);

function MapLoadingFallback() {
  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  );
}

// Group communities by county
const groupedCommunities = {
  'Austin Featured': communitiesData.filter(c => c.county === 'featured'),
  'Travis County': communitiesData.filter(c => c.county === 'Travis'),
  'Williamson County': communitiesData.filter(c => c.county === 'Williamson'),
  'Hays County': communitiesData.filter(c => c.county === 'Hays'),
};

export default function CommunitiesPage() {
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityPolygon | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const filteredCommunities = searchQuery
    ? communitiesData.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Austin Communities</h1>
          <p className="text-lg text-gray-300 max-w-3xl mb-8">
            Discover the heart of Austin through its unique neighborhoods. From the eclectic streets of 
            East Austin to the serene hills of Westlake, find your perfect community.
          </p>
          
          {/* Search */}
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search communities..."
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <p className="text-gray-600">
          {communitiesData.length} communities in the Austin area
        </p>
        <div className="flex bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'grid' 
                ? 'bg-white text-gray-900 shadow' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'map' 
                ? 'bg-white text-gray-900 shadow' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Map
          </button>
        </div>
      </div>

      {/* Search Results */}
      {filteredCommunities && (
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Search Results ({filteredCommunities.length})
          </h2>
          {filteredCommunities.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCommunities.map((community) => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No communities found matching "{searchQuery}"</p>
          )}
        </div>
      )}

      {/* Main Content */}
      {!filteredCommunities && (
        <>
          {viewMode === 'map' ? (
            <div className="h-[600px] mx-4 mb-8 rounded-lg overflow-hidden shadow-lg">
              <Suspense fallback={<MapLoadingFallback />}>
                <CommunitiesMap
                  communities={communitiesData}
                  selectedCommunity={selectedCommunity}
                  onSelectCommunity={setSelectedCommunity}
                />
              </Suspense>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-4 pb-12">
              {Object.entries(groupedCommunities).map(([group, communities]) => (
                communities.length > 0 && (
                  <div key={group} className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                      {group}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {communities.map((community) => (
                        <CommunityCard key={community.id} community={community} />
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </>
      )}

      {/* Selected Community Preview */}
      {selectedCommunity && viewMode === 'map' && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-xl p-4 z-50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{selectedCommunity.name}</h3>
              {selectedCommunity.listingsCount && (
                <p className="text-sm text-gray-500">
                  {selectedCommunity.listingsCount} active listings
                </p>
              )}
            </div>
            <button
              onClick={() => setSelectedCommunity(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          {selectedCommunity.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {selectedCommunity.description}
            </p>
          )}
          <Link
            href={`/communities/${selectedCommunity.slug || selectedCommunity.id}`}
            className="mt-4 block w-full py-2 bg-spyglass-orange text-white text-center rounded-lg hover:bg-spyglass-orange/90 transition-colors"
          >
            View Community →
          </Link>
        </div>
      )}
    </div>
  );
}

function CommunityCard({ community }: { community: CommunityPolygon & { county?: string } }) {
  return (
    <Link
      href={`/communities/${community.slug || community.id}`}
      className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Image */}
      <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
        {community.imageUrl ? (
          <img
            src={community.imageUrl}
            alt={community.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <MapPinIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}
        {community.medianPrice && (
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
            Median: ${(community.medianPrice / 1000).toFixed(0)}K
          </div>
        )}
      </div>
      
      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 group-hover:text-spyglass-orange transition-colors">
          {community.name}
        </h3>
        {community.listingsCount !== undefined && (
          <p className="text-sm text-gray-500">
            {community.listingsCount} listings
          </p>
        )}
      </div>
    </Link>
  );
}

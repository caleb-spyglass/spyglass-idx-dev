'use client';
// Navigation update and TypeScript build fixes - 2026-02-20

import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { HomePage } from '@/components/home/HomePage';
import { FilterBar } from '@/components/search/FilterBar';
import { AISearchBar } from '@/components/search/AISearchBar';
import { ListingsGrid } from '@/components/listings/ListingsGrid';
import { austinCommunities } from '@/data/austin-communities';
import { Listing, SearchFilters } from '@/types/listing';
import { CommunityPolygon } from '@/types/community';
import { useListings } from '@/hooks/useListings';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import { ListingDetailOverlay } from '@/components/listings/ListingDetailOverlay';
import { SparklesIcon, AdjustmentsHorizontalIcon, BookmarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

// Lazy load Leaflet map to avoid SSR issues
const LeafletMap = lazy(() => 
  import('@/components/map/LeafletMap').then(mod => ({ default: mod.LeafletMap }))
);

function MapLoadingFallback() {
  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <PageContent />
    </Suspense>
  );
}

function PageContent() {
  const searchParams = useSearchParams();
  
  // Page state - controls whether to show homepage or search interface
  const [showHomepage, setShowHomepage] = useState(true);
  
  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [hoveredListing, setHoveredListing] = useState<Listing | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityPolygon | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'list' | 'map'>('split');
  const [mapBounds, setMapBounds] = useState<{ north: number; south: number; east: number; west: number } | null>(null);
  
  // AI Search state
  const [searchMode, setSearchMode] = useState<'filters' | 'ai'>('ai'); // Default to AI
  const [aiListings, setAiListings] = useState<Listing[]>([]);
  const [aiTotal, setAiTotal] = useState(0);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isAiActive, setIsAiActive] = useState(false);
  const [matchedCommunityName, setMatchedCommunityName] = useState<string | null>(null);
  
  // Save Search state
  const { saveSearch } = useSavedSearches();
  const [showSaveSearchPrompt, setShowSaveSearchPrompt] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');

  const { 
    listings: filterListings, 
    loading, 
    error, 
    total: filterTotal, 
    hasMore, 
    fetchListings, 
    loadMore 
  } = useListings({ autoFetch: !showHomepage && searchMode === 'filters' });

  // Track whether initial fetch for mapView has run
  const mapViewInitRef = useRef(false);
  
  // Check for URL parameters to activate map view, and reset when navigating away
  useEffect(() => {
    const mapViewParam = searchParams.get('mapView');
    if (mapViewParam === 'true' && !mapViewInitRef.current) {
      mapViewInitRef.current = true;
      setShowHomepage(false);
      setViewMode('split');
      setSearchMode('filters');
      fetchListings({});
    } else if (!mapViewParam && mapViewInitRef.current) {
      // User navigated away from mapView (e.g. clicked logo → "/")
      mapViewInitRef.current = false;
      setShowHomepage(true);
      setAiListings([]);
      setAiTotal(0);
      setAiSummary(null);
      setIsAiActive(false);
      setMatchedCommunityName(null);
      setSelectedCommunity(null);
      setSelectedListing(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  
  // Use AI listings when AI search is active, otherwise use filter listings
  const listings = isAiActive ? aiListings : filterListings;
  const total = isAiActive ? aiTotal : filterTotal;

  // Track previous filter signature to avoid redundant fetches
  const prevFilterSigRef = useRef<string>('');
  
  // Refetch when filters change (only in filter mode and not on homepage)
  useEffect(() => {
    if (!showHomepage && (searchMode === 'filters' || !isAiActive)) {
      const searchFilters: SearchFilters = {
        ...filters,
        polygon: selectedCommunity?.coordinates,
      };
      // Deduplicate: only fetch if filters actually changed
      const sig = JSON.stringify(searchFilters);
      if (sig === prevFilterSigRef.current) return;
      prevFilterSigRef.current = sig;
      fetchListings(searchFilters);
    }
  }, [filters, selectedCommunity, searchMode, isAiActive, showHomepage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectCommunity = (community: CommunityPolygon) => {
    if (selectedCommunity?.id === community.id) {
      setSelectedCommunity(null);
    } else {
      setSelectedCommunity(community);
    }
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setIsAiActive(false);
    setFilters(newFilters);
  };

  const handleSearchResults = (results: { listings: Listing[]; total: number; summary: string; nlpId: string; matchedCommunity?: { name: string; slug: string } | null }) => {
    setAiListings(results.listings);
    setAiTotal(results.total);
    setAiSummary(results.summary);
    setIsAiActive(true);
    setMatchedCommunityName(results.matchedCommunity?.name || null);
    
    // If a community was matched, auto-select it for the map
    if (results.matchedCommunity?.name) {
      const matched = austinCommunities.find(
        c => c.name.toLowerCase() === results.matchedCommunity!.name.toLowerCase()
      );
      if (matched) {
        setSelectedCommunity(matched);
      } else {
        setSelectedCommunity(null);
      }
    } else {
      setSelectedCommunity(null);
    }
  };

  const handleAIClear = () => {
    setAiListings([]);
    setAiTotal(0);
    setAiSummary(null);
    setIsAiActive(false);
    setMatchedCommunityName(null);
    setSelectedCommunity(null);
    if (!showHomepage) {
      fetchListings(filters);
    }
  };

  // Check if any meaningful filter is active
  const hasActiveFilters = !!(
    filters.minPrice || filters.maxPrice ||
    filters.minBeds || filters.minBaths ||
    filters.minSqft || filters.maxSqft ||
    filters.city || filters.zip || filters.neighborhood ||
    (filters.propertyTypes && filters.propertyTypes.length > 0) ||
    selectedCommunity
  );

  const handleSaveSearch = () => {
    if (!saveSearchName.trim()) return;
    saveSearch(
      saveSearchName.trim(),
      filters,
      selectedCommunity?.name
    );
    setSaveSearchName('');
    setShowSaveSearchPrompt(false);
  };

  const handleShowSearchPage = () => {
    setShowHomepage(false);
  };

  const handleBackToHome = () => {
    setShowHomepage(true);
    setAiListings([]);
    setAiTotal(0);
    setAiSummary(null);
    setIsAiActive(false);
    setMatchedCommunityName(null);
    setSelectedCommunity(null);
  };

  // Show homepage
  if (showHomepage) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <HomePage 
          onSearchResults={handleSearchResults}
          onShowSearchPage={handleShowSearchPage}
        />
      </div>
    );
  }

  // Show search interface
  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      {/* Search Mode Toggle + Search Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        {/* Back to Home + Mode Toggle */}
        <div className="px-4 pt-3 pb-2 flex items-center gap-4">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="text-sm">Home</span>
          </button>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => { setSearchMode('ai'); if (!isAiActive && !showHomepage) fetchListings(filters); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                searchMode === 'ai'
                  ? 'bg-white text-spyglass-orange shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <SparklesIcon className="w-4 h-4" />
              AI Search
            </button>
            <button
              onClick={() => { setSearchMode('filters'); setIsAiActive(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                searchMode === 'filters'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              Filters
            </button>
          </div>
          
          {searchMode === 'ai' && (
            <p className="text-sm text-gray-500 hidden md:block">
              Describe what you're looking for in plain English
            </p>
          )}
        </div>

        {/* AI Search Bar */}
        {searchMode === 'ai' && (
          <div className="px-4 pb-3">
            <AISearchBar
              onResults={handleSearchResults}
              onClear={handleAIClear}
            />
          </div>
        )}

        {/* Traditional Filters */}
        {searchMode === 'filters' && (
          <FilterBar 
            filters={filters} 
            onFiltersChange={handleFiltersChange}
            totalResults={total}
          />
        )}

        {/* Save Search button - shows when filters are active */}
        {hasActiveFilters && searchMode === 'filters' && (
          <div className="px-4 pb-2 flex items-center gap-2">
            {!showSaveSearchPrompt ? (
              <button
                onClick={() => setShowSaveSearchPrompt(true)}
                className="flex items-center gap-1.5 text-sm text-spyglass-orange hover:text-spyglass-orange/80 font-medium transition-colors"
              >
                <BookmarkIcon className="w-4 h-4" />
                Save This Search
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={saveSearchName}
                  onChange={(e) => setSaveSearchName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveSearch(); if (e.key === 'Escape') setShowSaveSearchPrompt(false); }}
                  placeholder="Name this search..."
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-spyglass-orange focus:border-transparent w-56"
                  autoFocus
                />
                <button
                  onClick={handleSaveSearch}
                  disabled={!saveSearchName.trim()}
                  className="px-3 py-1.5 bg-spyglass-orange text-white text-sm font-medium rounded-lg hover:bg-spyglass-orange/90 transition-colors disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={() => { setShowSaveSearchPrompt(false); setSaveSearchName(''); }}
                  className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected community indicator */}
      {selectedCommunity && (
        <div className="bg-spyglass-orange/10 border-b border-spyglass-orange/20 px-4 py-2 flex items-center justify-between">
          <span className="text-sm">
            Showing listings in <strong>{selectedCommunity.name}</strong>
          </span>
          <button 
            onClick={() => setSelectedCommunity(null)}
            className="text-sm text-spyglass-orange hover:underline"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* View mode toggle (mobile) */}
      <div className="md:hidden flex border-b border-gray-200 bg-white">
        {(['list', 'map'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              viewMode === mode 
                ? 'text-spyglass-orange border-b-2 border-spyglass-orange' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {mode === 'list' ? 'List' : 'Map'}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Listings panel */}
        <div 
          className={`
            ${viewMode === 'map' ? 'hidden md:block' : ''} 
            ${viewMode === 'split' ? 'w-full md:w-1/2 lg:w-[45%]' : 'w-full'}
            overflow-y-auto listings-scroll bg-gray-50
          `}
        >
          {/* Sort dropdown */}
          <div className="sticky top-0 bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {loading ? 'Loading...' : `${total.toLocaleString()} homes`}
            </span>
            <select
              value={filters.sort ?? 'date-desc'}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value as any })}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-spyglass-orange"
            >
              <option value="date-desc">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="sqft-desc">Sqft: High to Low</option>
            </select>
          </div>

          <ListingsGrid 
            listings={listings}
            selectedListing={selectedListing}
            hoveredListing={hoveredListing}
            onSelectListing={setSelectedListing}
            onHoverListing={setHoveredListing}
            isLoading={loading}
          />

          {/* Load more button */}
          {hasMore && !loading && (
            <div className="p-4 text-center">
              <button
                onClick={loadMore}
                className="px-6 py-2 bg-spyglass-orange text-white rounded-lg hover:bg-spyglass-orange/90 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </div>

        {/* Map panel */}
        <div 
          className={`
            ${viewMode === 'list' ? 'hidden md:block' : ''} 
            ${viewMode === 'split' ? 'hidden md:block md:w-1/2 lg:w-[55%]' : 'w-full'}
            border-l border-gray-200
          `}
        >
          <Suspense fallback={<MapLoadingFallback />}>
            <LeafletMap 
              listings={listings}
              communities={selectedCommunity ? [selectedCommunity] : []}
              selectedListing={selectedListing}
              hoveredListing={hoveredListing}
              selectedCommunity={selectedCommunity}
              onSelectListing={setSelectedListing}
              onHoverListing={setHoveredListing}
              onSelectCommunity={handleSelectCommunity}
              onBoundsChange={setMapBounds}
            />
          </Suspense>
        </div>
      </div>

      {/* Listing detail overlay */}
      <ListingDetailOverlay 
        listing={selectedListing}
        isOpen={selectedListing !== null}
        onClose={() => {
          setSelectedListing(null);
          // Reset URL to search page
          window.history.pushState({}, '', '/');
        }}
        hasPrevious={selectedListing ? listings.findIndex(l => l.mlsNumber === selectedListing.mlsNumber) > 0 : false}
        hasNext={selectedListing ? listings.findIndex(l => l.mlsNumber === selectedListing.mlsNumber) < listings.length - 1 : false}
        onPrevious={() => {
          if (!selectedListing) return;
          const currentIdx = listings.findIndex(l => l.mlsNumber === selectedListing.mlsNumber);
          if (currentIdx > 0) {
            const prev = listings[currentIdx - 1];
            setSelectedListing(prev);
            window.history.pushState({}, '', `/listing/${prev.mlsNumber}`);
          }
        }}
        onNext={() => {
          if (!selectedListing) return;
          const currentIdx = listings.findIndex(l => l.mlsNumber === selectedListing.mlsNumber);
          if (currentIdx < listings.length - 1) {
            const next = listings[currentIdx + 1];
            setSelectedListing(next);
            window.history.pushState({}, '', `/listing/${next.mlsNumber}`);
          }
        }}
        onFilterByCity={(city) => {
          setFilters({ ...filters, city });
          window.history.pushState({}, '', '/');
        }}
        onFilterByZip={(zip) => {
          setFilters({ ...filters, zip });
          window.history.pushState({}, '', '/');
        }}
        onFilterByNeighborhood={(neighborhood) => {
          setFilters({ ...filters, neighborhood });
          window.history.pushState({}, '', '/');
        }}
      />
    </div>
  );
}
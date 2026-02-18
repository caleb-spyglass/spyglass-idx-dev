'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ListingsGrid } from '@/components/listings/ListingsGrid';
import { ListingDetailOverlay } from '@/components/listings/ListingDetailOverlay';
import { Listing } from '@/types/listing';
import { useDismissedListings } from '@/hooks/useDismissedListings';
import { FilterBar, FilterState, defaultFilters } from '@/components/filters';
import { EyeSlashIcon } from '@heroicons/react/24/outline';

const LeafletMap = lazy(() =>
  import('@/components/map/LeafletMap').then((mod) => ({ default: mod.LeafletMap }))
);

function MapLoadingFallback() {
  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  );
}

interface AreaCommunityListingsIslandProps {
  communitySlug: string;
  communityName: string;
  areaType: 'zip' | 'city';
  filterValue: string;
  isEmbed?: boolean;
}

export default function AreaCommunityListingsIsland({
  communitySlug,
  communityName,
  areaType,
  filterValue,
  isEmbed = false,
}: AreaCommunityListingsIslandProps) {
  const searchParams = useSearchParams();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [hoveredListing, setHoveredListing] = useState<Listing | null>(null);

  const { dismiss, isDismissed, dismissedCount, restoreAll } = useDismissedListings();
  const [showDismissed, setShowDismissed] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const filteredListings = listings.filter((listing) => {
    if (!showDismissed && isDismissed(listing.mlsNumber)) return false;
    if (filters.minPrice && listing.price < filters.minPrice) return false;
    if (filters.maxPrice && listing.price > filters.maxPrice) return false;
    if (filters.minBeds !== undefined && listing.bedrooms < filters.minBeds) return false;
    if (filters.minBaths !== undefined && listing.bathrooms < filters.minBaths) return false;
    if (filters.homeTypes?.length && !filters.homeTypes.includes(listing.propertyType)) return false;
    if (filters.minSqft && listing.sqft < filters.minSqft) return false;
    if (filters.maxSqft && listing.sqft > filters.maxSqft) return false;
    if (filters.maxDaysOnMarket && listing.daysOnMarket > filters.maxDaysOnMarket) return false;
    return true;
  });

  const visibleListings = filteredListings;

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const param = areaType === 'zip'
          ? `zip=${filterValue}`
          : `city=${encodeURIComponent(filterValue)}`;
        const response = await fetch(`/api/listings?${param}&pageSize=100`);
        if (response.ok) {
          const data = await response.json();
          setListings(data.listings || []);
          setTotal(data.total || 0);
        }
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [areaType, filterValue]);

  return (
    <div className="flex-1 flex flex-col min-h-[60vh] md:overflow-hidden md:h-[calc(100vh-240px)]">
      {!isEmbed && (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            totalCount={visibleListings.length}
            showAISearch={false}
          />
        </div>
      )}

      <div className="flex-1 flex md:overflow-hidden">
        {/* Listings panel — left side */}
        <div className="w-full md:w-1/2 lg:w-[45%] md:overflow-y-auto bg-gray-50">
          <div className="sticky top-0 bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between z-10">
            <span className="text-sm text-gray-600">
              {loading
                ? 'Loading...'
                : `${visibleListings.length} homes in ${areaType === 'zip' ? filterValue : communityName}`}
              {dismissedCount > 0 && !showDismissed && (
                <span className="text-gray-400 ml-1">({dismissedCount} hidden)</span>
              )}
            </span>
            {dismissedCount > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDismissed(!showDismissed)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                >
                  <EyeSlashIcon className="w-4 h-4" />
                  {showDismissed ? 'Hide dismissed' : 'Show all'}
                </button>
                <button onClick={restoreAll} className="text-xs text-spyglass-orange hover:underline">
                  Restore all
                </button>
              </div>
            )}
          </div>

          <ListingsGrid
            listings={visibleListings}
            selectedListing={selectedListing}
            hoveredListing={hoveredListing}
            onSelectListing={setSelectedListing}
            onHoverListing={setHoveredListing}
            onDismissListing={dismiss}
            isLoading={loading}
          />
        </div>

        {/* Map panel — right side */}
        <div className="hidden md:block md:w-1/2 lg:w-[55%] border-l border-gray-200">
          <Suspense fallback={<MapLoadingFallback />}>
            <LeafletMap
              listings={visibleListings}
              selectedListing={selectedListing}
              hoveredListing={hoveredListing}
              onSelectListing={setSelectedListing}
              onHoverListing={setHoveredListing}
            />
          </Suspense>
        </div>
      </div>

      <ListingDetailOverlay
        listing={selectedListing}
        isOpen={!!selectedListing}
        onClose={() => {
          setSelectedListing(null);
          const basePath = areaType === 'zip' ? `/zip-codes/${communitySlug}` : `/communities/${communitySlug}`;
          window.history.pushState({}, '', basePath);
        }}
        onPrevious={() => {
          if (!selectedListing) return;
          const currentIndex = visibleListings.findIndex(
            (l) => l.mlsNumber === selectedListing.mlsNumber
          );
          if (currentIndex > 0) {
            const prev = visibleListings[currentIndex - 1];
            setSelectedListing(prev);
            window.history.pushState({}, '', `/listing/${prev.mlsNumber}`);
          }
        }}
        onNext={() => {
          if (!selectedListing) return;
          const currentIndex = visibleListings.findIndex(
            (l) => l.mlsNumber === selectedListing.mlsNumber
          );
          if (currentIndex < visibleListings.length - 1) {
            const next = visibleListings[currentIndex + 1];
            setSelectedListing(next);
            window.history.pushState({}, '', `/listing/${next.mlsNumber}`);
          }
        }}
        hasPrevious={
          selectedListing
            ? visibleListings.findIndex((l) => l.mlsNumber === selectedListing.mlsNumber) > 0
            : false
        }
        hasNext={
          selectedListing
            ? visibleListings.findIndex((l) => l.mlsNumber === selectedListing.mlsNumber) <
              visibleListings.length - 1
            : false
        }
      />
    </div>
  );
}

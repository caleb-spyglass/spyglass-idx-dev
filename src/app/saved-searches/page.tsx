'use client';

import { Header } from '@/components/ui/Header';
import { useSavedSearches, SavedSearch } from '@/hooks/useSavedSearches';
import { SearchFilters } from '@/types/listing';
import { BookmarkIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

function buildFilterSummary(filters: SearchFilters): string {
  const parts: string[] = [];

  if (filters.city) parts.push(filters.city);
  if (filters.zip) parts.push(`ZIP ${filters.zip}`);
  if (filters.neighborhood) parts.push(filters.neighborhood);

  if (filters.minPrice || filters.maxPrice) {
    const min = filters.minPrice ? formatPrice(filters.minPrice) : 'Any';
    const max = filters.maxPrice ? formatPrice(filters.maxPrice) : 'Any';
    parts.push(`${min} – ${max}`);
  }

  if (filters.minBeds) parts.push(`${filters.minBeds}+ beds`);
  if (filters.minBaths) parts.push(`${filters.minBaths}+ baths`);

  if (filters.propertyTypes?.length) {
    parts.push(filters.propertyTypes.join(', '));
  }

  if (filters.minSqft || filters.maxSqft) {
    const min = filters.minSqft ? `${filters.minSqft.toLocaleString()}` : '0';
    const max = filters.maxSqft ? `${filters.maxSqft.toLocaleString()}` : '∞';
    parts.push(`${min}–${max} sqft`);
  }

  return parts.length > 0 ? parts.join(' · ') : 'All listings';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function SavedSearchesPage() {
  const { savedSearches, removeSearch, clearSearches, isLoaded } = useSavedSearches();
  const router = useRouter();

  const handleRunSearch = (search: SavedSearch) => {
    // Encode filters as URL params and navigate home
    const params = new URLSearchParams();
    const f = search.filters;
    if (f.minPrice) params.set('minPrice', String(f.minPrice));
    if (f.maxPrice) params.set('maxPrice', String(f.maxPrice));
    if (f.minBeds) params.set('minBeds', String(f.minBeds));
    if (f.minBaths) params.set('minBaths', String(f.minBaths));
    if (f.minSqft) params.set('minSqft', String(f.minSqft));
    if (f.maxSqft) params.set('maxSqft', String(f.maxSqft));
    if (f.city) params.set('city', f.city);
    if (f.zip) params.set('zip', f.zip);
    if (f.neighborhood) params.set('neighborhood', f.neighborhood);
    if (f.propertyTypes?.length) params.set('propertyTypes', f.propertyTypes.join(','));
    if (f.sort) params.set('sort', f.sort);

    const qs = params.toString();
    router.push(qs ? `/?${qs}` : '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Saved Searches</h1>
            <p className="text-sm text-gray-500 mt-1">
              {savedSearches.length === 0
                ? 'No saved searches yet'
                : `${savedSearches.length} saved search${savedSearches.length !== 1 ? 'es' : ''}`}
            </p>
          </div>
          {savedSearches.length > 0 && (
            <button
              onClick={clearSearches}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <TrashIcon className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Empty state */}
        {isLoaded && savedSearches.length === 0 && (
          <div className="text-center py-16">
            <BookmarkIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">No saved searches</h2>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Set your filters on the search page and tap &quot;Save Search&quot; to keep track of your criteria.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-spyglass-orange text-white font-medium rounded-lg hover:bg-spyglass-orange/90 transition-colors"
            >
              Start Searching
            </Link>
          </div>
        )}

        {/* Saved search cards */}
        {savedSearches.length > 0 && (
          <div className="space-y-4">
            {savedSearches.map((search) => (
              <div
                key={search.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg">{search.name}</h3>
                    {search.community && (
                      <p className="text-sm text-spyglass-orange mt-0.5">
                        Community: {search.community}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {buildFilterSummary(search.filters)}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Saved {formatDate(search.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleRunSearch(search)}
                      className="flex items-center gap-2 px-4 py-2 bg-spyglass-orange text-white text-sm font-medium rounded-lg hover:bg-spyglass-orange/90 transition-colors"
                    >
                      <MagnifyingGlassIcon className="w-4 h-4" />
                      Search
                    </button>
                    <button
                      onClick={() => removeSearch(search.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete saved search"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

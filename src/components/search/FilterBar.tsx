'use client';

import { useState, useEffect, useCallback } from 'react';
import { SearchFilters } from '@/types/listing';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FilterBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  totalResults: number;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const priceOptions = [
  { label: 'No Min', value: undefined },
  { label: '$200k', value: 200000 },
  { label: '$300k', value: 300000 },
  { label: '$400k', value: 400000 },
  { label: '$500k', value: 500000 },
  { label: '$600k', value: 600000 },
  { label: '$750k', value: 750000 },
  { label: '$1M', value: 1000000 },
  { label: '$1.5M', value: 1500000 },
  { label: '$2M', value: 2000000 },
];

const bedBathOptions = [
  { label: 'Any', value: undefined },
  { label: '1+', value: 1 },
  { label: '2+', value: 2 },
  { label: '3+', value: 3 },
  { label: '4+', value: 4 },
  { label: '5+', value: 5 },
];

export function FilterBar({ filters, onFiltersChange, totalResults }: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  // Parse search input and update filters
  useEffect(() => {
    if (!debouncedSearch) {
      // Clear search-related filters when input is empty
      const { city, area, zip, ...rest } = filters;
      if (city || area || zip) {
        onFiltersChange(rest);
      }
      return;
    }

    const query = debouncedSearch.trim();
    
    // Check if it's an MLS number (starts with letters followed by numbers)
    if (/^[A-Za-z]+\d+$/.test(query)) {
      // Redirect to listing detail page for MLS lookup
      window.location.href = `/listing/${query}`;
      return;
    }

    // Check if it's a ZIP code (5 digits)
    if (/^\d{5}$/.test(query)) {
      // Search by ZIP
      onFiltersChange({ ...filters, zip: query, city: undefined, area: undefined });
      return;
    }

    // Otherwise treat as city search
    onFiltersChange({ ...filters, city: query, zip: undefined });
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearSearch = () => {
    setSearchInput('');
    const { city, area, zip, ...rest } = filters;
    onFiltersChange(rest);
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
      {/* Main filter row */}
      <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="City, ZIP, Address, or MLS#"
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
          />
          {searchInput && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
            >
              <XMarkIcon className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Price Range */}
        <div className="flex items-center gap-2">
          <select
            value={filters.minPrice ?? ''}
            onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spyglass-orange"
          >
            {priceOptions.map((opt) => (
              <option key={`min-${opt.value}`} value={opt.value ?? ''}>
                {opt.value ? opt.label : 'No Min'}
              </option>
            ))}
          </select>
          <span className="text-gray-400">-</span>
          <select
            value={filters.maxPrice ?? ''}
            onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spyglass-orange"
          >
            {priceOptions.map((opt) => (
              <option key={`max-${opt.value}`} value={opt.value ?? ''}>
                {opt.value ? opt.label : 'No Max'}
              </option>
            ))}
          </select>
        </div>

        {/* Beds */}
        <select
          value={filters.minBeds ?? ''}
          onChange={(e) => updateFilter('minBeds', e.target.value ? Number(e.target.value) : undefined)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spyglass-orange"
        >
          {bedBathOptions.map((opt) => (
            <option key={`beds-${opt.value}`} value={opt.value ?? ''}>
              {opt.value ? `${opt.value}+ Beds` : 'Beds'}
            </option>
          ))}
        </select>

        {/* Baths */}
        <select
          value={filters.minBaths ?? ''}
          onChange={(e) => updateFilter('minBaths', e.target.value ? Number(e.target.value) : undefined)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spyglass-orange"
        >
          {bedBathOptions.map((opt) => (
            <option key={`baths-${opt.value}`} value={opt.value ?? ''}>
              {opt.value ? `${opt.value}+ Baths` : 'Baths'}
            </option>
          ))}
        </select>

        {/* More Filters */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
            showAdvanced 
              ? 'border-spyglass-orange bg-spyglass-orange/10 text-spyglass-orange' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          <span>More</span>
        </button>

        {/* Results count */}
        <div className="ml-auto text-sm text-gray-600">
          <span className="font-semibold">{totalResults.toLocaleString()}</span> homes
        </div>
      </div>

      {/* Advanced filters (expandable) */}
      {showAdvanced && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center gap-4 flex-wrap">
          {/* Property Type */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Type:</span>
            {['Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Land'].map((type) => (
              <label key={type} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={filters.propertyTypes?.includes(type) ?? false}
                  onChange={(e) => {
                    const current = filters.propertyTypes ?? [];
                    const updated = e.target.checked
                      ? [...current, type]
                      : current.filter((t) => t !== type);
                    updateFilter('propertyTypes', updated.length > 0 ? updated : undefined);
                  }}
                  className="rounded text-spyglass-orange focus:ring-spyglass-orange"
                />
                {type}
              </label>
            ))}
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status:</span>
            {['Active', 'Pending', 'Coming Soon'].map((status) => (
              <label key={status} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={filters.status?.includes(status) ?? status === 'Active'}
                  onChange={(e) => {
                    const current = filters.status ?? ['Active'];
                    const updated = e.target.checked
                      ? [...current, status]
                      : current.filter((s) => s !== status);
                    updateFilter('status', updated.length > 0 ? updated : undefined);
                  }}
                  className="rounded text-spyglass-orange focus:ring-spyglass-orange"
                />
                {status}
              </label>
            ))}
          </div>

          {/* Sqft */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sqft:</span>
            <input
              type="number"
              placeholder="Min"
              value={filters.minSqft ?? ''}
              onChange={(e) => updateFilter('minSqft', e.target.value ? Number(e.target.value) : undefined)}
              className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-spyglass-orange"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxSqft ?? ''}
              onChange={(e) => updateFilter('maxSqft', e.target.value ? Number(e.target.value) : undefined)}
              className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-spyglass-orange"
            />
          </div>
        </div>
      )}
    </div>
  );
}

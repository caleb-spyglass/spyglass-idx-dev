import { useState, useEffect, useCallback, useRef } from 'react';
import { Listing, SearchFilters, SearchResults } from '@/types/listing';

interface UseListingsOptions {
  initialFilters?: SearchFilters;
  autoFetch?: boolean;
}

interface UseListingsReturn {
  listings: Listing[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  hasMore: boolean;
  fetchListings: (filters?: SearchFilters) => Promise<void>;
  loadMore: () => Promise<void>;
}

export function useListings({ 
  initialFilters = {}, 
  autoFetch = true 
}: UseListingsOptions = {}): UseListingsReturn {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Use refs to avoid re-creating callbacks and causing render loops
  const currentFiltersRef = useRef<SearchFilters>(initialFilters);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(false);

  const fetchListings = useCallback(async (filters?: SearchFilters) => {
    // Prevent concurrent fetches
    if (loadingRef.current) return;

    const requestFilters = filters || currentFiltersRef.current;
    
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...requestFilters, page: 1 }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch listings');
      }
      
      const data: SearchResults = await response.json();
      setListings(data.listings);
      setTotal(data.total);
      setPage(data.page);
      setHasMore(data.hasMore);
      
      pageRef.current = data.page;
      hasMoreRef.current = data.hasMore;
      
      if (filters) {
        currentFiltersRef.current = filters;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch listings');
      console.error('Fetch listings error:', err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []); // Stable reference — no dependencies

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    
    loadingRef.current = true;
    setLoading(true);
    try {
      const nextPage = pageRef.current + 1;
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentFiltersRef.current, page: nextPage }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to load more listings');
      }
      
      const data: SearchResults = await response.json();
      setListings(prev => [...prev, ...data.listings]);
      setPage(data.page);
      setHasMore(data.hasMore);
      
      pageRef.current = data.page;
      hasMoreRef.current = data.hasMore;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more');
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []); // Stable reference — no dependencies

  useEffect(() => {
    if (autoFetch) {
      fetchListings();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    listings,
    loading,
    error,
    total,
    page,
    hasMore,
    fetchListings,
    loadMore,
  };
}

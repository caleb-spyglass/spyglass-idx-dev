import { useState, useEffect, useCallback } from 'react';
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
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>(initialFilters);

  const fetchListings = useCallback(async (filters?: SearchFilters) => {
    const requestFilters = filters || currentFilters;
    setLoading(true);
    setError(null);
    // Don't clear listings — keep showing old results while loading to avoid flash
    
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
      
      if (filters) {
        setCurrentFilters(filters);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch listings');
      console.error('Fetch listings error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentFilters]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentFilters, page: page + 1 }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to load more listings');
      }
      
      const data: SearchResults = await response.json();
      setListings(prev => [...prev, ...data.listings]);
      setPage(data.page);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more');
    } finally {
      setLoading(false);
    }
  }, [currentFilters, page, loading, hasMore]);

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

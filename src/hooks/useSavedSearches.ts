'use client';

import { useState, useEffect, useCallback } from 'react';
import { SearchFilters } from '@/types/listing';

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: string;
  community?: string;
}

const STORAGE_KEY = 'spyglass-saved-searches';

export function useSavedSearches() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved searches:', e);
    }
    setIsLoaded(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSearches));
    } catch (e) {
      console.error('Failed to save searches:', e);
    }
  }, [savedSearches, isLoaded]);

  const saveSearch = useCallback((name: string, filters: SearchFilters, community?: string) => {
    const search: SavedSearch = {
      id: crypto.randomUUID(),
      name,
      filters,
      createdAt: new Date().toISOString(),
      community,
    };
    setSavedSearches(prev => [search, ...prev]);
  }, []);

  const removeSearch = useCallback((id: string) => {
    setSavedSearches(prev => prev.filter(s => s.id !== id));
  }, []);

  const clearSearches = useCallback(() => {
    setSavedSearches([]);
  }, []);

  return {
    savedSearches,
    saveSearch,
    removeSearch,
    clearSearches,
    searchesCount: savedSearches.length,
    isLoaded,
  };
}

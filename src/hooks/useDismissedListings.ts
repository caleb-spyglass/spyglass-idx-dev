'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'spyglass_dismissed_listings';

export function useDismissedListings() {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setDismissedIds(new Set(parsed));
      }
    } catch (e) {
      console.error('Failed to load dismissed listings:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever dismissedIds changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...dismissedIds]));
    } catch (e) {
      console.error('Failed to save dismissed listings:', e);
    }
  }, [dismissedIds, isLoaded]);

  const dismiss = useCallback((mlsNumber: string) => {
    setDismissedIds(prev => new Set([...prev, mlsNumber]));
  }, []);

  const restore = useCallback((mlsNumber: string) => {
    setDismissedIds(prev => {
      const next = new Set(prev);
      next.delete(mlsNumber);
      return next;
    });
  }, []);

  const restoreAll = useCallback(() => {
    setDismissedIds(new Set());
  }, []);

  const isDismissed = useCallback((mlsNumber: string) => {
    return dismissedIds.has(mlsNumber);
  }, [dismissedIds]);

  return {
    dismissedIds,
    dismissedCount: dismissedIds.size,
    dismiss,
    restore,
    restoreAll,
    isDismissed,
    isLoaded,
  };
}

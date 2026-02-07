'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'spyglass-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load favorites:', e);
    }
    setIsLoaded(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
  }, [favorites, isLoaded]);

  const toggleFavorite = useCallback((mlsNumber: string) => {
    setFavorites(prev =>
      prev.includes(mlsNumber)
        ? prev.filter(id => id !== mlsNumber)
        : [...prev, mlsNumber]
    );
  }, []);

  const isFavorite = useCallback(
    (mlsNumber: string) => favorites.includes(mlsNumber),
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    favoritesCount: favorites.length,
    clearFavorites,
    isLoaded,
  };
}

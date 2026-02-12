'use client';

import { useState, useEffect } from 'react';

// Global cache shared across all component instances
let globalContent: Record<string, any> | null = null;
let globalFetchPromise: Promise<Record<string, any>> | null = null;
let fetchedAt = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchSiteContent(): Promise<Record<string, any>> {
  const now = Date.now();
  
  // Return cached if fresh
  if (globalContent && (now - fetchedAt) < CACHE_TTL) {
    return globalContent;
  }

  // Deduplicate in-flight requests
  if (globalFetchPromise) return globalFetchPromise;

  globalFetchPromise = fetch('/api/site-content')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      globalContent = data;
      fetchedAt = Date.now();
      globalFetchPromise = null;
      return data;
    })
    .catch(err => {
      console.warn('[useSiteContent] Failed to fetch:', err.message);
      globalFetchPromise = null;
      return globalContent || {};
    });

  return globalFetchPromise;
}

/**
 * Hook to get site content for a specific section with fallback defaults.
 * 
 * Usage:
 *   const content = useSiteContent('hero', defaultHeroContent);
 */
export function useSiteContent<T>(section: string, defaults: T): T {
  const [content, setContent] = useState<T>(defaults);

  useEffect(() => {
    fetchSiteContent().then(allContent => {
      if (allContent && allContent[section]) {
        // Deep merge: defaults provide structure, fetched content overrides
        setContent({ ...defaults, ...allContent[section] });
      }
    });
  }, [section]);

  return content;
}

/**
 * Non-hook version for server components or one-off fetches.
 */
export async function getSiteContent(section: string, defaults: any = {}): Promise<any> {
  try {
    const allContent = await fetchSiteContent();
    return allContent?.[section] ? { ...defaults, ...allContent[section] } : defaults;
  } catch {
    return defaults;
  }
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { CommunityPolygon } from '@/types/community';
import { Listing } from '@/types/listing';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';

let L: typeof import('leaflet') | null = null;

interface CommunitiesMapProps {
  communities: CommunityPolygon[];
  selectedCommunity?: CommunityPolygon | null;
  onSelectCommunity?: (community: CommunityPolygon | null) => void;
}

export function CommunitiesMap({
  communities,
  selectedCommunity,
  onSelectCommunity,
}: CommunitiesMapProps) {
  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const polygonsRef = useRef<Map<string, L.Polygon>>(new Map());
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [zoomLevel, setZoomLevel] = useState(10);

  // Initialize Leaflet
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initLeaflet = async () => {
      if (!L) {
        L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');
      }

      if (!mapContainerRef.current || mapRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [30.2672, -97.7431],
        zoom: 10,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      map.on('zoomend', () => {
        setZoomLevel(map.getZoom());
      });

      mapRef.current = map;
      setIsLoaded(true);
    };

    initLeaflet();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Draw community polygons
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !L) return;

    const map = mapRef.current;

    // Clear old polygons
    polygonsRef.current.forEach(polygon => polygon.remove());
    polygonsRef.current.clear();

    // Add community polygons
    communities.forEach(community => {
      if (!community.coordinates || community.coordinates.length < 3) return;

      const isSelected = selectedCommunity?.id === community.id;
      const coords = community.coordinates.map(c => 
        Array.isArray(c) ? [c[0], c[1]] as [number, number] : [c.lat, c.lng] as [number, number]
      );

      const polygon = L.polygon(coords, {
        color: isSelected ? '#E85A24' : '#6B7280',
        weight: isSelected ? 3 : 2,
        fillColor: isSelected ? '#E85A24' : '#9CA3AF',
        fillOpacity: isSelected ? 0.3 : 0.15,
      })
        .addTo(map)
        .on('click', () => {
          onSelectCommunity?.(community);
        })
        .on('dblclick', () => {
          router.push(`/communities/${community.slug || community.id}`);
        });

      // Add label
      const center = polygon.getBounds().getCenter();
      const label = L.marker(center, {
        icon: L.divIcon({
          className: 'community-label',
          html: `
            <div class="px-2 py-1 bg-white/90 rounded shadow text-xs font-medium text-gray-900 whitespace-nowrap">
              ${community.name}
            </div>
          `,
          iconSize: [100, 24],
          iconAnchor: [50, 12],
        }),
      }).addTo(map);

      polygonsRef.current.set(community.id, polygon);
      polygonsRef.current.set(`label-${community.id}`, label as any);
    });
  }, [isLoaded, communities, selectedCommunity, router, onSelectCommunity]);

  // Fetch and show property markers when zoomed in on a selected community
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !L) return;
    if (!selectedCommunity || zoomLevel < 12) {
      // Clear markers when zoomed out or no selection
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current.clear();
      setListings([]);
      return;
    }

    // Fetch listings within the selected community
    const fetchListings = async () => {
      try {
        const response = await fetch('/api/listings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bounds: selectedCommunity.bounds,
            pageSize: 50,
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setListings(data.listings || []);
        }
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      }
    };

    fetchListings();
  }, [isLoaded, selectedCommunity, zoomLevel]);

  // Draw property markers
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !L) return;

    const map = mapRef.current;

    // Clear old markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current.clear();

    // Only show markers when zoomed in enough
    if (zoomLevel < 12 || listings.length === 0) return;

    // Add listing markers
    listings.forEach(listing => {
      const priceLabel = listing.price >= 1000000
        ? `$${(listing.price / 1000000).toFixed(1)}M`
        : `$${Math.round(listing.price / 1000)}K`;

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="relative">
            <div class="px-2 py-1 rounded text-xs font-semibold whitespace-nowrap shadow-md bg-spyglass-orange text-white cursor-pointer hover:scale-110 transition-transform">
              ${priceLabel}
            </div>
            <div class="absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#E85A24]"></div>
          </div>
        `,
        iconSize: [80, 30],
        iconAnchor: [40, 30],
      });

      const marker = L.marker([listing.coordinates.lat, listing.coordinates.lng], { icon })
        .addTo(map)
        .on('click', () => {
          window.location.href = `/listing/${listing.mlsNumber}`;
        });

      markersRef.current.set(listing.id, marker);
    });
  }, [isLoaded, listings, zoomLevel]);

  // Pan/zoom to selected community
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !selectedCommunity?.bounds) return;
    
    const { north, south, east, west } = selectedCommunity.bounds;
    mapRef.current.fitBounds([[south, west], [north, east]], { 
      padding: [50, 50],
      maxZoom: 14,
    });
  }, [isLoaded, selectedCommunity]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="absolute inset-0" />
      
      {/* Zoom hint */}
      {selectedCommunity && zoomLevel < 12 && (
        <div className="absolute bottom-4 left-4 bg-white/90 px-4 py-2 rounded-lg shadow text-sm text-gray-700 z-[1000]">
          💡 Zoom in to see property listings
        </div>
      )}

      {/* Listings count */}
      {selectedCommunity && listings.length > 0 && (
        <div className="absolute top-4 right-4 bg-white/90 px-4 py-2 rounded-lg shadow text-sm font-medium text-gray-900 z-[1000]">
          {listings.length} properties in {selectedCommunity.name}
        </div>
      )}

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-500">Loading map...</div>
        </div>
      )}
    </div>
  );
}

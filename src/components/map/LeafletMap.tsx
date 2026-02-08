'use client';

import { useEffect, useRef, useState } from 'react';
import { Listing } from '@/types/listing';
import { CommunityPolygon } from '@/types/community';
import { formatPrice } from '@/lib/mock-data';

// Dynamic import to avoid SSR issues with Leaflet
let L: typeof import('leaflet') | null = null;

interface LeafletMapProps {
  listings: Listing[];
  communities?: CommunityPolygon[];
  selectedListing?: Listing | null;
  hoveredListing?: Listing | null;
  selectedCommunity?: CommunityPolygon | null;
  onSelectListing?: (listing: Listing) => void;
  onHoverListing?: (listing: Listing | null) => void;
  onSelectCommunity?: (community: CommunityPolygon) => void;
  onBoundsChange?: (bounds: { north: number; south: number; east: number; west: number }) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

export function LeafletMap({
  listings,
  communities = [],
  selectedListing,
  hoveredListing,
  selectedCommunity,
  onSelectListing,
  onHoverListing,
  onSelectCommunity,
  onBoundsChange,
  center = { lat: 30.2672, lng: -97.7431 }, // Austin center
  zoom = 11
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const polygonsRef = useRef<Map<string, L.Polygon>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize Leaflet (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initLeaflet = async () => {
      if (!L) {
        L = await import('leaflet');
        // Fix default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });
      }

      if (mapContainerRef.current && !mapRef.current) {
        const map = L.map(mapContainerRef.current, {
          // Reduce scroll sensitivity - requires more deliberate scrolling
          scrollWheelZoom: true,
          wheelDebounceTime: 100,
          wheelPxPerZoomLevel: 120, // Higher = less sensitive (default is 60)
          // Touch handling
          touchZoom: true,
          dragging: true,
          // Zoom snapping for smoother behavior
          zoomSnap: 0.5,
          zoomDelta: 0.5,
        });

        // If we have a selectedCommunity with coordinates, fit to it immediately
        // Otherwise use the default center/zoom
        if (selectedCommunity?.coordinates && selectedCommunity.coordinates.length >= 3) {
          const latLngs = selectedCommunity.coordinates.map((c: any) =>
            Array.isArray(c) ? L!.latLng(c[0], c[1]) : L!.latLng(c.lat, c.lng)
          );
          const bounds = L.latLngBounds(latLngs);
          map.fitBounds(bounds, { padding: [30, 30], maxZoom: 15 });
        } else {
          map.setView([center.lat, center.lng], zoom);
        }
        
        // CartoDB Positron – clean, light base map
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }).addTo(map);

        // Track bounds changes
        map.on('moveend', () => {
          const bounds = map.getBounds();
          onBoundsChange?.({
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest()
          });
        });

        mapRef.current = map;
        setIsLoaded(true);
      }
    };

    initLeaflet();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when listings change
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !L) return;

    const map = mapRef.current;
    
    // Clear old markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current.clear();

    // Add new markers
    listings.forEach(listing => {
      if (!L) return;
      const isSelected = selectedListing?.id === listing.id;
      const isHovered = hoveredListing?.id === listing.id;
      const isHighlighted = isSelected || isHovered;
      
      // Custom price marker
      const priceLabel = listing.price >= 1000000
        ? `$${(listing.price / 1000000).toFixed(1)}M`
        : `$${Math.round(listing.price / 1000)}K`;

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="relative" style="z-index: ${isHighlighted ? 1000 : 1}">
            <div class="px-2 py-1 rounded text-xs font-semibold whitespace-nowrap shadow-md transition-all ${
              isHighlighted 
                ? 'bg-[#E85A24] text-white scale-110' 
                : 'bg-white text-gray-900 border border-gray-200'
            }">
              ${priceLabel}
            </div>
            <div class="absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 ${
              isHighlighted
                ? 'border-l-transparent border-r-transparent border-t-[#E85A24]'
                : 'border-l-transparent border-r-transparent border-t-white'
            }"></div>
          </div>
        `,
        iconSize: [80, 30],
        iconAnchor: [40, 30]
      });

      const marker = L.marker([listing.coordinates.lat, listing.coordinates.lng], { icon })
        .addTo(map);

      // Create Zillow-style popup card
      const photoCount = listing.photos?.length || 0;
      const popupContent = `
        <div class="listing-popup" style="width: 300px; cursor: pointer; background: white; border-radius: 12px; overflow: hidden;">
          <div style="position: relative;">
            <img 
              src="${listing.photos?.[0] || '/placeholder-home.jpg'}" 
              alt="${listing.address?.street || 'Property'}"
              style="width: 100%; height: 180px; object-fit: cover;"
              onerror="this.src='/placeholder-home.jpg'"
            />
            <!-- Status badge -->
            <div style="position: absolute; top: 10px; left: 10px; background: rgba(255,255,255,0.95); padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; color: #333; text-transform: capitalize;">
              ${listing.status || 'Active'}
            </div>
            <!-- Heart button -->
            <button style="position: absolute; top: 10px; right: 10px; width: 36px; height: 36px; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" onclick="event.stopPropagation();">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <!-- Photo count indicator -->
            ${photoCount > 1 ? `
              <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; gap: 4px;">
                ${Array.from({length: Math.min(photoCount, 6)}, (_, i) => `
                  <div style="width: 6px; height: 6px; border-radius: 50%; background: ${i === 0 ? 'white' : 'rgba(255,255,255,0.5)'}; box-shadow: 0 1px 2px rgba(0,0,0,0.3);"></div>
                `).join('')}
              </div>
            ` : ''}
          </div>
          <div style="padding: 14px 16px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div style="font-size: 22px; font-weight: 700; color: #111;">${formatPrice(listing.price)}</div>
            </div>
            <div style="display: flex; gap: 8px; margin-top: 6px; font-size: 14px; color: #333;">
              <span><strong>${listing.bedrooms}</strong> bds</span>
              <span style="color: #999;">|</span>
              <span><strong>${listing.bathrooms}</strong> ba</span>
              <span style="color: #999;">|</span>
              <span><strong>${listing.sqft?.toLocaleString() || '—'}</strong> sqft</span>
              <span style="color: #999;">-</span>
              <span style="color: #666;">${listing.status || 'Active'}</span>
            </div>
            <div style="margin-top: 10px; font-size: 14px; color: #444; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${listing.address?.street || ''}, ${listing.address?.city || ''}, TX ${listing.address?.zip || ''}
            </div>
            <div style="margin-top: 6px; font-size: 11px; color: #888; text-transform: uppercase;">
              ${'SPYGLASS REALTY'}
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: true,
        maxWidth: 320,
        minWidth: 300,
        className: 'listing-popup-container',
        offset: [0, -15]
      });

      marker
        .on('click', () => {
          // Only open popup on click - don't trigger the full overlay
          marker.openPopup();
        })
        .on('mouseover', () => onHoverListing?.(listing))
        .on('mouseout', () => onHoverListing?.(null));

      // Add click handler for the popup card after it opens
      marker.on('popupopen', () => {
        const popupEl = document.querySelector('.listing-popup-container .listing-popup');
        if (popupEl) {
          popupEl.addEventListener('click', (e) => {
            // Navigate to the listing detail page
            onSelectListing?.(listing);
          });
        }
      });

      markersRef.current.set(listing.id, marker);
    });
  }, [isLoaded, listings, selectedListing, hoveredListing]);

  // Update community polygons
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !L) return;

    const map = mapRef.current;
    
    // Clear old polygons
    polygonsRef.current.forEach(polygon => polygon.remove());
    polygonsRef.current.clear();

    // Add community polygons
    communities.forEach(community => {
      if (!L) return;
      if (!community.coordinates || community.coordinates.length < 3) return;
      const isSelected = selectedCommunity?.id === community.id;
      // Handle both array format [lat, lng] and object format {lat, lng}
      const latLngs = community.coordinates.map(c => 
        Array.isArray(c) ? [c[0], c[1]] as [number, number] : [c.lat, c.lng] as [number, number]
      );
      
      const polygon = L.polygon(latLngs, {
        color: isSelected ? '#E85A24' : '#E8845A',
        weight: isSelected ? 2.5 : 1.5,
        fillColor: isSelected ? '#E85A24' : '#E8845A',
        fillOpacity: isSelected ? 0.2 : 0.15,
        dashArray: isSelected ? undefined : '4 6',
      })
        .addTo(map)
        .on('click', () => onSelectCommunity?.(community));

      // Add tooltip with community name
      polygon.bindTooltip(community.name, {
        permanent: false,
        direction: 'center',
        className: 'community-tooltip'
      });

      polygonsRef.current.set(community.id, polygon);
    });
  }, [isLoaded, communities, selectedCommunity]);

  // Pan to selected listing
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !selectedListing) return;
    mapRef.current.panTo([selectedListing.coordinates.lat, selectedListing.coordinates.lng]);
  }, [isLoaded, selectedListing]);

  // Fit map to selected community polygon
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !selectedCommunity || !L) return;
    
    // Calculate bounds from polygon coordinates
    if (selectedCommunity.coordinates && selectedCommunity.coordinates.length >= 3) {
      const latLngs = selectedCommunity.coordinates.map(c => 
        Array.isArray(c) ? L!.latLng(c[0], c[1]) : L!.latLng(c.lat, c.lng)
      );
      const bounds = L.latLngBounds(latLngs);
      // Tighter zoom: smaller padding, higher minZoom
      mapRef.current.fitBounds(bounds, { 
        padding: [20, 20], 
        maxZoom: 16,  // Allow closer zoom
        animate: true 
      });
    } else if (selectedCommunity.bounds) {
      const { north, south, east, west } = selectedCommunity.bounds;
      mapRef.current.fitBounds([[south, west], [north, east]], { 
        padding: [20, 20], 
        maxZoom: 16,
        animate: true 
      });
    } else if (selectedCommunity.center) {
      mapRef.current.setView([selectedCommunity.center.lat, selectedCommunity.center.lng], 15);
    }
  }, [isLoaded, selectedCommunity]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="absolute inset-0" />
      
      {/* Selected community floating panel */}
      {selectedCommunity && (
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-xl shadow-lg z-[1000] border border-gray-200">
          <div className="text-sm text-gray-500 mb-0.5">
            {listings.length > 0
              ? `${listings.length} properties`
              : 'Loading...'}
          </div>
          <div className="text-base font-bold text-gray-900">
            {selectedCommunity.name}
          </div>
        </div>
      )}

      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-500">Loading map...</div>
        </div>
      )}

      {/* Popup styles */}
      <style jsx global>{`
        .listing-popup-container .leaflet-popup-content-wrapper {
          padding: 0 !important;
          border-radius: 12px !important;
          overflow: hidden;
        }
        .listing-popup-container .leaflet-popup-content {
          margin: 0 !important;
          width: 300px !important;
        }
        .community-tooltip {
          background: rgba(255, 255, 255, 0.95) !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          padding: 6px 10px !important;
          font-size: 13px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12) !important;
          color: #1a1a1a !important;
        }
      `}</style>
    </div>
  );
}

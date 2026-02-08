'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { CommunityPolygon } from '@/types/community';
import { Listing } from '@/types/listing';
import { useRouter } from 'next/navigation';
import type * as LeafletType from 'leaflet';

// ── Color palette: ~20 distinct pastel/muted colors ──
const PALETTE = [
  '#A8D8B9', // soft green
  '#7EC8C8', // teal
  '#89B4E8', // light blue
  '#B8A9D4', // soft purple
  '#F2C68A', // light orange
  '#9DD5C0', // mint
  '#76B8DE', // sky blue
  '#C4A6D7', // lavender
  '#E8C1A0', // peach
  '#82CFA0', // spring green
  '#6DB3C4', // steel teal
  '#A1C4F0', // periwinkle
  '#D4B8E0', // orchid
  '#F0D8A0', // gold
  '#78C8B4', // seafoam
  '#92A8D8', // slate blue
  '#C8D4A0', // sage
  '#E0A8B0', // rose
  '#A8D0E8', // powder blue
  '#B0D890', // lime
];

// Deterministic hash of a string → palette index
function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % PALETTE.length;
}

function getFillColor(name: string): string {
  return PALETTE[hashName(name)];
}

// Darken a hex color for borders
function darkenColor(hex: string, factor = 0.3): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const dr = Math.round(r * (1 - factor));
  const dg = Math.round(g * (1 - factor));
  const db = Math.round(b * (1 - factor));
  return `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;
}

// Compute centroid of a polygon (array of [lat, lng])
function centroid(coords: [number, number][]): [number, number] {
  let latSum = 0;
  let lngSum = 0;
  for (const [lat, lng] of coords) {
    latSum += lat;
    lngSum += lng;
  }
  return [latSum / coords.length, lngSum / coords.length];
}

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
  const mapRef = useRef<LeafletType.Map | null>(null);
  const leafletRef = useRef<typeof LeafletType | null>(null);
  const geoJsonLayerRef = useRef<LeafletType.GeoJSON | null>(null);
  const labelsLayerRef = useRef<LeafletType.LayerGroup | null>(null);
  const markersLayerRef = useRef<LeafletType.LayerGroup | null>(null);
  const countBadgesLayerRef = useRef<LeafletType.LayerGroup | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [zoomLevel, setZoomLevel] = useState(10);
  const hoveredRef = useRef<string | null>(null);
  const selectedRef = useRef<string | null>(null);
  const prevBoundsRef = useRef<LeafletType.LatLngBounds | null>(null);

  // Keep selectedRef in sync
  useEffect(() => {
    selectedRef.current = selectedCommunity?.id ?? null;
  }, [selectedCommunity]);

  // ── Initialize Leaflet ──
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initLeaflet = async () => {
      if (!leafletRef.current) {
        const L = await import('leaflet');
        leafletRef.current = L;
      }

      const L = leafletRef.current;
      if (!mapContainerRef.current || mapRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [30.2672, -97.7431],
        zoom: 12,
        scrollWheelZoom: true,
        zoomSnap: 0.5,
        zoomDelta: 0.5,
      });

      // CartoDB Positron – clean, light base map
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map);

      // Create layer groups
      labelsLayerRef.current = L.layerGroup().addTo(map);
      countBadgesLayerRef.current = L.layerGroup().addTo(map);
      markersLayerRef.current = L.layerGroup().addTo(map);

      map.on('zoomend', () => {
        setZoomLevel(map.getZoom());
      });

      // Click on empty area → deselect
      map.on('click', (e: LeafletType.LeafletMouseEvent) => {
        // Only deselect if click wasn't on a feature (handled by GeoJSON layer)
        const target = e.originalEvent?.target as HTMLElement | undefined;
        if (target && target.classList?.contains('leaflet-interactive')) return;
        if (selectedRef.current) {
          onSelectCommunity?.(null);
          // Zoom back out
          if (prevBoundsRef.current) {
            map.flyTo([30.2672, -97.7431], 12, { duration: 0.8 });
            prevBoundsRef.current = null;
          }
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fit map to show all communities when filter changes ──
  const prevCommunitiesCountRef = useRef<number>(-1);
  const isInitialLoadRef = useRef<boolean>(true);
  useEffect(() => {
    const L = leafletRef.current;
    if (!isLoaded || !mapRef.current || !L || communities.length === 0) return;
    if (selectedCommunity) return;
    // Skip fitting on very first load — use the default Austin center/zoom
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      prevCommunitiesCountRef.current = communities.length;
      return;
    }
    // Only re-fit when the communities list actually changes (filter tab switch)
    if (prevCommunitiesCountRef.current === communities.length) return;
    prevCommunitiesCountRef.current = communities.length;

    const allCoords: [number, number][] = [];
    communities.forEach((c) => {
      if (!c.coordinates || c.coordinates.length < 3) return;
      c.coordinates.forEach((coord) => {
        if (Array.isArray(coord)) allCoords.push([coord[0], coord[1]]);
        else allCoords.push([coord.lat, coord.lng]);
      });
    });

    if (allCoords.length > 0) {
      const bounds = L.latLngBounds(allCoords.map(([lat, lng]) => L.latLng(lat, lng)));
      mapRef.current.flyToBounds(bounds, { padding: [30, 30], duration: 0.8 });
    }
  }, [isLoaded, communities, selectedCommunity]);

  // ── Build GeoJSON feature collection from communities ──
  const buildGeoJson = useCallback((): GeoJSON.FeatureCollection => {
    const features: GeoJSON.Feature[] = communities
      .filter((c) => c.coordinates && c.coordinates.length >= 3)
      .map((community) => {
        // Convert coordinates to GeoJSON [lng, lat] ring
        const ring = community.coordinates.map((c) => {
          if (Array.isArray(c)) return [c[1], c[0]] as [number, number];
          return [c.lng, c.lat] as [number, number];
        });
        // Ensure ring is closed
        if (
          ring.length > 0 &&
          (ring[0][0] !== ring[ring.length - 1][0] ||
            ring[0][1] !== ring[ring.length - 1][1])
        ) {
          ring.push([...ring[0]] as [number, number]);
        }

        return {
          type: 'Feature' as const,
          properties: {
            id: community.id,
            name: community.name,
            slug: community.slug || community.id,
            listingsCount: community.listingsCount,
          },
          geometry: {
            type: 'Polygon' as const,
            coordinates: [ring],
          },
        };
      });

    return { type: 'FeatureCollection', features };
  }, [communities]);

  // ── Draw community polygons via GeoJSON layer ──
  useEffect(() => {
    const L = leafletRef.current;
    if (!isLoaded || !mapRef.current || !L) return;

    const map = mapRef.current;

    // Remove previous GeoJSON layer
    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
      geoJsonLayerRef.current = null;
    }

    const geojson = buildGeoJson();

    const geoJsonLayer = L.geoJSON(geojson, {
      style: (feature) => {
        const name = feature?.properties?.name || '';
        const id = feature?.properties?.id || '';
        const isSelected = selectedCommunity?.id === id;
        const fill = getFillColor(name);
        const border = darkenColor(fill, 0.35);

        return {
          color: isSelected ? '#E85A24' : border,
          weight: isSelected ? 3 : 1,
          fillColor: fill,
          fillOpacity: isSelected ? 0.6 : 0.35,
          className: 'community-polygon',
        };
      },
      onEachFeature: (feature, layer) => {
        const id = feature.properties?.id;
        const name = feature.properties?.name;
        const slug = feature.properties?.slug || id;
        const listingsCount = feature.properties?.listingsCount;

        // Popup with "View Community" link (shown on click)
        const popupContent = `
          <div style="text-align: center; padding: 4px 0;">
            <div style="font-weight: 700; font-size: 15px; margin-bottom: 4px; color: #111;">${name}</div>
            ${listingsCount ? `<div style="font-size: 12px; color: #666; margin-bottom: 8px;">${listingsCount} active listings</div>` : ''}
            <a href="/communities/${slug}" 
               style="display: inline-block; background: #EF4923; color: white; padding: 6px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; text-decoration: none; transition: background 0.2s;"
               onmouseover="this.style.background='#d63e1a'"
               onmouseout="this.style.background='#EF4923'"
            >View Community →</a>
          </div>
        `;

        layer.bindPopup(popupContent, {
          closeButton: true,
          maxWidth: 220,
          minWidth: 180,
          className: 'community-popup-container',
          offset: [0, -5],
        });

        // Tooltip on hover (name only)
        const tooltipContent = listingsCount
          ? `<strong>${name}</strong><br/><span style="font-size:11px; color:#666;">${listingsCount} listings · Click to explore</span>`
          : `<strong>${name}</strong><br/><span style="font-size:11px; color:#666;">Click to explore</span>`;

        layer.bindTooltip(tooltipContent, {
          sticky: true,
          direction: 'top',
          className: 'community-tooltip',
          offset: [0, -10],
        });

        // Hover
        layer.on('mouseover', () => {
          hoveredRef.current = id;
          const pathLayer = layer as LeafletType.Path;
          const isSelected = selectedRef.current === id;
          pathLayer.setStyle({
            fillOpacity: isSelected ? 0.6 : 0.5,
            weight: isSelected ? 3 : 2,
          });
          (pathLayer.getElement() as HTMLElement | undefined)?.style.setProperty('cursor', 'pointer');
        });

        layer.on('mouseout', () => {
          hoveredRef.current = null;
          const pathLayer = layer as LeafletType.Path;
          const isSelected = selectedRef.current === id;
          pathLayer.setStyle({
            fillOpacity: isSelected ? 0.6 : 0.35,
            weight: isSelected ? 3 : 1,
          });
        });

        // Click → navigate directly to community page
        layer.on('click', (e: LeafletType.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e);
          router.push(`/communities/${slug}`);
        });
      },
    }).addTo(map);

    geoJsonLayerRef.current = geoJsonLayer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, communities, selectedCommunity, buildGeoJson]);

  // ── Draw labels (zoom-aware) ──
  useEffect(() => {
    const L = leafletRef.current;
    if (!isLoaded || !mapRef.current || !L || !labelsLayerRef.current) return;

    const map = mapRef.current;
    const labelsLayer = labelsLayerRef.current;
    labelsLayer.clearLayers();

    // Hide labels at very low zoom
    if (zoomLevel < 10) return;

    // Font size scales with zoom
    const fontSize = zoomLevel <= 10 ? 10 : zoomLevel <= 11 ? 11 : zoomLevel <= 12 ? 13 : zoomLevel <= 13 ? 14 : 16;

    // Only show labels for visible communities at lower zoom
    const mapBounds = map.getBounds();

    communities.forEach((community) => {
      if (!community.coordinates || community.coordinates.length < 3) return;

      // Compute centroid in [lat, lng]
      const latLngs: [number, number][] = community.coordinates.map((c) => {
        if (Array.isArray(c)) return [c[0], c[1]] as [number, number];
        return [c.lat, c.lng] as [number, number];
      });

      const center = centroid(latLngs);

      // Skip if not in viewport
      if (!mapBounds.contains(L.latLng(center[0], center[1]))) return;

      // At lower zoom, only show labels for bigger polygons (approximate via bounds spread)
      if (zoomLevel <= 11) {
        const lats = latLngs.map((ll) => ll[0]);
        const lngs = latLngs.map((ll) => ll[1]);
        const spread =
          (Math.max(...lats) - Math.min(...lats)) *
          (Math.max(...lngs) - Math.min(...lngs));
        if (spread < 0.0001) return; // skip tiny areas at low zoom
      }

      // Name label (offset above center)
      const label = L.marker(L.latLng(center[0], center[1]), {
        icon: L.divIcon({
          className: 'community-label-icon',
          html: `<span style="
            font-weight: 700;
            font-size: ${fontSize}px;
            color: #1a1a1a;
            text-shadow: 0 0 4px white, 0 0 4px white, 0 0 6px white;
            white-space: nowrap;
            pointer-events: none;
            user-select: none;
          ">${community.name}</span>`,
          iconSize: [0, 0],
          iconAnchor: [0, community.listingsCount ? 14 : 0],
        }),
        interactive: false,
      });

      labelsLayer.addLayer(label);
    });
  }, [isLoaded, communities, zoomLevel]);

  // ── Draw listing count badges ──
  useEffect(() => {
    const L = leafletRef.current;
    if (!isLoaded || !mapRef.current || !L || !countBadgesLayerRef.current) return;

    const map = mapRef.current;
    const badgesLayer = countBadgesLayerRef.current;
    badgesLayer.clearLayers();

    // Hide badges at very low zoom or when a community is selected (show price pins instead)
    if (zoomLevel < 10 || selectedCommunity) return;

    const mapBounds = map.getBounds();

    communities.forEach((community) => {
      if (!community.coordinates || community.coordinates.length < 3) return;
      if (!community.listingsCount || community.listingsCount === 0) return;

      const latLngs: [number, number][] = community.coordinates.map((c) => {
        if (Array.isArray(c)) return [c[0], c[1]] as [number, number];
        return [c.lat, c.lng] as [number, number];
      });

      const center = centroid(latLngs);
      if (!mapBounds.contains(L.latLng(center[0], center[1]))) return;

      // At lower zoom, skip tiny polygons
      if (zoomLevel <= 11) {
        const lats = latLngs.map((ll) => ll[0]);
        const lngs = latLngs.map((ll) => ll[1]);
        const spread = (Math.max(...lats) - Math.min(...lats)) * (Math.max(...lngs) - Math.min(...lngs));
        if (spread < 0.0001) return;
      }

      const count = community.listingsCount;
      const size = count >= 100 ? 40 : count >= 50 ? 36 : count >= 10 ? 32 : 28;

      const badge = L.marker(L.latLng(center[0], center[1]), {
        icon: L.divIcon({
          className: 'count-badge-icon',
          html: `<div style="
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: #0ea5e9;
            color: white;
            font-weight: 700;
            font-size: ${count >= 100 ? 13 : 14}px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            border: 2px solid white;
            cursor: pointer;
          ">${count}</div>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, -4],
        }),
        interactive: true,
      });

      badge.on('click', () => {
        const communitySlug = community.slug || community.id;
        router.push(`/communities/${communitySlug}`);
      });

      badgesLayer.addLayer(badge);
    });
  }, [isLoaded, communities, zoomLevel, selectedCommunity, onSelectCommunity]);

  // ── Fetch listings for selected community ──
  useEffect(() => {
    const L = leafletRef.current;
    if (!isLoaded || !mapRef.current || !L) return;
    if (!selectedCommunity) {
      setListings([]);
      return;
    }

    const fetchListings = async () => {
      try {
        // Use polygon coordinates for accurate in-neighborhood search
        const polygon = selectedCommunity.coordinates?.length >= 3
          ? selectedCommunity.coordinates.map((c) => {
              if (Array.isArray(c)) return { lat: c[0], lng: c[1] };
              return { lat: c.lat, lng: c.lng };
            })
          : undefined;

        const response = await fetch('/api/listings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...(polygon ? { polygon } : { bounds: selectedCommunity.bounds }),
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
  }, [isLoaded, selectedCommunity]);

  // ── Draw property markers ──
  useEffect(() => {
    const L = leafletRef.current;
    if (!isLoaded || !mapRef.current || !L || !markersLayerRef.current) return;

    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    if (listings.length === 0) return;

    listings.forEach((listing) => {
      const priceLabel =
        listing.price >= 1000000
          ? `$${(listing.price / 1000000).toFixed(1)}M`
          : `$${Math.round(listing.price / 1000)}K`;

      const icon = L.divIcon({
        className: 'listing-marker',
        html: `
          <div class="relative">
            <div class="px-2 py-1 rounded text-xs font-semibold whitespace-nowrap shadow-md bg-[#E85A24] text-white cursor-pointer hover:scale-110 transition-transform">
              ${priceLabel}
            </div>
            <div class="absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#E85A24]"></div>
          </div>
        `,
        iconSize: [80, 30],
        iconAnchor: [40, 30],
      });

      L.marker([listing.coordinates.lat, listing.coordinates.lng], { icon })
        .addTo(markersLayer)
        .on('click', () => {
          window.location.href = `/listing/${listing.mlsNumber}`;
        });
    });
  }, [isLoaded, listings, zoomLevel]);

  // ── Pan/zoom to selected community ──
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !selectedCommunity?.bounds) return;

    const { north, south, east, west } = selectedCommunity.bounds;
    mapRef.current.flyToBounds(
      [
        [south, west],
        [north, east],
      ],
      {
        padding: [50, 50],
        maxZoom: 16,
        duration: 0.8,
      }
    );
  }, [isLoaded, selectedCommunity]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="absolute inset-0" />

      {/* Listings count floating panel */}
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

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-500">Loading map...</div>
        </div>
      )}

      {/* Tooltip & label styles */}
      <style jsx global>{`
        .community-polygon {
          transition: fill-opacity 0.2s ease, stroke-width 0.2s ease;
          cursor: pointer;
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
        .community-tooltip::before {
          border-top-color: rgba(255, 255, 255, 0.95) !important;
        }
        .community-popup-container .leaflet-popup-content-wrapper {
          border-radius: 10px !important;
          padding: 4px !important;
        }
        .community-popup-container .leaflet-popup-content {
          margin: 8px 12px !important;
        }
        .community-label-icon {
          background: none !important;
          border: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .count-badge-icon {
          background: none !important;
          border: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
      `}</style>
    </div>
  );
}

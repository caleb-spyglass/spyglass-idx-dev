'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Listing } from '@/types/listing';
import { CommunityPolygon } from '@/types/community';
import { formatPrice } from '@/lib/mock-data';
import type * as LeafletType from 'leaflet';

// ── Color palette matching CommunitiesMap ──
const PALETTE = [
  '#A8D8B9', '#7EC8C8', '#89B4E8', '#B8A9D4', '#F2C68A',
  '#9DD5C0', '#76B8DE', '#C4A6D7', '#E8C1A0', '#82CFA0',
  '#6DB3C4', '#A1C4F0', '#D4B8E0', '#F0D8A0', '#78C8B4',
  '#92A8D8', '#C8D4A0', '#E0A8B0', '#A8D0E8', '#B0D890',
];

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

function darkenColor(hex: string, factor = 0.3): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const dr = Math.round(r * (1 - factor));
  const dg = Math.round(g * (1 - factor));
  const db = Math.round(b * (1 - factor));
  return `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;
}

function centroid(coords: [number, number][]): [number, number] {
  let latSum = 0;
  let lngSum = 0;
  for (const [lat, lng] of coords) {
    latSum += lat;
    lngSum += lng;
  }
  return [latSum / coords.length, lngSum / coords.length];
}

interface MapViewProps {
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

export function MapView({
  listings,
  communities = [],
  selectedListing,
  hoveredListing,
  selectedCommunity,
  onSelectListing,
  onHoverListing,
  onSelectCommunity,
  onBoundsChange,
  center = { lat: 30.2672, lng: -97.7431 },
  zoom = 11,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletType.Map | null>(null);
  const leafletRef = useRef<typeof LeafletType | null>(null);
  const geoJsonLayerRef = useRef<LeafletType.GeoJSON | null>(null);
  const labelsLayerRef = useRef<LeafletType.LayerGroup | null>(null);
  const markersLayerRef = useRef<LeafletType.LayerGroup | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(zoom);
  const hoveredRef = useRef<string | null>(null);
  const selectedRef = useRef<string | null>(null);

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
        // Fix default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });
      }

      const L = leafletRef.current;
      if (!mapContainerRef.current || mapRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [center.lat, center.lng],
        zoom,
        scrollWheelZoom: true,
        wheelDebounceTime: 100,
        wheelPxPerZoomLevel: 120,
        zoomSnap: 0.5,
        zoomDelta: 0.5,
      });

      // CartoDB Positron – clean, light base map (matches CommunitiesMap)
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
      markersLayerRef.current = L.layerGroup().addTo(map);

      map.on('zoomend', () => {
        setZoomLevel(map.getZoom());
      });

      map.on('moveend', () => {
        const bounds = map.getBounds();
        onBoundsChange?.({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        });
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

  // ── Build GeoJSON from communities ──
  const buildGeoJson = useCallback((): GeoJSON.FeatureCollection => {
    const features: GeoJSON.Feature[] = communities
      .filter((c) => c.coordinates && c.coordinates.length >= 3)
      .map((community) => {
        const ring = community.coordinates.map((c) => {
          if (Array.isArray(c)) return [c[1], c[0]] as [number, number]; // [lat,lng] → [lng,lat]
          return [c.lng, c.lat] as [number, number];
        });
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

  // ── Draw community polygons ──
  useEffect(() => {
    const L = leafletRef.current;
    if (!isLoaded || !mapRef.current || !L) return;

    const map = mapRef.current;

    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
      geoJsonLayerRef.current = null;
    }

    if (communities.length === 0) return;

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
        const listingsCount = feature.properties?.listingsCount;

        const tooltipContent = listingsCount
          ? `<strong>${name}</strong><br/>${listingsCount} listings`
          : `<strong>${name}</strong>`;

        layer.bindTooltip(tooltipContent, {
          sticky: true,
          direction: 'top',
          className: 'community-tooltip',
          offset: [0, -10],
        });

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

        layer.on('click', (e: LeafletType.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e);
          const community = communities.find((c) => c.id === id);
          if (community) {
            onSelectCommunity?.(community);
          }
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

    if (zoomLevel < 10 || communities.length === 0) return;

    const fontSize = zoomLevel <= 10 ? 10 : zoomLevel <= 11 ? 11 : zoomLevel <= 12 ? 13 : zoomLevel <= 13 ? 14 : 16;
    const mapBounds = map.getBounds();

    communities.forEach((community) => {
      if (!community.coordinates || community.coordinates.length < 3) return;

      const latLngs: [number, number][] = community.coordinates.map((c) => {
        if (Array.isArray(c)) return [c[0], c[1]] as [number, number];
        return [c.lat, c.lng] as [number, number];
      });

      const center = centroid(latLngs);
      if (!mapBounds.contains(L.latLng(center[0], center[1]))) return;

      if (zoomLevel <= 11) {
        const lats = latLngs.map((ll) => ll[0]);
        const lngs = latLngs.map((ll) => ll[1]);
        const spread =
          (Math.max(...lats) - Math.min(...lats)) *
          (Math.max(...lngs) - Math.min(...lngs));
        if (spread < 0.0001) return;
      }

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
          iconAnchor: [0, 0],
        }),
        interactive: false,
      });

      labelsLayer.addLayer(label);
    });
  }, [isLoaded, communities, zoomLevel]);

  // ── Draw listing markers ──
  useEffect(() => {
    const L = leafletRef.current;
    if (!isLoaded || !mapRef.current || !L || !markersLayerRef.current) return;

    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    listings.forEach((listing) => {
      if (!listing.coordinates?.lat || !listing.coordinates?.lng) return;
      
      const isSelected = selectedListing?.id === listing.id;
      const isHovered = hoveredListing?.id === listing.id;
      const isHighlighted = isSelected || isHovered;

      const priceLabel =
        listing.price >= 1000000
          ? `$${(listing.price / 1000000).toFixed(1)}M`
          : `$${Math.round(listing.price / 1000)}K`;

      const icon = L.divIcon({
        className: 'listing-marker',
        html: `
          <div class="relative" style="z-index: ${isHighlighted ? 1000 : 1}">
            <div class="px-2 py-1 rounded text-xs font-semibold whitespace-nowrap shadow-md transition-all ${
              isHighlighted
                ? 'bg-[#E85A24] text-white scale-110'
                : 'bg-white text-gray-900 border border-gray-200'
            }" style="cursor: pointer;">
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
        iconAnchor: [40, 30],
      });

      const marker = L.marker([listing.coordinates.lat, listing.coordinates.lng], { icon })
        .addTo(markersLayer);

      // Popup with listing card
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
            <div style="position: absolute; top: 10px; left: 10px; background: rgba(255,255,255,0.95); padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; color: #333; text-transform: capitalize;">
              ${listing.status || 'Active'}
            </div>
            ${photoCount > 1 ? `
              <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; gap: 4px;">
                ${Array.from({length: Math.min(photoCount, 6)}, (_, i) => `
                  <div style="width: 6px; height: 6px; border-radius: 50%; background: ${i === 0 ? 'white' : 'rgba(255,255,255,0.5)'}; box-shadow: 0 1px 2px rgba(0,0,0,0.3);"></div>
                `).join('')}
              </div>
            ` : ''}
          </div>
          <div style="padding: 14px 16px;">
            <div style="font-size: 22px; font-weight: 700; color: #111;">${formatPrice(listing.price)}</div>
            <div style="display: flex; gap: 8px; margin-top: 6px; font-size: 14px; color: #333;">
              <span><strong>${listing.bedrooms}</strong> bds</span>
              <span style="color: #999;">|</span>
              <span><strong>${listing.bathrooms}</strong> ba</span>
              <span style="color: #999;">|</span>
              <span><strong>${listing.sqft?.toLocaleString() || '—'}</strong> sqft</span>
            </div>
            <div style="margin-top: 10px; font-size: 14px; color: #444; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${listing.address?.street || ''}, ${listing.address?.city || ''}, TX ${listing.address?.zip || ''}
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: true,
        maxWidth: 320,
        minWidth: 300,
        className: 'listing-popup-container',
        offset: [0, -15],
      });

      marker
        .on('click', () => marker.openPopup())
        .on('mouseover', () => onHoverListing?.(listing))
        .on('mouseout', () => onHoverListing?.(null));

      marker.on('popupopen', () => {
        const popupEl = document.querySelector('.listing-popup-container .listing-popup');
        if (popupEl) {
          popupEl.addEventListener('click', () => {
            onSelectListing?.(listing);
          });
        }
      });
    });
  }, [isLoaded, listings, selectedListing, hoveredListing, onSelectListing, onHoverListing]);

  // ── Pan to selected listing ──
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !selectedListing?.coordinates) return;
    mapRef.current.panTo([selectedListing.coordinates.lat, selectedListing.coordinates.lng]);
  }, [isLoaded, selectedListing]);

  // ── Fit to selected community ──
  useEffect(() => {
    const L = leafletRef.current;
    if (!isLoaded || !mapRef.current || !selectedCommunity || !L) return;

    if (selectedCommunity.coordinates && selectedCommunity.coordinates.length >= 3) {
      const latLngs = selectedCommunity.coordinates.map((c) =>
        Array.isArray(c) ? L.latLng(c[0], c[1]) : L.latLng(c.lat, c.lng)
      );
      const bounds = L.latLngBounds(latLngs);
      mapRef.current.flyToBounds(bounds, { padding: [50, 50], maxZoom: 16, duration: 0.8 });
    } else if (selectedCommunity.bounds) {
      const { north, south, east, west } = selectedCommunity.bounds;
      mapRef.current.flyToBounds(
        [[south, west], [north, east]],
        { padding: [50, 50], maxZoom: 16, duration: 0.8 }
      );
    }
  }, [isLoaded, selectedCommunity]);

  // ── Fit map to all listings when they change (and no community is selected) ──
  useEffect(() => {
    const L = leafletRef.current;
    if (!isLoaded || !mapRef.current || !L || selectedCommunity) return;
    if (listings.length === 0) return;

    const validListings = listings.filter((l) => l.coordinates?.lat && l.coordinates?.lng);
    if (validListings.length === 0) return;

    const latLngs = validListings.map((l) => L.latLng(l.coordinates.lat, l.coordinates.lng));
    const bounds = L.latLngBounds(latLngs);
    mapRef.current.flyToBounds(bounds, { padding: [50, 50], maxZoom: 15, duration: 0.8 });
  }, [isLoaded, listings, selectedCommunity]);

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

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-500">Loading map...</div>
        </div>
      )}

      {/* Styles matching CommunitiesMap */}
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
        .community-label-icon {
          background: none !important;
          border: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .listing-popup-container .leaflet-popup-content-wrapper {
          padding: 0 !important;
          border-radius: 12px !important;
          overflow: hidden;
        }
        .listing-popup-container .leaflet-popup-content {
          margin: 0 !important;
          width: 300px !important;
        }
      `}</style>
    </div>
  );
}

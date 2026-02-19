'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Listing } from '@/types/listing';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface MLSMapViewProps {
  /** Listings to display on the map */
  listings: Listing[];
  /** Zip code polygons with data */
  zipCodePolygons?: Array<{
    zipCode: string;
    name: string;
    slug: string;
    polygon: Array<[number, number]>; // [lat, lng]
    listingsCount: number;
    medianPrice: number;
  }>;
  /** Community polygons with data */
  communityPolygons?: Array<{
    slug: string;
    name: string;
    polygon: Array<[number, number]>; // [lat, lng]
    listingsCount: number;
    medianPrice: number;
  }>;
  /** Center point for the map */
  center?: { lat: number; lng: number };
  /** Zoom level */
  zoom?: number;
  /** Show listing markers */
  showListings?: boolean;
  /** Show polygons */
  showPolygons?: boolean;
  /** Show listing counts on polygons */
  showListingCounts?: boolean;
  /** Callback when a listing is clicked */
  onListingClick?: (listing: Listing) => void;
  /** Callback when a polygon is clicked */
  onPolygonClick?: (slug: string, type: 'zip' | 'community') => void;
}

// Color schemes
const PRICE_COLORS = {
  low: '#10B981',     // Green for under $500k
  medium: '#F59E0B',  // Orange for $500k-$1M
  high: '#EF4444',    // Red for over $1M
  premium: '#8B5CF6', // Purple for over $2M
};

const POLYGON_COLORS = {
  zip: '#3B82F6',     // Blue for zip codes
  community: '#10B981', // Green for communities
};

export default function MLSMapView({
  listings,
  zipCodePolygons = [],
  communityPolygons = [],
  center = { lat: 30.2672, lng: -97.7431 }, // Austin center
  zoom = 11,
  showListings = true,
  showPolygons = true,
  showListingCounts = true,
  onListingClick,
  onPolygonClick,
}: MLSMapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN || mapLoaded) return;
    
    // Dynamic import to avoid SSR
    import('mapbox-gl')
      .then((mapboxgl) => {
        // Import CSS
        const link = document.createElement('link');
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        mapboxgl.default.accessToken = MAPBOX_TOKEN;
        
        map.current = new mapboxgl.default.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [center.lng, center.lat],
          zoom: zoom,
        });

        map.current.on('load', () => {
          setMapLoaded(true);
          
          // Add zip code polygons
          if (showPolygons && zipCodePolygons.length > 0) {
            addZipCodePolygons();
          }

          // Add community polygons  
          if (showPolygons && communityPolygons.length > 0) {
            addCommunityPolygons();
          }

          // Add listing markers
          if (showListings && listings.length > 0) {
            addListingMarkers();
          }
        });
        
        // Add navigation controls
        map.current.addControl(new mapboxgl.default.NavigationControl(), 'bottom-left');

        map.current.on('error', (e: any) => {
          console.error('Mapbox error:', e);
          setLoadError(true);
        });
      })
      .catch((error) => {
        console.error('Failed to load Mapbox GL:', error);
        setLoadError(true);
      });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, zoom, mapLoaded]);

  // Update listings when they change
  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    
    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.mls-listing-marker');
    existingMarkers.forEach(marker => marker.remove());
    
    if (showListings && listings.length > 0) {
      addListingMarkers();
    }
  }, [listings, mapLoaded, showListings]);

  function addZipCodePolygons() {
    zipCodePolygons.forEach((zip, index) => {
      if (!zip.polygon || zip.polygon.length < 3) return;
      
      const coordinates = zip.polygon.map(([lat, lng]) => [lng, lat]);
      coordinates.push(coordinates[0]); // Close the polygon
      
      const sourceId = `zip-${zip.zipCode}`;
      const opacity = zip.listingsCount > 0 ? 0.3 : 0.1;
      const strokeOpacity = zip.listingsCount > 0 ? 0.8 : 0.4;
      
      map.current.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [coordinates],
          },
          properties: {
            zipCode: zip.zipCode,
            name: zip.name,
            slug: zip.slug,
            listingsCount: zip.listingsCount,
            medianPrice: zip.medianPrice,
          },
        },
      });
      
      // Fill layer
      map.current.addLayer({
        id: `${sourceId}-fill`,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': POLYGON_COLORS.zip,
          'fill-opacity': opacity,
        },
      });
      
      // Outline layer
      map.current.addLayer({
        id: `${sourceId}-outline`,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': POLYGON_COLORS.zip,
          'line-width': 2,
          'line-opacity': strokeOpacity,
        },
      });
      
      // Label layer with listing count
      if (showListingCounts && zip.listingsCount > 0) {
        const labelText = `${zip.zipCode}\\n${zip.listingsCount} homes`;
        
        map.current.addLayer({
          id: `${sourceId}-label`,
          type: 'symbol',
          source: sourceId,
          layout: {
            'text-field': labelText,
            'text-size': 11,
            'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'],
            'text-anchor': 'center',
            'text-allow-overlap': false,
            'text-padding': 4,
          },
          paint: {
            'text-color': '#1E40AF',
            'text-halo-color': '#FFFFFF',
            'text-halo-width': 1.5,
          },
        });
      }
      
      // Click handler
      map.current.on('click', `${sourceId}-fill`, () => {
        onPolygonClick?.(zip.slug, 'zip');
      });
      
      // Hover handlers
      map.current.on('mouseenter', `${sourceId}-fill`, () => {
        map.current.getCanvas().style.cursor = 'pointer';
        map.current.setPaintProperty(`${sourceId}-fill`, 'fill-opacity', opacity + 0.2);
      });
      
      map.current.on('mouseleave', `${sourceId}-fill`, () => {
        map.current.getCanvas().style.cursor = '';
        map.current.setPaintProperty(`${sourceId}-fill`, 'fill-opacity', opacity);
      });
    });
  }

  function addCommunityPolygons() {
    communityPolygons.forEach((community) => {
      if (!community.polygon || community.polygon.length < 3) return;
      
      const coordinates = community.polygon.map(([lat, lng]) => [lng, lat]);
      coordinates.push(coordinates[0]); // Close the polygon
      
      const sourceId = `community-${community.slug}`;
      const opacity = community.listingsCount > 0 ? 0.3 : 0.1;
      
      map.current.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [coordinates],
          },
          properties: {
            slug: community.slug,
            name: community.name,
            listingsCount: community.listingsCount,
            medianPrice: community.medianPrice,
          },
        },
      });
      
      // Fill layer
      map.current.addLayer({
        id: `${sourceId}-fill`,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': POLYGON_COLORS.community,
          'fill-opacity': opacity,
        },
      });
      
      // Outline layer
      map.current.addLayer({
        id: `${sourceId}-outline`,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': POLYGON_COLORS.community,
          'line-width': 1.5,
          'line-opacity': 0.7,
        },
      });
      
      // Click handler
      map.current.on('click', `${sourceId}-fill`, () => {
        onPolygonClick?.(community.slug, 'community');
      });
    });
  }

  function addListingMarkers() {
    listings.forEach((listing) => {
      // Color based on price
      let color = PRICE_COLORS.low;
      if (listing.price >= 2000000) color = PRICE_COLORS.premium;
      else if (listing.price >= 1000000) color = PRICE_COLORS.high;
      else if (listing.price >= 500000) color = PRICE_COLORS.medium;

      // Create marker element
      const el = document.createElement('div');
      el.className = 'mls-listing-marker';
      el.style.cssText = `
        width: 12px;
        height: 12px;
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        transition: transform 0.2s ease;
      `;
      
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.3)';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });
      
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onListingClick) {
          onListingClick(listing);
        } else {
          router.push(`/listing/${listing.mlsNumber}`);
        }
      });

      // Add marker to map
      const marker = new (window as any).mapboxgl.Marker(el)
        .setLngLat([listing.coordinates.lng, listing.coordinates.lat])
        .addTo(map.current);
    });
  }

  if (!MAPBOX_TOKEN || loadError) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-gray-500 mb-2">
            {!MAPBOX_TOKEN ? 'Map configuration missing' : 'Failed to load map'}
          </div>
          <p className="text-sm text-gray-400">
            {listings.length > 0 
              ? `Showing ${listings.length} listings in list view`
              : 'Switch to list view to see properties'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading live MLS map data...</p>
          </div>
        </div>
      )}
      
      {mapLoaded && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
          <div className="space-y-2 text-sm">
            <div className="font-medium text-gray-900">Live MLS Data</div>
            {showListings && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-white shadow" style={{ backgroundColor: PRICE_COLORS.low }}></div>
                <span className="text-gray-600">Under $500k</span>
              </div>
            )}
            {showPolygons && zipCodePolygons.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border" style={{ backgroundColor: POLYGON_COLORS.zip, opacity: 0.3 }}></div>
                <span className="text-gray-600">Zip Codes</span>
              </div>
            )}
            {showPolygons && communityPolygons.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border" style={{ backgroundColor: POLYGON_COLORS.community, opacity: 0.3 }}></div>
                <span className="text-gray-600">Communities</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
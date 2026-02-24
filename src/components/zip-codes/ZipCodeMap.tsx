'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ZipCodeData } from '@/data/zip-codes-data';
import dynamic from 'next/dynamic';

// CSS is loaded in layout.tsx to avoid timing issues

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// Debug logging for production
if (typeof window !== 'undefined' && !MAPBOX_TOKEN) {
  console.warn('🗺️ MAPBOX_TOKEN missing - falling back to static map');
}

const ZIP_COLORS = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
  '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4',
  '#469990', '#dcbeff', '#9A6324', '#800000', '#aaffc3',
  '#808000', '#ffd8b1', '#000075', '#a9a9a9', '#000000',
  '#e6beff', '#1abc9c', '#16a085', '#2ecc71', '#27ae60',
  '#3498db', '#2980b9', '#9b59b6', '#8e44ad', '#34495e',
  '#f39c12', '#e74c3c', '#c0392b', '#d35400', '#7f8c8d',
  '#2c3e50', '#1a5276', '#7d3c98', '#a04000', '#1b4f72',
  '#117a65', '#b7950b'
];

interface ZipCodeMapProps {
  zipCodes: ZipCodeData[];
}

export default function ZipCodeMap({ zipCodes }: ZipCodeMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!mapContainer.current || mapLoaded) return;
    
    // If no token, show fallback immediately
    if (!MAPBOX_TOKEN) {
      console.warn('🗺️ No Mapbox token found, showing static fallback');
      setLoadError(true);
      return;
    }
    
    // Dynamic import to avoid SSR
    import('mapbox-gl')
      .then((mapboxgl) => {
        console.log('🗺️ Mapbox GL loaded successfully');
        mapboxgl.default.accessToken = MAPBOX_TOKEN;
        
        try {
          map.current = new mapboxgl.default.Map({
            container: mapContainer.current!,
            style: 'mapbox://styles/mapbox/light-v11',
            center: [-97.74, 30.27],
            zoom: 9,
          });

          console.log('🗺️ Mapbox map initialized');

          map.current.on('load', () => {
            console.log('🗺️ Map loaded, adding zip code polygons');
            setMapLoaded(true);
          
          zipCodes.forEach((zip, index) => {
            if (!zip.polygon || zip.polygon.length < 3) return;
            
            const coordinates = zip.polygon.map(p => [p.lng, p.lat]);
            // Close the polygon
            coordinates.push(coordinates[0]);
            
            const sourceId = `zip-${zip.zipCode}`;
            const color = ZIP_COLORS[index % ZIP_COLORS.length];
            
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
                  slug: zip.slug 
                },
              },
            });
            
            // Fill layer
            map.current.addLayer({
              id: `${sourceId}-fill`,
              type: 'fill',
              source: sourceId,
              paint: {
                'fill-color': color,
                'fill-opacity': 0.4,
              },
            });
            
            // Outline layer
            map.current.addLayer({
              id: `${sourceId}-outline`,
              type: 'line',
              source: sourceId,
              paint: {
                'line-color': color,
                'line-width': 2,
              },
            });
            
            // Label layer
            map.current.addLayer({
              id: `${sourceId}-label`,
              type: 'symbol',
              source: sourceId,
              layout: {
                'text-field': zip.zipCode,
                'text-size': 12,
                'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'],
                'text-allow-overlap': true,
              },
              paint: {
                'text-color': '#333',
                'text-halo-color': '#fff',
                'text-halo-width': 1.5,
              },
            });
            
            // Click handler
            map.current.on('click', `${sourceId}-fill`, (e: any) => {
              const properties = e.features[0].properties;
              router.push(`/zip-codes/${properties.slug}`);
            });
            
            // Hover handlers
            map.current.on('mouseenter', `${sourceId}-fill`, () => {
              map.current.getCanvas().style.cursor = 'pointer';
              map.current.setPaintProperty(`${sourceId}-fill`, 'fill-opacity', 0.7);
              map.current.setPaintProperty(`${sourceId}-outline`, 'line-width', 4);
            });
            
            map.current.on('mouseleave', `${sourceId}-fill`, () => {
              map.current.getCanvas().style.cursor = '';
              map.current.setPaintProperty(`${sourceId}-fill`, 'fill-opacity', 0.4);
              map.current.setPaintProperty(`${sourceId}-outline`, 'line-width', 2);
            });
          });
        });
        
        // Add navigation controls
        map.current.addControl(new mapboxgl.default.NavigationControl(), 'bottom-left');

          map.current.on('error', (e: any) => {
            console.error('🗺️ Mapbox error:', e);
            setLoadError(true);
          });

        } catch (mapError) {
          console.error('🗺️ Failed to initialize Mapbox map:', mapError);
          setLoadError(true);
        }
      })
      .catch((error) => {
        console.error('🗺️ Failed to load Mapbox GL module:', error);
        setLoadError(true);
      });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [zipCodes, router, mapLoaded]);

  if (!MAPBOX_TOKEN || loadError) {
    // Enhanced fallback to static image with better UX
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden">
        <div className="flex items-center justify-center h-full p-4">
          <div className="text-center max-w-4xl">
            <img
              src="https://www.spyglassrealty.com/uploads/agent-1/Austin%20Zip%20Code%20Map.webp"
              alt="Greater Austin Zip Code Map"
              className="max-w-full max-h-full object-contain rounded-lg shadow-md mb-4"
              loading="lazy"
            />
            <div className="p-4 bg-white/90 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                {!MAPBOX_TOKEN ? (
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
                <p className="text-sm font-medium text-gray-800">
                  {!MAPBOX_TOKEN ? 'Static Map Reference' : 'Interactive Map Unavailable'}
                </p>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                {!MAPBOX_TOKEN 
                  ? 'Use the zip code list below to explore specific areas and view detailed information.' 
                  : 'Interactive features temporarily disabled. Please try refreshing or use the zip code list below.'}
              </p>
              {process.env.NODE_ENV === 'development' && (
                <p className="text-xs text-red-600 font-mono">
                  Debug: {!MAPBOX_TOKEN ? 'NEXT_PUBLIC_MAPBOX_TOKEN missing' : 'Map initialization failed'}
                </p>
              )}
            </div>
          </div>
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-spyglass-orange mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading interactive map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
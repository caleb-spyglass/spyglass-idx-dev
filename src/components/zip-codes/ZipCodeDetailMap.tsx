'use client';

import { useEffect, useRef, useState } from 'react';
import { ZipCodeData } from '@/data/zip-codes-data';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface ZipCodeDetailMapProps {
  zipCodeData: ZipCodeData;
}

export default function ZipCodeDetailMap({ zipCodeData }: ZipCodeDetailMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN || map.current) return;

    import('mapbox-gl')
      .then((mapboxgl) => {
        // Import CSS
        if (!document.querySelector('link[href*="mapbox-gl"]')) {
          const link = document.createElement('link');
          link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css';
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }

        mapboxgl.default.accessToken = MAPBOX_TOKEN;

        // Calculate bounds from polygon
        const polygon = zipCodeData.polygon || [];
        if (polygon.length < 3) {
          // Fall back to center coordinates
          map.current = new mapboxgl.default.Map({
            container: mapContainer.current!,
            style: 'mapbox://styles/mapbox/light-v11',
            center: [zipCodeData.coordinates.lng, zipCodeData.coordinates.lat],
            zoom: 12,
          });
          setMapLoaded(true);
          return;
        }

        // Get bounds
        let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
        for (const p of polygon) {
          if (p.lng < minLng) minLng = p.lng;
          if (p.lng > maxLng) maxLng = p.lng;
          if (p.lat < minLat) minLat = p.lat;
          if (p.lat > maxLat) maxLat = p.lat;
        }

        map.current = new mapboxgl.default.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/streets-v12',
          bounds: [[minLng, minLat], [maxLng, maxLat]] as any,
          fitBoundsOptions: { padding: 40 },
        });

        map.current.on('load', () => {
          setMapLoaded(true);

          const coordinates = polygon.map((p: { lng: number; lat: number }) => [p.lng, p.lat]);
          coordinates.push(coordinates[0]); // close the polygon

          map.current.addSource('zip-boundary', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [coordinates],
              },
              properties: {
                zipCode: zipCodeData.zipCode,
                name: zipCodeData.name,
              },
            },
          });

          // Fill
          map.current.addLayer({
            id: 'zip-fill',
            type: 'fill',
            source: 'zip-boundary',
            paint: {
              'fill-color': '#EF4923',
              'fill-opacity': 0.15,
            },
          });

          // Outline
          map.current.addLayer({
            id: 'zip-outline',
            type: 'line',
            source: 'zip-boundary',
            paint: {
              'line-color': '#EF4923',
              'line-width': 3,
            },
          });

          // Label
          map.current.addLayer({
            id: 'zip-label',
            type: 'symbol',
            source: 'zip-boundary',
            layout: {
              'text-field': zipCodeData.zipCode,
              'text-size': 16,
              'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'],
              'text-allow-overlap': true,
            },
            paint: {
              'text-color': '#EF4923',
              'text-halo-color': '#fff',
              'text-halo-width': 2,
            },
          });
        });

        map.current.addControl(new mapboxgl.default.NavigationControl(), 'bottom-right');

        map.current.on('error', () => {
          setLoadError(true);
        });
      })
      .catch(() => {
        setLoadError(true);
      });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [zipCodeData]);

  if (!MAPBOX_TOKEN || loadError) {
    return (
      <div className="w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-sm text-gray-500">Map requires Mapbox token</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-spyglass-orange mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import Link from 'next/link';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { COMMUNITIES, type CommunityPolygon } from '@/data/communities-polygons';

interface NearbyCommunityItem {
  name: string;
  slug: string;
  county: string;
  distance: number; // approximate distance for sorting
}

interface NearbyCommunityProps {
  currentSlug: string;
  currentName: string;
  maxCount?: number;
}

// Calculate approximate center of a polygon
function getPolygonCenter(polygon: [number, number][]): { lat: number; lng: number } {
  if (polygon.length === 0) return { lat: 30.2672, lng: -97.7431 };
  const sumLat = polygon.reduce((acc, [_lng, lat]) => acc + lat, 0);
  const sumLng = polygon.reduce((acc, [lng]) => acc + lng, 0);
  return {
    lat: sumLat / polygon.length,
    lng: sumLng / polygon.length,
  };
}

// Haversine distance in miles (approximate)
function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function findNearbyCommunities(
  currentSlug: string,
  maxCount: number
): NearbyCommunityItem[] {
  const current = COMMUNITIES.find((c) => c.slug === currentSlug);
  if (!current) return [];

  const currentCenter = getPolygonCenter(current.polygon);

  const nearby: NearbyCommunityItem[] = COMMUNITIES
    .filter((c) => c.slug !== currentSlug)
    .map((c) => {
      const center = getPolygonCenter(c.polygon);
      const distance = haversineDistance(
        currentCenter.lat,
        currentCenter.lng,
        center.lat,
        center.lng
      );
      return {
        name: c.name,
        slug: c.slug,
        county: c.county,
        distance,
      };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxCount);

  return nearby;
}

// Title-case helper
function titleCase(name: string): string {
  // Skip if already mixed-case (e.g., "Downtown Austin")
  if (name !== name.toUpperCase() && name !== name.toLowerCase()) return name;
  return name
    .toLowerCase()
    .split(/[\s-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function NearbyCommunities({
  currentSlug,
  currentName,
  maxCount = 8,
}: NearbyCommunityProps) {
  const nearby = findNearbyCommunities(currentSlug, maxCount);

  if (nearby.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Neighborhoods Near {currentName}
      </h2>
      <p className="text-gray-600 mb-6">
        Explore homes for sale in communities near {currentName}, Austin TX.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {nearby.map((community) => (
          <Link
            key={community.slug}
            href={`/communities/${community.slug}`}
            className="group flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-4 hover:border-red-300 hover:shadow-sm transition-all"
          >
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
              <MapPinIcon className="w-4 h-4 text-red-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors truncate">
                {titleCase(community.name)}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {community.distance < 1
                  ? 'Less than 1 mi away'
                  : `~${Math.round(community.distance)} mi away`}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* More communities link */}
      <div className="mt-4 text-center">
        <Link
          href="/communities"
          className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline"
        >
          View all Austin communities →
        </Link>
      </div>
    </section>
  );
}

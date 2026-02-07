import Link from 'next/link';
import { MapPinIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { NearbyCommunity } from '@/lib/nearby-communities';

interface NearbyNeighborhoodsProps {
  communityName: string;
  nearby: NearbyCommunity[];
}

function formatName(name: string): string {
  const lowerWords = new Set(['at', 'of', 'the', 'in', 'on', 'and', 'or']);
  return name
    .split(/[\s]+/)
    .map((word, i) => {
      // Keep hyphens and handle each part
      return word
        .split('-')
        .map((part, j) => {
          const lower = part.toLowerCase();
          if (i > 0 && j === 0 && lowerWords.has(lower)) return lower;
          return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join('-');
    })
    .join(' ');
}

export default function NearbyNeighborhoods({
  communityName,
  nearby,
}: NearbyNeighborhoodsProps) {
  if (nearby.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Neighborhoods Near {communityName}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {nearby.map((community) => (
          <Link
            key={community.slug}
            href={`/communities/${community.slug}`}
            className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-red-200 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                  {formatName(community.name)}
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{community.county} County</span>
                  <span className="text-gray-300 mx-1">·</span>
                  <span>{community.distanceKm} km away</span>
                </div>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors flex-shrink-0 mt-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

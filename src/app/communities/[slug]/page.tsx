import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getCommunityBySlug } from '@/data/communities-polygons';
import { getCommunityContent } from '@/data/community-descriptions';
import { getNearbyCommunities, getCommunityCentroid, formatCommunityName } from '@/lib/nearby-communities';
import CommunityHeroIsland from '@/components/community/CommunityHeroIsland';
import CommunityBreadcrumbs from '@/components/community/CommunityBreadcrumbs';
import CommunitySchemaMarkup from '@/components/community/CommunitySchemaMarkup';
import NearbyNeighborhoods from '@/components/community/NearbyNeighborhoods';
import CommunityFAQServer from '@/components/community/CommunityFAQServer';
import {
  SparklesIcon,
  MapPinIcon,
  CheckBadgeIcon,
  BuildingStorefrontIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Highlight icon mapping
const highlightIcons = [
  SparklesIcon,
  CheckBadgeIcon,
  StarIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
];

export default async function CommunityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const community = getCommunityBySlug(slug);

  if (!community) {
    notFound();
  }

  const communityName = formatCommunityName(community.name);
  const content = getCommunityContent(slug);
  const nearby = getNearbyCommunities(slug, 6);
  const centroid = getCommunityCentroid(slug);

  // Build the About section content that will be server-rendered
  // but passed to the client island for the About tab
  const aboutContent = (
    <div className="prose prose-gray max-w-none">
      {content ? (
        <div className="space-y-8">
          {/* Main Description */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">About {communityName}</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              {content.description.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Best For */}
          {content.bestFor.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <StarIcon className="w-5 h-5 text-spyglass-orange" />
                Best For
              </h3>
              <div className="flex flex-wrap gap-2">
                {content.bestFor.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-orange-50 text-spyglass-orange border border-orange-200 rounded-full px-4 py-1.5 text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Highlights */}
          {content.highlights.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-spyglass-orange" />
                Neighborhood Highlights
              </h3>
              <div className="grid gap-3">
                {content.highlights.map((highlight, i) => {
                  const Icon = highlightIcons[i % highlightIcons.length];
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    >
                      <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-spyglass-orange" />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">{highlight}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Nearby Landmarks */}
          {content.nearbyLandmarks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-spyglass-orange" />
                Nearby
              </h3>
              <div className="flex flex-wrap gap-2">
                {content.nearbyLandmarks.map((landmark, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm"
                  >
                    {landmark}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">About {communityName}</h2>
          <p className="text-gray-600 leading-relaxed">
            {communityName} is a sought-after neighborhood in {community.county} County, located in
            the greater Austin, Texas metropolitan area. Whether you&apos;re looking to buy or sell
            in {communityName}, our team at Spyglass Realty can help you navigate this competitive
            market. Contact us today for a personalized consultation.
          </p>
        </div>
      )}

      {/* FAQ Section — server-rendered schema + client accordion */}
      <CommunityFAQServer
        communityName={communityName}
        communitySlug={slug}
        county={community.county}
      />

      {/* Nearby Neighborhoods — fully server-rendered with internal links */}
      <NearbyNeighborhoods communityName={communityName} nearby={nearby} />
    </div>
  );

  return (
    <>
      {/* Schema markup — server-rendered JSON-LD */}
      <CommunitySchemaMarkup
        name={communityName}
        slug={slug}
        county={community.county}
        content={content}
        centerLat={centroid?.lat}
        centerLng={centroid?.lng}
      />

      {/* Breadcrumbs — server-rendered visible UI */}
      <CommunityBreadcrumbs communityName={communityName} communitySlug={slug} />

      {/* Main content — client island handles tabs, listings, map */}
      <Suspense
        fallback={
          <div className="min-h-screen bg-gray-50">
            <div className="p-8 text-center">Loading community...</div>
          </div>
        }
      >
        <CommunityHeroIsland
          communityName={communityName}
          communitySlug={slug}
          county={community.county}
          polygon={community.polygon}
          displayPolygon={community.displayPolygon}
          aboutContent={aboutContent}
        />
      </Suspense>
    </>
  );
}

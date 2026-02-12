import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getCommunityBySlug } from '@/data/communities-polygons';
import { getAreaCommunityBySlug, ALL_AREA_COMMUNITIES } from '@/data/area-communities';
import { getAreaCommunityDescription } from '@/data/area-community-descriptions';
import { getCommunityContent } from '@/data/community-descriptions';
import { getScrapedContent } from '@/data/scraped-content-loader';
import { getNearbyCommunities, getCommunityCentroid, formatCommunityName } from '@/lib/nearby-communities';
import CommunityHeroIsland from '@/components/community/CommunityHeroIsland';
import AreaCommunityHeroIsland from '@/components/community/AreaCommunityHeroIsland';
import CommunityBreadcrumbs from '@/components/community/CommunityBreadcrumbs';
import CommunitySchemaMarkup from '@/components/community/CommunitySchemaMarkup';
import NearbyNeighborhoods from '@/components/community/NearbyNeighborhoods';
import CommunityFAQServer from '@/components/community/CommunityFAQServer';
import CommunityTOC from '@/components/community/CommunityTOC';
import { slugify } from '@/lib/slugify';
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

/**
 * Generate static params for both polygon-based and area-based communities.
 */
export function generateStaticParams() {
  // Import here to avoid circular dependency issues at build time
  const { COMMUNITIES } = require('@/data/communities-polygons');
  
  const polygonSlugs = COMMUNITIES.map((c: { slug: string }) => ({
    slug: c.slug,
  }));

  const areaSlugs = ALL_AREA_COMMUNITIES.map((c) => ({
    slug: c.slug,
  }));

  return [...polygonSlugs, ...areaSlugs];
}

export default async function CommunityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  // 1. Check polygon-based communities first (existing behavior)
  const community = getCommunityBySlug(slug);

  if (community) {
    // Existing polygon-based community rendering
    return renderPolygonCommunity(slug, community);
  }

  // 2. Check area-based communities (zip codes and cities)
  const areaCommunity = getAreaCommunityBySlug(slug);

  if (areaCommunity) {
    return renderAreaCommunity(slug, areaCommunity);
  }

  // 3. Not found
  notFound();
}

// ─── POLYGON-BASED COMMUNITY (existing behavior) ────────────────────────

function renderPolygonCommunity(slug: string, community: ReturnType<typeof getCommunityBySlug>) {
  if (!community) return notFound();

  const communityName = formatCommunityName(community.name);
  const content = getCommunityContent(slug);
  const scrapedContent = getScrapedContent(slug);
  const nearby = getNearbyCommunities(slug, 6);
  const centroid = getCommunityCentroid(slug);

  // Build TOC items from all available sections
  const tocItems: { id: string; label: string }[] = [];
  const aboutId = slugify(`about-${communityName}`);
  tocItems.push({ id: aboutId, label: `About ${communityName}` });
  if (content?.bestFor && content.bestFor.length > 0) {
    tocItems.push({ id: 'best-for', label: 'Best For' });
  }
  if (content?.highlights && content.highlights.length > 0) {
    tocItems.push({ id: 'neighborhood-highlights', label: 'Neighborhood Highlights' });
  }
  if (content?.nearbyLandmarks && content.nearbyLandmarks.length > 0) {
    tocItems.push({ id: 'nearby', label: 'Nearby' });
  }
  if (scrapedContent) {
    scrapedContent.sections.forEach((section) => {
      if (section.heading) {
        tocItems.push({ id: slugify(section.heading), label: section.heading });
      }
    });
  }

  const aboutContent = (
    <div className="prose prose-gray max-w-none">
      <CommunityTOC items={tocItems} />
      {content ? (
        <div className="space-y-8">
          <div id={aboutId}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">About {communityName}</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              {content.description.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          {content.bestFor.length > 0 && (
            <div id="best-for">
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

          {content.highlights.length > 0 && (
            <div id="neighborhood-highlights">
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

          {content.nearbyLandmarks.length > 0 && (
            <div id="nearby">
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

          {scrapedContent && scrapedContent.sections.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200 space-y-6">
              {scrapedContent.sections.map((section, idx) => (
                <div key={idx} id={section.heading ? slugify(section.heading) : undefined}>
                  {section.heading && (
                    <h2 className="text-xl font-bold text-gray-900 mb-3">{section.heading}</h2>
                  )}
                  <div
                    className="text-gray-600 leading-relaxed space-y-4 [&>p]:mb-4 [&>p:last-child]:mb-0 [&_a]:text-spyglass-orange [&_a]:underline [&_a:hover]:text-orange-700"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : scrapedContent ? (
        <div className="space-y-8">
          <div id={aboutId}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">About {communityName}</h2>
          </div>
          {scrapedContent.sections.map((section, idx) => (
            <div key={idx} id={section.heading ? slugify(section.heading) : undefined}>
              {section.heading && (
                <h2 className="text-xl font-bold text-gray-900 mb-3">{section.heading}</h2>
              )}
              <div
                className="text-gray-600 leading-relaxed space-y-4 [&>p]:mb-4 [&>p:last-child]:mb-0 [&_a]:text-spyglass-orange [&_a]:underline [&_a:hover]:text-orange-700"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h2 id={aboutId} className="text-xl font-bold text-gray-900 mb-4">About {communityName}</h2>
          <p className="text-gray-600 leading-relaxed">
            {communityName} is a sought-after neighborhood in {community.county} County, located in
            the greater Austin, Texas metropolitan area. Whether you&apos;re looking to buy or sell
            in {communityName}, our team at Spyglass Realty can help you navigate this competitive
            market. Contact us today for a personalized consultation.
          </p>
        </div>
      )}

      <CommunityFAQServer
        communityName={communityName}
        communitySlug={slug}
        county={community.county}
      />

      <NearbyNeighborhoods communityName={communityName} nearby={nearby} />
    </div>
  );

  return (
    <>
      <CommunitySchemaMarkup
        name={communityName}
        slug={slug}
        county={community.county}
        content={content}
        centerLat={centroid?.lat}
        centerLng={centroid?.lng}
      />

      <CommunityBreadcrumbs communityName={communityName} communitySlug={slug} />

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

// ─── AREA-BASED COMMUNITY (zip / city) ──────────────────────────────────

function renderAreaCommunity(slug: string, areaCommunity: NonNullable<ReturnType<typeof getAreaCommunityBySlug>>) {
  const areaDesc = getAreaCommunityDescription(slug);

  // Build the display name
  const displayName = areaCommunity.type === 'zip'
    ? areaCommunity.name
    : areaCommunity.name;

  // SEO-friendly title
  const pageTitle = areaCommunity.type === 'zip'
    ? `Homes for Sale in ${areaCommunity.filterValue} (${areaCommunity.name})`
    : `Homes for Sale in ${areaCommunity.name}, TX`;

  const aboutContent = (
    <div className="prose prose-gray max-w-none">
      {areaDesc ? (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {areaCommunity.type === 'zip'
                ? `About the ${areaCommunity.filterValue} Zip Code`
                : `About ${areaCommunity.name}`}
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              {areaDesc.description.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          {areaDesc.bestFor.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <StarIcon className="w-5 h-5 text-spyglass-orange" />
                Best For
              </h3>
              <div className="flex flex-wrap gap-2">
                {areaDesc.bestFor.map((tag, i) => (
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

          {areaDesc.highlights.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-spyglass-orange" />
                Highlights
              </h3>
              <div className="grid gap-3">
                {areaDesc.highlights.map((highlight, i) => {
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

          {areaDesc.nearbyLandmarks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-spyglass-orange" />
                Nearby
              </h3>
              <div className="flex flex-wrap gap-2">
                {areaDesc.nearbyLandmarks.map((landmark, i) => (
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {areaCommunity.type === 'zip'
              ? `About the ${areaCommunity.filterValue} Zip Code`
              : `About ${areaCommunity.name}`}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {areaCommunity.description} Whether you&apos;re looking to buy or sell
            in this area, our team at Spyglass Realty can help you navigate the market.
            Contact us today for a personalized consultation.
          </p>
        </div>
      )}
    </div>
  );

  // Schema markup for area communities
  const schemaDescription = areaDesc
    ? areaDesc.description.split('\n\n')[0]
    : areaCommunity.description;

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Place',
        name: areaCommunity.type === 'zip'
          ? `${areaCommunity.filterValue} Zip Code, Austin TX`
          : `${areaCommunity.name}, TX`,
        description: schemaDescription,
        url: `https://search.spyglassrealty.com/communities/${slug}`,
        address: {
          '@type': 'PostalAddress',
          ...(areaCommunity.type === 'zip'
            ? { postalCode: areaCommunity.filterValue, addressLocality: 'Austin' }
            : { addressLocality: areaCommunity.name }),
          addressRegion: 'TX',
          addressCountry: 'US',
        },
        containedInPlace: {
          '@type': 'City',
          name: areaCommunity.type === 'city' ? areaCommunity.name : 'Austin',
          address: { '@type': 'PostalAddress', addressRegion: 'TX', addressCountry: 'US' },
        },
      },
      {
        '@type': 'RealEstateAgent',
        name: 'Spyglass Realty',
        url: 'https://www.spyglassrealty.com',
        telephone: '+1-512-827-8323',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '1801 S 1st St Suite 200',
          addressLocality: 'Austin',
          addressRegion: 'TX',
          postalCode: '78704',
          addressCountry: 'US',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://search.spyglassrealty.com' },
          { '@type': 'ListItem', position: 2, name: 'Communities', item: 'https://search.spyglassrealty.com/communities' },
          {
            '@type': 'ListItem',
            position: 3,
            name: displayName,
            item: `https://search.spyglassrealty.com/communities/${slug}`,
          },
        ],
      },
      {
        '@type': 'WebPage',
        name: pageTitle,
        description: schemaDescription,
        url: `https://search.spyglassrealty.com/communities/${slug}`,
        isPartOf: { '@type': 'WebSite', name: 'Spyglass Realty', url: 'https://search.spyglassrealty.com' },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      <CommunityBreadcrumbs communityName={displayName} communitySlug={slug} />

      <Suspense
        fallback={
          <div className="min-h-screen bg-gray-50">
            <div className="p-8 text-center">Loading community...</div>
          </div>
        }
      >
        <AreaCommunityHeroIsland
          communityName={displayName}
          communitySlug={slug}
          county={areaCommunity.county}
          areaType={areaCommunity.type}
          filterValue={areaCommunity.filterValue}
          aboutContent={aboutContent}
        />
      </Suspense>
    </>
  );
}

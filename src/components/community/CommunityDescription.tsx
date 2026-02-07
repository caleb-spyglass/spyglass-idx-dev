'use client';

import { formatPrice, formatNumber } from '@/lib/utils';
import { getCommunityContent, type CommunityContent } from '@/data/community-descriptions';
import {
  SparklesIcon,
  MapPinIcon,
  CheckBadgeIcon,
  BuildingStorefrontIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

interface CommunityDescriptionProps {
  name: string;
  slug?: string;
  county: string;
  stats?: {
    activeListings: number;
    medianPrice: number;
    avgPrice: number;
    pricePerSqft: number;
    avgDaysOnMarket: number;
    avgSqft: number;
    avgBedrooms: number;
  } | null;
}

// Highlight icon mapping — rotate through these icons
const highlightIcons = [
  SparklesIcon,
  CheckBadgeIcon,
  StarIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
];

function RichDescription({ content, name }: { content: CommunityContent; name: string }) {
  return (
    <div className="space-y-8">
      {/* Main Description */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">About {name}</h2>
        <div className="text-gray-600 leading-relaxed space-y-4">
          {content.description.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Best For Pills */}
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
  );
}

function FallbackDescription({
  name,
  county,
  stats,
}: {
  name: string;
  county: string;
  stats?: CommunityDescriptionProps['stats'];
}) {
  const generateDescription = () => {
    const parts: string[] = [];

    parts.push(
      `${name} is a sought-after neighborhood in ${county} County, located in the greater Austin, Texas metropolitan area.`
    );

    if (stats && stats.activeListings > 0) {
      parts.push(
        `The ${name} real estate market currently has ${stats.activeListings} active listings with a median home price of ${formatPrice(stats.medianPrice)}.`
      );

      if (stats.medianPrice < 400000) {
        parts.push(
          `This makes ${name} one of the more affordable neighborhoods in the Austin area, offering great value for homebuyers.`
        );
      } else if (stats.medianPrice < 600000) {
        parts.push(
          `${name} offers moderately priced homes compared to the broader Austin market, attracting a mix of first-time buyers and growing families.`
        );
      } else if (stats.medianPrice < 1000000) {
        parts.push(
          `As an established neighborhood, ${name} features homes that reflect the area's desirability and strong market fundamentals.`
        );
      } else {
        parts.push(
          `${name} is one of Austin's premier neighborhoods, featuring luxury homes and an exceptional quality of life.`
        );
      }

      if (stats.avgSqft > 0) {
        parts.push(
          `Homes in ${name} average ${formatNumber(stats.avgSqft)} square feet with ${stats.avgBedrooms} bedrooms, priced at approximately $${stats.pricePerSqft} per square foot.`
        );
      }

      if (stats.avgDaysOnMarket < 20) {
        parts.push(
          `Properties in ${name} are selling quickly, averaging just ${stats.avgDaysOnMarket} days on market — a sign of strong buyer demand.`
        );
      } else if (stats.avgDaysOnMarket < 45) {
        parts.push(
          `The market in ${name} is active, with homes typically selling within ${stats.avgDaysOnMarket} days.`
        );
      } else {
        parts.push(
          `Buyers have time to carefully consider their options, with homes averaging ${stats.avgDaysOnMarket} days on market.`
        );
      }
    }

    parts.push(
      `Whether you're looking to buy or sell in ${name}, our team at Spyglass Realty can help you navigate this competitive market. Contact us today for a personalized consultation.`
    );

    return parts.join(' ');
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">About {name}</h2>
      <p className="text-gray-600 leading-relaxed">{generateDescription()}</p>
    </div>
  );
}

export default function CommunityDescription({
  name,
  slug,
  county,
  stats,
}: CommunityDescriptionProps) {
  // Look up rich content by slug
  const content = slug ? getCommunityContent(slug) : undefined;

  // Build a rich description for structured data
  const schemaDescription = content
    ? content.description.split('\n\n')[0]
    : `${name} is a neighborhood in ${county} County, Austin, Texas.`;

  return (
    <div className="prose prose-gray max-w-none">
      {content ? (
        <RichDescription content={content} name={name} />
      ) : (
        <FallbackDescription name={name} county={county} stats={stats} />
      )}

      {/* Schema.org structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              // Place schema — community
              {
                '@type': 'Place',
                name: name,
                description: schemaDescription,
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: name,
                  addressRegion: 'TX',
                  addressCountry: 'US',
                },
                geo: {
                  '@type': 'GeoCoordinates',
                  latitude: 30.2672,
                  longitude: -97.7431,
                },
                containedInPlace: {
                  '@type': 'City',
                  name: 'Austin',
                  address: {
                    '@type': 'PostalAddress',
                    addressRegion: 'TX',
                    addressCountry: 'US',
                  },
                },
                ...(content
                  ? {
                      amenityFeature: content.highlights.map((h) => ({
                        '@type': 'LocationFeatureSpecification',
                        name: h,
                      })),
                      keywords: [...content.bestFor, ...content.nearbyLandmarks].join(', '),
                    }
                  : {}),
                ...(stats && stats.medianPrice > 0
                  ? {
                      additionalProperty: [
                        {
                          '@type': 'PropertyValue',
                          name: 'Median Home Price',
                          value: stats.medianPrice,
                          unitCode: 'USD',
                        },
                        {
                          '@type': 'PropertyValue',
                          name: 'Active Listings',
                          value: stats.activeListings,
                        },
                        {
                          '@type': 'PropertyValue',
                          name: 'Average Days on Market',
                          value: stats.avgDaysOnMarket,
                        },
                        {
                          '@type': 'PropertyValue',
                          name: 'Average Price per Square Foot',
                          value: stats.pricePerSqft,
                          unitCode: 'USD',
                        },
                      ],
                    }
                  : {}),
              },
              // RealEstateAgent schema — Spyglass Realty
              {
                '@type': 'RealEstateAgent',
                name: 'Spyglass Realty',
                description:
                  'Austin-based real estate brokerage helping buyers and sellers navigate the Austin housing market.',
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
                areaServed: {
                  '@type': 'City',
                  name: 'Austin',
                  address: {
                    '@type': 'PostalAddress',
                    addressRegion: 'TX',
                    addressCountry: 'US',
                  },
                },
              },
              // BreadcrumbList schema
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://www.spyglassrealty.com',
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Communities',
                    item: 'https://www.spyglassrealty.com/communities',
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: name,
                    item: `https://www.spyglassrealty.com/communities/${slug || ''}`,
                  },
                ],
              },
            ],
          }),
        }}
      />
    </div>
  );
}

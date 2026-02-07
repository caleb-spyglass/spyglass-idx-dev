import { CommunityContent } from '@/data/community-descriptions';

interface CommunitySchemaMarkupProps {
  name: string;
  slug: string;
  county: string;
  content?: CommunityContent;
  stats?: {
    activeListings: number;
    medianPrice: number;
    avgPrice: number;
    pricePerSqft: number;
    avgDaysOnMarket: number;
    avgSqft: number;
    avgBedrooms: number;
  } | null;
  centerLat?: number;
  centerLng?: number;
}

export default function CommunitySchemaMarkup({
  name,
  slug,
  county,
  content,
  stats,
  centerLat = 30.2672,
  centerLng = -97.7431,
}: CommunitySchemaMarkupProps) {
  const canonicalUrl = `https://search.spyglassrealty.com/communities/${slug}`;
  const schemaDescription = content
    ? content.description.split('\n\n')[0]
    : `${name} is a neighborhood in ${county} County, Austin, Texas. Browse homes for sale in ${name} with Spyglass Realty.`;

  const graph: Record<string, unknown>[] = [
    // Place schema — community
    {
      '@type': 'Place',
      name: name,
      description: schemaDescription,
      url: canonicalUrl,
      address: {
        '@type': 'PostalAddress',
        addressLocality: name,
        addressRegion: 'TX',
        addressCountry: 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: centerLat,
        longitude: centerLng,
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
      email: 'info@spyglassrealty.com',
      logo: 'https://spyglassrealty.com/og-image.jpg',
      image: 'https://spyglassrealty.com/og-image.jpg',
      priceRange: '$$-$$$$',
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
      sameAs: [
        'https://www.facebook.com/spyglassrealty',
        'https://www.instagram.com/spyglassrealty',
        'https://www.linkedin.com/company/spyglass-realty',
      ],
    },
    // BreadcrumbList schema
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://search.spyglassrealty.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Communities',
          item: 'https://search.spyglassrealty.com/communities',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: name,
          item: canonicalUrl,
        },
      ],
    },
    // WebPage schema
    {
      '@type': 'WebPage',
      name: `Homes for Sale in ${name} | Spyglass Realty`,
      description: schemaDescription,
      url: canonicalUrl,
      isPartOf: {
        '@type': 'WebSite',
        name: 'Spyglass Realty',
        url: 'https://search.spyglassrealty.com',
      },
      about: {
        '@type': 'Place',
        name: name,
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://search.spyglassrealty.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Communities',
            item: 'https://search.spyglassrealty.com/communities',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: name,
            item: canonicalUrl,
          },
        ],
      },
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': graph,
        }),
      }}
    />
  );
}

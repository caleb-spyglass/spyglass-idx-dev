import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getZipCodeBySlug } from '@/data/zip-codes-data';
import ZipCodeHeroIsland from '@/components/zip-codes/ZipCodeHeroIsland';
import ZipCodeBreadcrumbs from '@/components/zip-codes/ZipCodeBreadcrumbs';
import {
  SparklesIcon,
  MapPinIcon,
  CheckBadgeIcon,
  BuildingStorefrontIcon,
  StarIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

interface PageProps {
  params: Promise<{ zipcode: string }>;
}

// Highlight icon mapping
const highlightIcons = [
  SparklesIcon,
  CheckBadgeIcon,
  StarIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  HomeIcon,
];

/**
 * Generate static params for zip codes
 */
export function generateStaticParams() {
  const { getAllZipCodes } = require('@/data/zip-codes-data');
  const zipCodes = getAllZipCodes();
  
  return zipCodes.map((zip: { slug: string }) => ({
    zipcode: zip.slug,
  }));
}

export default async function ZipCodeDetailPage({ params }: PageProps) {
  const { zipcode } = await params;
  
  const zipCodeData = getZipCodeBySlug(zipcode);
  
  if (!zipCodeData) {
    notFound();
  }

  // Generate about content for the zip code
  const aboutContent = (
    <div className="prose prose-gray max-w-none">
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            About {zipCodeData.name}
          </h2>
          <div className="text-gray-600 leading-relaxed space-y-4">
            <p>{zipCodeData.description}</p>
            
            <p>
              The {zipCodeData.zipCode} zip code is located in {zipCodeData.county} County and offers 
              a diverse range of housing options from modern condos and townhomes to historic single-family 
              residences. This area is known for its walkability, local amenities, and strong sense of community.
            </p>
            
            <p>
              Whether you're a first-time homebuyer, looking to upgrade, or interested in investment properties, 
              the {zipCodeData.zipCode} area provides excellent opportunities in the Austin real estate market. 
              Our team at Spyglass Realty specializes in this area and can help you navigate the local market conditions.
            </p>
          </div>
        </div>

        {/* Neighborhoods in this zip code */}
        {zipCodeData.neighborhoods && zipCodeData.neighborhoods.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-spyglass-orange" />
              Neighborhoods in {zipCodeData.zipCode}
            </h3>
            <div className="flex flex-wrap gap-2">
              {zipCodeData.neighborhoods.map((neighborhood, i) => (
                <span
                  key={i}
                  className="bg-orange-50 text-spyglass-orange border border-orange-200 rounded-full px-4 py-1.5 text-sm font-medium"
                >
                  {neighborhood}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Key Features */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-spyglass-orange" />
            {zipCodeData.zipCode} Highlights
          </h3>
          <div className="grid gap-3">
            {getZipCodeHighlights(zipCodeData.zipCode).map((highlight, i) => {
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

        {/* Market Insights */}
        {zipCodeData.marketData && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckBadgeIcon className="w-5 h-5 text-spyglass-orange" />
              Market Insights
            </h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                The {zipCodeData.zipCode} market is currently {zipCodeData.marketData.marketTemperature} with 
                {zipCodeData.marketData.activeListings} active listings and a median price of ${zipCodeData.marketData.medianPrice.toLocaleString()}. 
                Homes typically sell within {zipCodeData.marketData.avgDaysOnMarket} days, making this 
                {zipCodeData.marketData.marketTemperature === 'hot' ? ' a competitive seller\'s market' : 
                 zipCodeData.marketData.marketTemperature === 'warm' ? ' a balanced market' : ' a buyer-friendly market'}.
              </p>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-red-50 rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Interested in {zipCodeData.zipCode}?
          </h3>
          <p className="text-gray-600 mb-4">
            Our agents specialize in this area and can help you find the perfect home or sell your current property.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:5128099338"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-gray-200"
            >
              Call 512-809-9338
            </a>
            <a
              href={`/search?zip=${zipCodeData.zipCode}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              View {zipCodeData.zipCode} Listings
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  // Schema markup
  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Place',
        name: `${zipCodeData.zipCode} Zip Code, Austin TX`,
        description: zipCodeData.description,
        url: `https://search.spyglassrealty.com/zip-codes/${zipCodeData.slug}`,
        address: {
          '@type': 'PostalAddress',
          postalCode: zipCodeData.zipCode,
          addressLocality: 'Austin',
          addressRegion: 'TX',
          addressCountry: 'US',
        },
        containedInPlace: {
          '@type': 'City',
          name: 'Austin',
          address: { 
            '@type': 'PostalAddress', 
            addressRegion: 'TX', 
            addressCountry: 'US' 
          },
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: zipCodeData.coordinates.lat,
          longitude: zipCodeData.coordinates.lng,
        },
      },
      {
        '@type': 'RealEstateAgent',
        name: 'Spyglass Realty',
        url: 'https://www.spyglassrealty.com',
        telephone: '+1-512-809-9338',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '2130 Goodrich Ave',
          addressLocality: 'Austin',
          addressRegion: 'TX',
          postalCode: '78704',
          addressCountry: 'US',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      <ZipCodeBreadcrumbs zipCode={zipCodeData.zipCode} zipName={zipCodeData.name} />

      <Suspense
        fallback={
          <div className="min-h-screen bg-gray-50">
            <div className="p-8 text-center">Loading zip code data...</div>
          </div>
        }
      >
        <ZipCodeHeroIsland
          zipCodeData={zipCodeData}
          aboutContent={aboutContent}
        />
      </Suspense>
    </>
  );
}

// Helper function to generate highlights for different zip codes
function getZipCodeHighlights(zipCode: string): string[] {
  switch (zipCode) {
    case '78704':
      return [
        'Home to the famous South by Southwest (SXSW) festival venues',
        'Walk to Barton Springs Pool and Zilker Park for outdoor recreation', 
        'Vibrant South Lamar food scene with food trucks and local restaurants',
        'Easy access to downtown Austin via the Lamar Boulevard corridor',
        'Diverse housing options from historic bungalows to modern condos',
        'Strong community feel with neighborhood events and local businesses',
      ];
    case '78705':
      return [
        'Walking distance to the University of Texas campus',
        'Historic Clarksville neighborhood with tree-lined streets',
        'Close proximity to downtown Austin and business district',
        'Easy access to Lady Bird Lake and the hike-and-bike trail',
        'Mix of student housing and established residential areas',
        'Convenient access to MoPac Expressway and major Austin routes',
      ];
    default:
      return [
        'Convenient Austin location with easy highway access',
        'Diverse range of housing options for all budgets',
        'Close to Austin amenities and entertainment',
        'Growing community with strong property values',
        'Access to Austin\'s excellent dining and nightlife',
      ];
  }
}
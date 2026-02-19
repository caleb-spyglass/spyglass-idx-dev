import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getZipCodeBySlug } from '@/data/zip-codes-data';
import ZipCodeHeroIsland from '@/components/zip-codes/ZipCodeHeroIsland';
import ZipCodeBreadcrumbs from '@/components/zip-codes/ZipCodeBreadcrumbs';
import { Footer } from '@/components/home/Footer';
import { getPulseZipSummary, shouldUsePulseData } from '@/lib/pulse-api';
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

  // Fetch Pulse data for test zip codes
  let pulseData = null;
  if (shouldUsePulseData(zipCodeData.zipCode)) {
    try {
      pulseData = await getPulseZipSummary(zipCodeData.zipCode);
      console.log(`[Zip ${zipCodeData.zipCode}] Pulse data fetched:`, !!pulseData);
    } catch (error) {
      console.error(`[Zip ${zipCodeData.zipCode}] Failed to fetch Pulse data:`, error);
      // Continue without Pulse data
    }
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
          pulseData={pulseData}
        />
      </Suspense>
      
      <Footer />
    </>
  );
}

// Helper function to generate highlights for different zip codes
function getZipCodeHighlights(zipCode: string): string[] {
  switch (zipCode) {
    case '78613':
      return [
        'One of the fastest-growing Austin suburbs with low crime rates',
        'Home to Avery Ranch with an iconic 18-hole golf course',
        'Large employers including Cedar Park Regional Medical Center',
        'Traditional to contemporary and modern home builds',
        'Near Anderson Mill and Brushy Creek communities',
        'Top-rated Leander ISD schools',
      ];
    case '78617':
      return [
        'Home to Circuit of Americas and Austin360 Amphitheater (F1 racing)',
        'Country living with city entertainment nearby',
        'East of Austin-Bergstrom International Airport',
        'Lake Bastrop nearby for boating and family recreation',
        'Affordable housing compared to central Austin',
        'Growing community with new developments',
      ];
    case '78620':
      return [
        'Covers Dripping Springs to Hamilton Pool area',
        'Hill country towns of Driftwood, Wimberley, and Johnson City nearby',
        'Arrowhead Ranch community with outstanding amenities',
        'Privacy and green spaces surrounding each home',
        'Gateway to the Texas Hill Country wine trail',
        'Excellent outdoor recreation opportunities',
      ];
    case '78628':
      return [
        'Charming Georgetown — top of list for Places to Live and Launch a Small Business',
        'Three golf courses: Berry Creek, Georgetown Country Club, Cimarron Hills',
        'Camping and trails along San Gabriel River',
        'Boating and fishing on Lake Georgetown',
        'Magnificent Texas Hill Country scenery',
        'Historic downtown square with shops and restaurants',
      ];
    case '78641':
      return [
        'Healthcare, tech, and booming industries with job opportunities',
        'Affordable and peaceful homes ideal for families',
        'Bordered by Cedar Park and Leander suburbs',
        'Northeast end of Lake Travis access',
        'Several residential and commercial hubs',
        'Top-rated Leander ISD schools',
      ];
    case '78645':
      return [
        'Bordered by Balcones Canyonlands Wildlife Refuge and Lake Travis',
        'Vacation-like living with water sports and hiking',
        'Communities include Lago Vista, Jonestown, Point Venture, The Hollows',
        'Various amenities for relaxation and outdoor recreation',
        'West of Cedar Park with hill country views',
        'Highland Lakes Estates and waterfront properties',
      ];
    case '78652':
      return [
        'Known as "Way South Awesome" to locals',
        'Easygoing neighborhood feel away from city bustle',
        'Near Buda and South Austin amenities',
        'Barton Springs and Barton Creek Greenbelt nearby',
        'Mary Moore Searight Park for golf, fishing, and recreation',
        'Traditional ranch-style houses',
      ];
    case '78701':
      return [
        'Heart of Downtown Austin — Texas State Capitol',
        'Sixth Street entertainment and Rainey Street nightlife',
        'World-class dining and cultural attractions',
        'High-rise condos and urban living lifestyle',
        'Steps from Lady Bird Lake hike-and-bike trail',
        'Major employer hub with corporate headquarters',
      ];
    case '78702':
      return [
        'One of Austin\'s hottest and most diverse neighborhoods',
        'Thriving food, art, and craft brewery scene',
        'East 6th Street and East Cesar Chavez entertainment',
        'Rapidly appreciating property values',
        'Mix of historic homes and modern new construction',
        'Cultural hub reflecting Austin\'s creative spirit',
      ];
    case '78703':
      return [
        'Prestigious Tarrytown and Pemberton Heights neighborhoods',
        'Tree-lined streets with historic homes',
        'Proximity to downtown and Lake Austin waterfront',
        'Deep Eddy Pool — oldest swimming pool in Texas',
        'Top-rated schools and walkable streets',
        'Some of Austin\'s most exclusive real estate',
      ];
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
    case '78717':
      return [
        'Modern 21st-century suburban homes',
        'Major employers Apple and Oracle nearby',
        'Between Cedar Park and Round Rock',
        'HEB Center — home to Austin Spurs and Texas Stars',
        'Top-rated schools in Round Rock and Leander ISDs',
        'Family-friendly with community amenities',
      ];
    case '78721':
      return [
        'Growing East Austin region with rising population',
        'Covers Airport Blvd and East MLK Jr Blvd corridors',
        'Contemporary, ranch-style, and craftsman homes',
        'Rapidly developing with new businesses and restaurants',
        'Close to downtown Austin with easy commute',
        'Diverse and vibrant community culture',
      ];
    case '78722':
      return [
        'Charming Cherrywood neighborhood with local character',
        'Award-winning Mueller new-urbanist development',
        'Walkable to local coffee shops and restaurants',
        'Close-in East Austin with easy downtown access',
        'Community gardens and neighborhood events',
        'Mix of historic bungalows and modern builds',
      ];
    case '78723':
      return [
        'Eclectic Windsor Park with mid-century and new homes',
        'Bartholomew District Park for recreation',
        'Growing restaurant and retail scene',
        'Community gardens and neighborhood associations',
        'Affordable options close to central Austin',
        'Mueller development nearby with shops and dining',
      ];
    case '78724':
      return [
        'Walter E. Long Metropolitan Park and lake access',
        'Affordable housing with larger lot sizes',
        'Mix of rural and suburban character',
        'New developments and growth opportunities',
        'Fishing, camping, and outdoor trails',
        'Positioned for significant future appreciation',
      ];
    case '78726':
      return [
        'Scenic Northwest Hills with rolling terrain',
        'Top-rated Leander and Round Rock ISD schools',
        'Proximity to major tech employers',
        'Quick access to 183A toll road and RM 620',
        'Family-friendly planned communities',
        'Canyon Creek and Grandview Hills neighborhoods',
      ];
    case '78728':
      return [
        'Wells Branch MUD with recreation center and pool',
        'Extensive trail system for walking and biking',
        'Affordable housing near I-35 tech corridor',
        'Close to major employers along Parmer Lane',
        'Established community with strong HOA amenities',
        'Convenient access to shopping and dining',
      ];
    case '78731':
      return [
        'Desirable Allandale neighborhood with mid-century charm',
        'Northwest Hills with stunning views',
        'Proximity to downtown via MoPac and Lamar',
        'Top-rated schools and family-friendly atmosphere',
        'Shoal Creek and Bull Creek trail access',
        'Cat Mountain luxury homes with panoramic views',
      ];
    case '78732':
      return [
        'Master-planned Steiner Ranch community',
        'Lake Austin and Lake Travis waterfront access',
        'Stunning hill country views throughout',
        'Excellent Leander ISD schools',
        'Community pools, parks, and miles of trails',
        'Multiple neighborhood amenity centers',
      ];
    case '78733':
      return [
        'Scenic Bee Cave area with hill country living',
        'Hill Country Galleria shopping and dining',
        'Proximity to Lake Travis recreation',
        'Exclusive neighborhoods with large lots',
        'Rob Roy and Barton Creek West communities',
        'Luxury homes in a serene natural setting',
      ];
    case '78734':
      return [
        'Resort-style Lakeway on Lake Travis shores',
        'World-class golf at Flintrock Falls',
        'Lakeway Resort & Spa and multiple marinas',
        'Luxury waterfront homes available',
        'Rough Hollow master-planned community',
        'Relaxed lakeside lifestyle with upscale amenities',
      ];
    case '78735':
      return [
        'Southwest Austin with hill country character',
        'Barton Creek Country Club and Greenbelt access',
        'Established neighborhoods with mature trees',
        'Hill Country Galleria nearby for shopping',
        'Easy downtown access via MoPac expressway',
        'Travis Country and Lost Creek communities',
      ];
    case '78737':
      return [
        'Family-friendly communities south of MoPac',
        'Top-rated schools in Austin and Hays ISDs',
        'Hill country views and natural settings',
        'Belterra master-planned community',
        'Barton Creek Greenbelt corridor access',
        'Growing area with new retail and dining',
      ];
    case '78738':
      return [
        'Upscale Bee Cave and Lakeway communities',
        'Hill Country Galleria shopping and entertainment',
        'Falconhead Golf Club and Spanish Oaks',
        'Resort-style amenities in master-planned communities',
        'Excellent Lake Travis ISD schools',
        'Texas Hill Country setting with modern convenience',
      ];
    case '78739':
      return [
        'Popular Circle C Ranch community',
        'Lady Bird Johnson Wildflower Center nearby',
        'Excellent schools and community amenities',
        'Suburban feel with easy downtown access',
        'Community pools, parks, and green spaces',
        'Meridian and Escarpment Village neighborhoods',
      ];
    case '78741':
      return [
        'Rapid growth and development in South Austin',
        'Near Austin-Bergstrom International Airport',
        'Affordable housing with new developments',
        'East Riverside entertainment corridor',
        'Oracle campus bringing major employment',
        'Proximity to South Congress and downtown',
      ];
    case '78744':
      return [
        'Southeast Austin with affordable options',
        'McKinney Falls State Park access',
        'Diverse and growing community',
        'Southpark Meadows shopping center',
        'Easy I-35 and Ben White Blvd access',
        'New development and commercial growth',
      ];
    case '78745':
      return [
        'Established South Austin neighborhoods',
        'Garrison Park and West Gate communities',
        'Mix of mid-century ranch and new construction',
        'South Lamar dining and entertainment nearby',
        'Barton Creek Greenbelt hiking access',
        'Quick commute to downtown Austin',
      ];
    case '78746':
      return [
        'Affluent West Lake Hills and Rollingwood',
        'Top-rated Eanes ISD schools',
        'Stunning hill country views and luxury estates',
        'Barton Creek Country Club access',
        'Exclusive gated communities available',
        'Among Austin\'s most prestigious addresses',
      ];
    case '78748':
      return [
        'Shady Hollow and Onion Creek planned communities',
        'Mid-century designs and new home styles',
        'Great schools and family-friendly amenities',
        'Southland Oaks and Bauerle Ranch neighborhoods',
        'Affordable compared to closer-in Austin',
        'Easy access to South Austin amenities',
      ];
    case '78749':
      return [
        'Circle C Ranch — one of Austin\'s top communities',
        'Deer Haven, Oak Park, and Legend Oaks neighborhoods',
        'Lady Bird Johnson Wildflower Center nearby',
        'Excellent AISD schools and family amenities',
        'Barton Creek Greenbelt trail access',
        'Heights at Loma Vista and Maple Run communities',
      ];
    case '78750':
      return [
        'Anderson Mill and Jollyville established neighborhoods',
        'Spicewood Vista and Lakewood Park communities',
        'Arboretum shopping district nearby',
        'Mature trees and well-maintained properties',
        'Proximity to major tech employers',
        'Bull Creek greenbelt access for hiking and swimming',
      ];
    case '78751':
      return [
        'Beloved Hyde Park — one of Austin\'s oldest neighborhoods',
        'Historic bungalows and tree-canopied streets',
        'Walkable to UT campus and Duval Street shops',
        'Iconic Shipe Park and community pool',
        'Strong neighborhood association and community spirit',
        'Central location with easy downtown access',
      ];
    case '78752':
      return [
        'North Loop vintage shops and eclectic restaurants',
        'Highland campus redevelopment bringing new energy',
        'Austin Community College expansion area',
        'Affordable options close to central Austin',
        'Growing food and arts scene on North Loop Blvd',
        'Easy access to I-35 and Airport Blvd',
      ];
    case '78753':
      return [
        'Diverse and affordable North Austin community',
        'Proximity to The Domain and major tech employers',
        'Excellent I-35 and US-183 highway access',
        'Mix of apartments and single-family homes',
        'Walnut Creek Metropolitan Park nearby',
        'Growing retail and commercial development',
      ];
    case '78754':
      return [
        'Northeast Austin with new growth and development',
        'Samsung semiconductor facility and tech employers',
        'Walter E. Long Metropolitan Park access',
        'Positioned for significant appreciation',
        'Harris Branch planned community',
        'Affordable entry point for Austin homeownership',
      ];
    case '78756':
      return [
        'Sought-after Rosedale and Brentwood neighborhoods',
        'Charming mid-century homes with tree-lined streets',
        'Walkable to Burnet Road shops and restaurants',
        'The Triangle mixed-use development nearby',
        'Quick downtown access via MoPac or Lamar',
        'Central Austin location with neighborhood character',
      ];
    case '78757':
      return [
        'Crestview MetroRail station for easy commuting',
        'Vintage shops and acclaimed restaurants on Burnet Road',
        'Charming 1950s ranch homes with character',
        'Allandale neighborhood with great schools',
        'Foodie destination with diverse dining options',
        'Strong community events and neighborhood pride',
      ];
    case '78758':
      return [
        'Near The Domain — Austin\'s second downtown',
        'Major tech employers: Apple, IBM, Dell nearby',
        'Domain and Rock Rose dining and entertainment',
        'Mix of established neighborhoods and new development',
        'Affordable options with urban convenience',
        'Excellent public transit connections',
      ];
    case '78759':
      return [
        'Great Hills and Bull Creek premium neighborhoods',
        'The Domain shopping and entertainment nearby',
        'Top-rated Round Rock ISD schools',
        'Bull Creek greenbelt trails and swimming',
        'Arboretum shopping district access',
        'Established neighborhoods with mature landscaping',
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
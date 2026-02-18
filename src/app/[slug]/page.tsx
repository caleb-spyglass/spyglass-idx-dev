import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getCommunityBySlug } from '@/data/communities-polygons';
import { getAreaCommunityBySlug } from '@/data/area-communities';
import { getAreaCommunityDescription } from '@/data/area-community-descriptions';
import { getCommunityContent } from '@/data/community-descriptions';
import { getScrapedContent } from '@/data/scraped-content-loader';
import { getNearbyCommunities, getCommunityCentroid, formatCommunityName } from '@/lib/nearby-communities';
import { getZipCodeBySlug } from '@/data/zip-codes-data';
import CommunityHeroIsland from '@/components/community/CommunityHeroIsland';
import AreaCommunityHeroIsland from '@/components/community/AreaCommunityHeroIsland';
import CommunityBreadcrumbs from '@/components/community/CommunityBreadcrumbs';
import CommunitySchemaMarkup from '@/components/community/CommunitySchemaMarkup';
import NearbyNeighborhoods from '@/components/community/NearbyNeighborhoods';
import CommunityFAQServer from '@/components/community/CommunityFAQServer';
import CommunityTOC from '@/components/community/CommunityTOC';
import ZipCodeHeroIsland from '@/components/zip-codes/ZipCodeHeroIsland';
import ZipCodeBreadcrumbs from '@/components/zip-codes/ZipCodeBreadcrumbs';
import { PageRenderer } from '@/components/page-builder/PublicBlockRenderer';
import { slugify } from '@/lib/slugify';
import { ZIP_URL_MAP, ALL_SEO_SLUGS, STATIC_ROUTE_SLUGS, extractZipFromSlug } from '@/data/seo-url-aliases';
import {
  SparklesIcon,
  MapPinIcon,
  CheckBadgeIcon,
  BuildingStorefrontIcon,
  StarIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

const MISSION_CONTROL_API = process.env.MISSION_CONTROL_API_URL || 'https://missioncontrol-tjfm.onrender.com';

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
  HomeIcon,
];

// ─── Helper: get zip code highlights (imported pattern from zip-codes page) ──

function getZipCodeHighlights(zipCode: string): string[] {
  const highlights: Record<string, string[]> = {
    '78613': ['One of the fastest-growing Austin suburbs with low crime rates', 'Home to Avery Ranch with an iconic 18-hole golf course', 'Large employers including Cedar Park Regional Medical Center', 'Traditional to contemporary and modern home builds', 'Near Anderson Mill and Brushy Creek communities', 'Top-rated Leander ISD schools'],
    '78617': ['Home to Circuit of Americas and Austin360 Amphitheater (F1 racing)', 'Country living with city entertainment nearby', 'East of Austin-Bergstrom International Airport', 'Lake Bastrop nearby for boating and family recreation', 'Affordable housing compared to central Austin', 'Growing community with new developments'],
    '78620': ['Covers Dripping Springs to Hamilton Pool area', 'Hill country towns of Driftwood, Wimberley, and Johnson City nearby', 'Arrowhead Ranch community with outstanding amenities', 'Privacy and green spaces surrounding each home', 'Gateway to the Texas Hill Country wine trail', 'Excellent outdoor recreation opportunities'],
    '78628': ['Charming Georgetown — top of list for Places to Live and Launch a Small Business', 'Three golf courses: Berry Creek, Georgetown Country Club, Cimarron Hills', 'Camping and trails along San Gabriel River', 'Boating and fishing on Lake Georgetown', 'Magnificent Texas Hill Country scenery', 'Historic downtown square with shops and restaurants'],
    '78641': ['Healthcare, tech, and booming industries with job opportunities', 'Affordable and peaceful homes ideal for families', 'Bordered by Cedar Park and Leander suburbs', 'Northeast end of Lake Travis access', 'Several residential and commercial hubs', 'Top-rated Leander ISD schools'],
    '78645': ['Bordered by Balcones Canyonlands Wildlife Refuge and Lake Travis', 'Vacation-like living with water sports and hiking', 'Communities include Lago Vista, Jonestown, Point Venture, The Hollows', 'Various amenities for relaxation and outdoor recreation', 'West of Cedar Park with hill country views', 'Highland Lakes Estates and waterfront properties'],
    '78652': ['Known as "Way South Awesome" to locals', 'Easygoing neighborhood feel away from city bustle', 'Near Buda and South Austin amenities', 'Barton Springs and Barton Creek Greenbelt nearby', 'Mary Moore Searight Park for golf, fishing, and recreation', 'Traditional ranch-style houses'],
    '78701': ['Heart of Downtown Austin — Texas State Capitol', 'Sixth Street entertainment and Rainey Street nightlife', 'World-class dining and cultural attractions', 'High-rise condos and urban living lifestyle', 'Steps from Lady Bird Lake hike-and-bike trail', 'Major employer hub with corporate headquarters'],
    '78702': ['One of Austin\'s hottest and most diverse neighborhoods', 'Thriving food, art, and craft brewery scene', 'East 6th Street and East Cesar Chavez entertainment', 'Rapidly appreciating property values', 'Mix of historic homes and modern new construction', 'Cultural hub reflecting Austin\'s creative spirit'],
    '78703': ['Prestigious Tarrytown and Pemberton Heights neighborhoods', 'Tree-lined streets with historic homes', 'Proximity to downtown and Lake Austin waterfront', 'Deep Eddy Pool — oldest swimming pool in Texas', 'Top-rated schools and walkable streets', 'Some of Austin\'s most exclusive real estate'],
    '78704': ['Home to the famous South by Southwest (SXSW) festival venues', 'Walk to Barton Springs Pool and Zilker Park for outdoor recreation', 'Vibrant South Lamar food scene with food trucks and local restaurants', 'Easy access to downtown Austin via the Lamar Boulevard corridor', 'Diverse housing options from historic bungalows to modern condos', 'Strong community feel with neighborhood events and local businesses'],
    '78705': ['Walking distance to the University of Texas campus', 'Historic Clarksville neighborhood with tree-lined streets', 'Close proximity to downtown Austin and business district', 'Easy access to Lady Bird Lake and the hike-and-bike trail', 'Mix of student housing and established residential areas', 'Convenient access to MoPac Expressway and major Austin routes'],
    '78717': ['Modern 21st-century suburban homes', 'Major employers Apple and Oracle nearby', 'Between Cedar Park and Round Rock', 'HEB Center — home to Austin Spurs and Texas Stars', 'Top-rated schools in Round Rock and Leander ISDs', 'Family-friendly with community amenities'],
    '78721': ['Growing East Austin region with rising population', 'Covers Airport Blvd and East MLK Jr Blvd corridors', 'Contemporary, ranch-style, and craftsman homes', 'Rapidly developing with new businesses and restaurants', 'Close to downtown Austin with easy commute', 'Diverse and vibrant community culture'],
    '78722': ['Charming Cherrywood neighborhood with local character', 'Award-winning Mueller new-urbanist development', 'Walkable to local coffee shops and restaurants', 'Close-in East Austin with easy downtown access', 'Community gardens and neighborhood events', 'Mix of historic bungalows and modern builds'],
    '78723': ['Eclectic Windsor Park with mid-century and new homes', 'Bartholomew District Park for recreation', 'Growing restaurant and retail scene', 'Community gardens and neighborhood associations', 'Affordable options close to central Austin', 'Mueller development nearby with shops and dining'],
    '78724': ['Walter E. Long Metropolitan Park and lake access', 'Affordable housing with larger lot sizes', 'Mix of rural and suburban character', 'New developments and growth opportunities', 'Fishing, camping, and outdoor trails', 'Positioned for significant future appreciation'],
    '78726': ['Scenic Northwest Hills with rolling terrain', 'Top-rated Leander and Round Rock ISD schools', 'Proximity to major tech employers', 'Quick access to 183A toll road and RM 620', 'Family-friendly planned communities', 'Canyon Creek and Grandview Hills neighborhoods'],
    '78728': ['Wells Branch MUD with recreation center and pool', 'Extensive trail system for walking and biking', 'Affordable housing near I-35 tech corridor', 'Close to major employers along Parmer Lane', 'Established community with strong HOA amenities', 'Convenient access to shopping and dining'],
    '78731': ['Desirable Allandale neighborhood with mid-century charm', 'Northwest Hills with stunning views', 'Proximity to downtown via MoPac and Lamar', 'Top-rated schools and family-friendly atmosphere', 'Shoal Creek and Bull Creek trail access', 'Cat Mountain luxury homes with panoramic views'],
    '78732': ['Master-planned Steiner Ranch community', 'Lake Austin and Lake Travis waterfront access', 'Stunning hill country views throughout', 'Excellent Leander ISD schools', 'Community pools, parks, and miles of trails', 'Multiple neighborhood amenity centers'],
    '78733': ['Scenic Bee Cave area with hill country living', 'Hill Country Galleria shopping and dining', 'Proximity to Lake Travis recreation', 'Exclusive neighborhoods with large lots', 'Rob Roy and Barton Creek West communities', 'Luxury homes in a serene natural setting'],
    '78734': ['Resort-style Lakeway on Lake Travis shores', 'World-class golf at Flintrock Falls', 'Lakeway Resort & Spa and multiple marinas', 'Luxury waterfront homes available', 'Rough Hollow master-planned community', 'Relaxed lakeside lifestyle with upscale amenities'],
    '78735': ['Southwest Austin with hill country character', 'Barton Creek Country Club and Greenbelt access', 'Established neighborhoods with mature trees', 'Hill Country Galleria nearby for shopping', 'Easy downtown access via MoPac expressway', 'Travis Country and Lost Creek communities'],
    '78737': ['Family-friendly communities south of MoPac', 'Top-rated schools in Austin and Hays ISDs', 'Hill country views and natural settings', 'Belterra master-planned community', 'Barton Creek Greenbelt corridor access', 'Growing area with new retail and dining'],
    '78738': ['Upscale Bee Cave and Lakeway communities', 'Hill Country Galleria shopping and entertainment', 'Falconhead Golf Club and Spanish Oaks', 'Resort-style amenities in master-planned communities', 'Excellent Lake Travis ISD schools', 'Texas Hill Country setting with modern convenience'],
    '78739': ['Popular Circle C Ranch community', 'Lady Bird Johnson Wildflower Center nearby', 'Excellent schools and community amenities', 'Suburban feel with easy downtown access', 'Community pools, parks, and green spaces', 'Meridian and Escarpment Village neighborhoods'],
    '78741': ['Rapid growth and development in South Austin', 'Near Austin-Bergstrom International Airport', 'Affordable housing with new developments', 'East Riverside entertainment corridor', 'Oracle campus bringing major employment', 'Proximity to South Congress and downtown'],
    '78744': ['Southeast Austin with affordable options', 'McKinney Falls State Park access', 'Diverse and growing community', 'Southpark Meadows shopping center', 'Easy I-35 and Ben White Blvd access', 'New development and commercial growth'],
    '78745': ['Established South Austin neighborhoods', 'Garrison Park and West Gate communities', 'Mix of mid-century ranch and new construction', 'South Lamar dining and entertainment nearby', 'Barton Creek Greenbelt hiking access', 'Quick commute to downtown Austin'],
    '78746': ['Affluent West Lake Hills and Rollingwood', 'Top-rated Eanes ISD schools', 'Stunning hill country views and luxury estates', 'Barton Creek Country Club access', 'Exclusive gated communities available', 'Among Austin\'s most prestigious addresses'],
    '78748': ['Shady Hollow and Onion Creek planned communities', 'Mid-century designs and new home styles', 'Great schools and family-friendly amenities', 'Southland Oaks and Bauerle Ranch neighborhoods', 'Affordable compared to closer-in Austin', 'Easy access to South Austin amenities'],
    '78749': ['Circle C Ranch — one of Austin\'s top communities', 'Deer Haven, Oak Park, and Legend Oaks neighborhoods', 'Lady Bird Johnson Wildflower Center nearby', 'Excellent AISD schools and family amenities', 'Barton Creek Greenbelt trail access', 'Heights at Loma Vista and Maple Run communities'],
    '78750': ['Anderson Mill and Jollyville established neighborhoods', 'Spicewood Vista and Lakewood Park communities', 'Arboretum shopping district nearby', 'Mature trees and well-maintained properties', 'Proximity to major tech employers', 'Bull Creek greenbelt access for hiking and swimming'],
    '78751': ['Beloved Hyde Park — one of Austin\'s oldest neighborhoods', 'Historic bungalows and tree-canopied streets', 'Walkable to UT campus and Duval Street shops', 'Iconic Shipe Park and community pool', 'Strong neighborhood association and community spirit', 'Central location with easy downtown access'],
    '78752': ['North Loop vintage shops and eclectic restaurants', 'Highland campus redevelopment bringing new energy', 'Austin Community College expansion area', 'Affordable options close to central Austin', 'Growing food and arts scene on North Loop Blvd', 'Easy access to I-35 and Airport Blvd'],
    '78753': ['Diverse and affordable North Austin community', 'Proximity to The Domain and major tech employers', 'Excellent I-35 and US-183 highway access', 'Mix of apartments and single-family homes', 'Walnut Creek Metropolitan Park nearby', 'Growing retail and commercial development'],
    '78754': ['Northeast Austin with new growth and development', 'Samsung semiconductor facility and tech employers', 'Walter E. Long Metropolitan Park access', 'Positioned for significant appreciation', 'Harris Branch planned community', 'Affordable entry point for Austin homeownership'],
    '78756': ['Sought-after Rosedale and Brentwood neighborhoods', 'Charming mid-century homes with tree-lined streets', 'Walkable to Burnet Road shops and restaurants', 'The Triangle mixed-use development nearby', 'Quick downtown access via MoPac or Lamar', 'Central Austin location with neighborhood character'],
    '78757': ['Crestview MetroRail station for easy commuting', 'Vintage shops and acclaimed restaurants on Burnet Road', 'Charming 1950s ranch homes with character', 'Allandale neighborhood with great schools', 'Foodie destination with diverse dining options', 'Strong community events and neighborhood pride'],
    '78758': ['Near The Domain — Austin\'s second downtown', 'Major tech employers: Apple, IBM, Dell nearby', 'Domain and Rock Rose dining and entertainment', 'Mix of established neighborhoods and new development', 'Affordable options with urban convenience', 'Excellent public transit connections'],
    '78759': ['Great Hills and Bull Creek premium neighborhoods', 'The Domain shopping and entertainment nearby', 'Top-rated Round Rock ISD schools', 'Bull Creek greenbelt trails and swimming', 'Arboretum shopping district access', 'Established neighborhoods with mature landscaping'],
  };
  return highlights[zipCode] || [
    'Convenient Austin location with easy highway access',
    'Diverse range of housing options for all budgets',
    'Close to Austin amenities and entertainment',
    'Growing community with strong property values',
    'Access to Austin\'s excellent dining and nightlife',
  ];
}

// ─── Helper: Fetch Mission Control landing page ──────────────────────────

interface PageData {
  id: string;
  title: string;
  slug: string;
  pageType: string;
  content: string;
  sections: any[];
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  indexingDirective: string | null;
  customSchema: any;
  breadcrumbPath: Array<{ name: string; url: string }> | null;
  customScripts: string | null;
}

async function getMissionControlPage(slug: string): Promise<PageData | null> {
  try {
    const res = await fetch(`${MISSION_CONTROL_API}/api/pages/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.page || null;
  } catch (error) {
    console.error('Failed to fetch page from Mission Control:', error);
    return null;
  }
}

// ─── generateStaticParams ────────────────────────────────────────────────

export function generateStaticParams() {
  return ALL_SEO_SLUGS
    .filter((s) => !STATIC_ROUTE_SLUGS.has(s))
    .map((slug) => ({ slug }));
}

// ─── Page Component ─────────────────────────────────────────────────────

export default async function CatchAllSlugPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Check polygon-based communities
  const community = getCommunityBySlug(slug);
  if (community) {
    return renderPolygonCommunity(slug, community);
  }

  // 2. Check area-based communities (slug format: zip-78701 or city-bastrop)
  const areaCommunity = getAreaCommunityBySlug(slug);
  if (areaCommunity) {
    return renderAreaCommunity(slug, areaCommunity);
  }

  // 3. Check zip code URL patterns (e.g., "78701-homes-for-sale" → "78701")
  const zipFromMap = ZIP_URL_MAP[slug];
  const zipCode = zipFromMap || extractZipFromSlug(slug);
  if (zipCode) {
    const zipData = getZipCodeBySlug(zipCode);
    if (zipData) {
      return renderZipCode(slug, zipData);
    }
    // Also check area communities for this zip
    const areaZip = getAreaCommunityBySlug(`zip-${zipCode}`);
    if (areaZip) {
      return renderAreaCommunity(`zip-${zipCode}`, areaZip);
    }
  }

  // 4. Check Mission Control landing pages
  const page = await getMissionControlPage(slug);
  if (page) {
    return renderLandingPage(page);
  }

  // 5. Nothing matched
  notFound();
}

// ─── POLYGON-BASED COMMUNITY ────────────────────────────────────────────

function renderPolygonCommunity(slug: string, community: NonNullable<ReturnType<typeof getCommunityBySlug>>) {
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
  const displayName = areaCommunity.name;

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

  return (
    <>
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

// ─── ZIP CODE RENDERING ─────────────────────────────────────────────────

function renderZipCode(liveSlug: string, zipCodeData: NonNullable<ReturnType<typeof getZipCodeBySlug>>) {
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
              Whether you&apos;re a first-time homebuyer, looking to upgrade, or interested in investment properties,
              the {zipCodeData.zipCode} area provides excellent opportunities in the Austin real estate market.
              Our team at Spyglass Realty specializes in this area and can help you navigate the local market conditions.
            </p>
          </div>
        </div>

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

        {zipCodeData.marketData && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckBadgeIcon className="w-5 h-5 text-spyglass-orange" />
              Market Insights
            </h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                The {zipCodeData.zipCode} market is currently {zipCodeData.marketData.marketTemperature} with{' '}
                {zipCodeData.marketData.activeListings} active listings and a median price of ${zipCodeData.marketData.medianPrice.toLocaleString()}.
                Homes typically sell within {zipCodeData.marketData.avgDaysOnMarket} days, making this
                {zipCodeData.marketData.marketTemperature === 'hot' ? ' a competitive seller\'s market' :
                 zipCodeData.marketData.marketTemperature === 'warm' ? ' a balanced market' : ' a buyer-friendly market'}.
              </p>
            </div>
          </div>
        )}

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
        url: `https://spyglassrealty.com/${liveSlug}`,
        address: {
          '@type': 'PostalAddress',
          postalCode: zipCodeData.zipCode,
          addressLocality: 'Austin',
          addressRegion: 'TX',
          addressCountry: 'US',
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

// ─── LANDING PAGE (Mission Control) ─────────────────────────────────────

function renderLandingPage(page: PageData) {
  const blocks = page.sections || [];

  return (
    <>
      {page.breadcrumbPath && page.breadcrumbPath.length > 0 && (
        <nav className="max-w-[1200px] mx-auto px-4 py-4">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            {page.breadcrumbPath.map((crumb, i) => (
              <li key={i} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                {crumb.url ? (
                  <a href={crumb.url} className="hover:text-[#EF4923] transition-colors">
                    {crumb.name}
                  </a>
                ) : (
                  <span className="text-gray-900 font-medium">{crumb.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <PageRenderer blocks={blocks} />

      {page.customSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(page.customSchema) }}
        />
      )}

      {page.customScripts && (
        <div dangerouslySetInnerHTML={{ __html: page.customScripts }} />
      )}
    </>
  );
}

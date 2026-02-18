import type { Metadata } from 'next';
import { getCommunityBySlug } from '@/data/communities-polygons';
import { getAreaCommunityBySlug } from '@/data/area-communities';
import { getAreaCommunityDescription } from '@/data/area-community-descriptions';
import { getCommunityContent } from '@/data/community-descriptions';
import { getZipCodeBySlug } from '@/data/zip-codes-data';
import { formatCommunityName } from '@/lib/nearby-communities';
import { searchListings } from '@/lib/repliers-api';
import { formatPrice } from '@/lib/utils';
import { ZIP_URL_MAP, extractZipFromSlug } from '@/data/seo-url-aliases';

const MISSION_CONTROL_API = process.env.MISSION_CONTROL_API_URL || 'https://missioncontrol-tjfm.onrender.com';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug } = await params;

  // 1. Check polygon-based communities
  const community = getCommunityBySlug(slug);
  if (community) {
    return generatePolygonMetadata(slug, community);
  }

  // 2. Check area-based communities
  const areaCommunity = getAreaCommunityBySlug(slug);
  if (areaCommunity) {
    return generateAreaMetadata(slug, areaCommunity);
  }

  // 3. Check zip code URL patterns
  const zipFromMap = ZIP_URL_MAP[slug];
  const zipCode = zipFromMap || extractZipFromSlug(slug);
  if (zipCode) {
    const zipData = getZipCodeBySlug(zipCode);
    if (zipData) {
      return generateZipMetadata(slug, zipData);
    }
    const areaZip = getAreaCommunityBySlug(`zip-${zipCode}`);
    if (areaZip) {
      return generateAreaMetadata(`zip-${zipCode}`, areaZip);
    }
  }

  // 4. Mission Control landing pages
  try {
    const res = await fetch(`${MISSION_CONTROL_API}/api/pages/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      const page = data.page;
      if (page) {
        return {
          title: page.metaTitle || page.title,
          description: page.metaDescription || undefined,
          openGraph: {
            title: page.metaTitle || page.title,
            description: page.metaDescription || undefined,
            images: page.ogImageUrl ? [{ url: page.ogImageUrl }] : undefined,
          },
          alternates: {
            canonical: `https://spyglassrealty.com/${slug}`,
          },
          robots: page.indexingDirective
            ? {
                index: !page.indexingDirective.includes('noindex'),
                follow: !page.indexingDirective.includes('nofollow'),
              }
            : undefined,
        };
      }
    }
  } catch {
    // Fall through
  }

  return {
    title: 'Page Not Found | Spyglass Realty',
  };
}

// ─── Polygon community metadata ─────────────────────────────────────────

async function generatePolygonMetadata(
  slug: string,
  community: NonNullable<ReturnType<typeof getCommunityBySlug>>
): Promise<Metadata> {
  const communityName = formatCommunityName(community.name);
  const content = getCommunityContent(slug);
  const contentSnippet = content
    ? content.description.split('\n\n')[0].substring(0, 150) + '...'
    : null;

  let activeCount = 0;
  let medianPrice = '';
  try {
    const results = await searchListings({
      polygon: community.polygon.map(([lng, lat]) => ({ lat, lng })),
      status: ['Active'],
      pageSize: 100,
    });
    activeCount = results.total;

    if (results.listings.length > 0) {
      const sorted = [...results.listings].sort((a, b) => a.price - b.price);
      const median = sorted[Math.floor(sorted.length / 2)].price;
      medianPrice = formatPrice(median);
    }
  } catch {
    // Stats are best-effort
  }

  const title = `Homes for Sale in ${communityName}, Austin TX | Spyglass Realty`;

  let description: string;
  if (activeCount > 0 && medianPrice) {
    description = `Browse ${activeCount} homes for sale in ${communityName}, Austin TX. Median price ${medianPrice}.`;
  } else if (activeCount > 0) {
    description = `Browse ${activeCount} active listings in ${communityName}, Austin TX. Find your dream home with Spyglass Realty.`;
  } else if (contentSnippet) {
    description = `Search homes for sale in ${communityName}, Austin TX. ${contentSnippet}`;
  } else {
    description = `Search homes for sale in ${communityName}, Austin TX. View listings, market data, and neighborhood info with Spyglass Realty.`;
  }

  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  }

  const canonicalUrl = `https://spyglassrealty.com/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Spyglass Realty',
      url: canonicalUrl,
      locale: 'en_US',
      images: [
        {
          url: 'https://spyglassrealty.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `Homes for Sale in ${communityName}, Austin TX`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://spyglassrealty.com/og-image.jpg'],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// ─── Area community metadata ────────────────────────────────────────────

async function generateAreaMetadata(
  slug: string,
  areaCommunity: NonNullable<ReturnType<typeof getAreaCommunityBySlug>>
): Promise<Metadata> {
  const areaDesc = getAreaCommunityDescription(slug);
  const isZip = areaCommunity.type === 'zip';

  let title: string;
  let description: string;

  let activeCount = 0;
  let medianPriceStr = '';
  try {
    const filters = isZip
      ? { zip: areaCommunity.filterValue, pageSize: 100, status: ['Active'] as string[] }
      : { city: areaCommunity.filterValue, pageSize: 100, status: ['Active'] as string[] };
    const results = await searchListings(filters);
    activeCount = results.total;

    if (results.listings.length > 0) {
      const sorted = [...results.listings].sort((a, b) => a.price - b.price);
      const median = sorted[Math.floor(sorted.length / 2)].price;
      medianPriceStr = formatPrice(median);
    }
  } catch {
    // Best-effort
  }

  if (isZip) {
    title = `Homes for Sale in ${areaCommunity.filterValue} | ${areaCommunity.name} | Spyglass Realty`;
    if (activeCount > 0 && medianPriceStr) {
      description = `Browse ${activeCount} homes for sale in the ${areaCommunity.filterValue} zip code (${areaCommunity.name}). Median price ${medianPriceStr}. Updated daily.`;
    } else if (areaDesc) {
      description = areaDesc.description.split('\n\n')[0].substring(0, 155) + '...';
    } else {
      description = `Search homes for sale in the ${areaCommunity.filterValue} zip code area of Austin, TX. View listings, prices, and neighborhood info with Spyglass Realty.`;
    }
  } else {
    title = `Homes for Sale in ${areaCommunity.name}, TX | Spyglass Realty`;
    if (activeCount > 0 && medianPriceStr) {
      description = `Browse ${activeCount} homes for sale in ${areaCommunity.name}, Texas. Median price ${medianPriceStr}. Updated daily.`;
    } else if (areaDesc) {
      description = areaDesc.description.split('\n\n')[0].substring(0, 155) + '...';
    } else {
      description = `Search homes for sale in ${areaCommunity.name}, TX. View listings, market data, and area info with Spyglass Realty.`;
    }
  }

  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  }

  const canonicalUrl = `https://spyglassrealty.com/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Spyglass Realty',
      url: canonicalUrl,
      locale: 'en_US',
      images: [
        {
          url: 'https://spyglassrealty.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: isZip
            ? `Homes for Sale in ${areaCommunity.filterValue}, Austin TX`
            : `Homes for Sale in ${areaCommunity.name}, TX`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://spyglassrealty.com/og-image.jpg'],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// ─── Zip code metadata ──────────────────────────────────────────────────

async function generateZipMetadata(
  liveSlug: string,
  zipData: NonNullable<ReturnType<typeof getZipCodeBySlug>>
): Promise<Metadata> {
  const title = `Homes for Sale in ${zipData.zipCode} (${zipData.name}) | Spyglass Realty`;
  let description = `Search homes for sale in the ${zipData.zipCode} zip code area (${zipData.name}), Austin TX. ${zipData.description.substring(0, 100)}`;
  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  }

  const canonicalUrl = `https://spyglassrealty.com/${liveSlug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Spyglass Realty',
      url: canonicalUrl,
      locale: 'en_US',
      images: [
        {
          url: 'https://spyglassrealty.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `Homes for Sale in ${zipData.zipCode}, Austin TX`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://spyglassrealty.com/og-image.jpg'],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function SlugLayout({ children }: LayoutProps) {
  return children;
}

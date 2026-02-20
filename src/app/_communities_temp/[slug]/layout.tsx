import type { Metadata } from 'next';
import { getCommunityBySlug } from '@/data/communities-polygons';
import { getAreaCommunityBySlug } from '@/data/area-communities';
import { getAreaCommunityDescription } from '@/data/area-community-descriptions';
import { getCommunityContent } from '@/data/community-descriptions';
import { formatCommunityName } from '@/lib/nearby-communities';
import { searchListings } from '@/lib/repliers-api';
import { formatPrice } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug } = await params;

  // 1. Check polygon-based communities first
  const community = getCommunityBySlug(slug);

  if (community) {
    return generatePolygonMetadata(slug, community);
  }

  // 2. Check area-based communities
  const areaCommunity = getAreaCommunityBySlug(slug);

  if (areaCommunity) {
    return generateAreaMetadata(slug, areaCommunity);
  }

  return {
    title: 'Community Not Found | Spyglass Realty',
  };
}

// ─── Polygon community metadata (existing behavior) ─────────────────────

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

  const canonicalUrl = `https://search.spyglassrealty.com/communities/${slug}`;

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

// ─── Area community metadata (zip / city) ────────────────────────────────

async function generateAreaMetadata(
  slug: string,
  areaCommunity: NonNullable<ReturnType<typeof getAreaCommunityBySlug>>
): Promise<Metadata> {
  const areaDesc = getAreaCommunityDescription(slug);

  // Build title and description based on type
  const isZip = areaCommunity.type === 'zip';
  const displayName = isZip ? areaCommunity.filterValue : areaCommunity.name;

  let title: string;
  let description: string;

  // Try to get live listing count for richer description
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

  const canonicalUrl = `https://search.spyglassrealty.com/communities/${slug}`;

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

export default function CommunityLayout({ children }: LayoutProps) {
  return children;
}

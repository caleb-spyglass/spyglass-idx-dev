import type { Metadata } from 'next';
import { getCommunityBySlug } from '@/data/communities-polygons';
import { getCommunityContent } from '@/data/community-descriptions';
import { searchListings } from '@/lib/repliers-api';
import { formatPrice } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const community = getCommunityBySlug(slug);

  if (!community) {
    return {
      title: 'Community Not Found | Spyglass Realty',
    };
  }

  // Title-case the community name
  const communityName = community.name
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  // Get rich content if available for better description
  const content = getCommunityContent(slug);
  const contentSnippet = content
    ? content.description.split('\n\n')[0].substring(0, 150) + '...'
    : null;

  // Fetch active listings to build a richer description
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
    // Stats are best-effort; fall back to a generic description
  }

  const title = `Homes for Sale in ${communityName}, Austin TX | Spyglass Realty`;
  
  // Build a rich, SEO-optimized description
  let description: string;
  if (activeCount > 0 && medianPrice) {
    description = `Browse ${activeCount} homes for sale in ${communityName}, Austin TX. Median price ${medianPrice}. ${contentSnippet || `Find your dream home in ${communityName} with Spyglass Realty — Austin's top-rated brokerage.`}`;
  } else if (activeCount > 0) {
    description = `Browse ${activeCount} active listing${activeCount !== 1 ? 's' : ''} in ${communityName}, Austin TX. ${contentSnippet || `Find your dream home in ${communityName} with Spyglass Realty.`}`;
  } else if (contentSnippet) {
    description = `Search homes for sale in ${communityName}, Austin TX. ${contentSnippet} Find your dream home with Spyglass Realty.`;
  } else {
    description = `Search homes for sale in ${communityName}, Austin TX. View listings, market data, schools, and neighborhood info. Find your dream home with Spyglass Realty.`;
  }

  // Truncate description to optimal SEO length (~155 chars for display)
  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  }

  const canonicalUrl = `https://search.spyglassrealty.com/communities/${slug}`;

  // Build keywords
  const keywords = [
    `${communityName} homes for sale`,
    `${communityName} real estate`,
    `${communityName} Austin TX`,
    `houses for sale ${communityName}`,
    `${communityName} neighborhood`,
    'Austin real estate',
    'Spyglass Realty',
    ...(content?.bestFor || []).map(b => `${communityName} ${b.toLowerCase()}`),
  ].join(', ');

  return {
    title,
    description,
    keywords,
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
      site: '@SpyglassRealty',
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      },
    },
    other: {
      'geo.region': 'US-TX',
      'geo.placename': `${communityName}, Austin`,
    },
  };
}

export default function CommunityLayout({ children }: LayoutProps) {
  return children;
}

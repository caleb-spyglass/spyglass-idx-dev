import type { Metadata } from 'next';
import { getCommunityBySlug } from '@/data/communities-polygons';
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

  const title = `Homes for Sale in ${communityName} | Spyglass Realty`;
  const description =
    activeCount > 0
      ? `Browse ${activeCount} active listing${activeCount !== 1 ? 's' : ''} in ${communityName}, Austin TX.${medianPrice ? ` Median price ${medianPrice}.` : ''} Find your dream home with Spyglass Realty.`
      : `Search homes for sale in ${communityName}, Austin TX. Find your dream home with Spyglass Realty.`;
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
      images: [
        {
          url: 'https://spyglassrealty.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `Homes for Sale in ${communityName}`,
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
  };
}

export default function CommunityLayout({ children }: LayoutProps) {
  return children;
}

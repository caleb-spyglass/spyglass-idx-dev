import type { Metadata } from 'next';
import { getListing } from '@/lib/repliers-api';
import { formatPrice, formatNumber } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ mls: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { mls } = await params;
  const listing = await getListing(mls);

  if (!listing) {
    return {
      title: 'Listing Not Found | Spyglass Realty',
    };
  }

  const price = formatPrice(listing.price);
  const address = listing.address.full;
  const title = `${price} | ${address}`;
  const description = `${listing.bedrooms} bed, ${listing.bathrooms} bath, ${formatNumber(listing.sqft)} sqft ${listing.propertyType} in ${listing.address.city}, TX. Listed at ${price}. View photos and details.`;
  const ogImage = listing.photos.length > 0 ? listing.photos[0] : 'https://spyglassrealty.com/og-image.jpg';
  const canonicalUrl = `https://search.spyglassrealty.com/listing/${mls}`;

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
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${address} - ${price}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default function ListingLayout({ children }: LayoutProps) {
  return children;
}

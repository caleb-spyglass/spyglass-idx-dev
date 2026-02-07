import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Austin Area Communities & Neighborhoods | Spyglass Realty',
  description:
    'Explore 200+ Austin-area neighborhoods across Travis, Williamson, and Hays counties. Browse homes for sale, market data, and neighborhood guides with Spyglass Realty.',
  openGraph: {
    title: 'Austin Area Communities & Neighborhoods | Spyglass Realty',
    description:
      'Explore 200+ Austin-area neighborhoods across Travis, Williamson, and Hays counties. Browse homes for sale, market data, and neighborhood guides.',
    type: 'website',
    siteName: 'Spyglass Realty',
    url: 'https://search.spyglassrealty.com/communities',
    locale: 'en_US',
    images: [
      {
        url: 'https://spyglassrealty.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Austin Area Communities - Spyglass Realty',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Austin Area Communities & Neighborhoods | Spyglass Realty',
    description:
      'Explore 200+ Austin-area neighborhoods. Browse homes, market data, and neighborhood guides.',
    images: ['https://spyglassrealty.com/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://search.spyglassrealty.com/communities',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CommunitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

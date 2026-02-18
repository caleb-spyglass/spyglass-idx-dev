import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Austin Commercial Real Estate & Office Space for Lease | Spyglass Realty',
  description:
    'Find Austin commercial office space fast with AI-powered matching. Browse Downtown, Domain, East Austin & more submarkets. Tenant representation is free. Insurance coordinated at signing.',
  keywords:
    'Austin commercial real estate, Austin office space for lease, commercial lease Austin TX, office space Austin, commercial broker Austin, tenant representation Austin, NNN lease Austin',
  openGraph: {
    title: 'Austin Commercial Space — Found Fast, Insured Faster | Spyglass Realty',
    description:
      'AI-powered commercial real estate in Austin. Office space matching in minutes, tours within days, insurance at signing. Browse 6 submarkets from $22–55/SF.',
    type: 'website',
    siteName: 'Spyglass Realty',
    url: 'https://spyglassrealty.com/commercial',
    images: [
      {
        url: 'https://spyglassrealty.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Spyglass Realty — Austin Commercial Real Estate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Austin Commercial Space — Found Fast, Insured Faster | Spyglass Realty',
    description:
      'AI-powered commercial real estate in Austin. Office space matching in minutes, tours within days, insurance at signing.',
    images: ['https://spyglassrealty.com/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://spyglassrealty.com/commercial',
  },
};

export default function CommercialLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Austin Home Search | Spyglass Realty",
  description: "Search Austin homes for sale. Find houses, condos, and real estate listings in Austin, TX with Spyglass Realty - Austin's top-rated real estate brokerage.",
  keywords: "Austin homes for sale, Austin real estate, Austin TX homes, buy house Austin, Spyglass Realty",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "Austin Home Search | Spyglass Realty",
    description: "Search Austin homes for sale. Find houses, condos, and real estate listings in Austin, TX with Spyglass Realty - Austin's top-rated real estate brokerage.",
    type: "website",
    siteName: "Spyglass Realty",
    images: [
      {
        url: "https://spyglassrealty.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Spyglass Realty - Austin Home Search",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Austin Home Search | Spyglass Realty",
    description: "Search Austin homes for sale. Find houses, condos, and real estate listings in Austin, TX with Spyglass Realty - Austin's top-rated real estate brokerage.",
    images: ["https://spyglassrealty.com/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

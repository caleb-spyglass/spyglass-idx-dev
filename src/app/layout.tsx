import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Austin Home Search | Spyglass Realty",
  description: "Search Austin homes for sale. Find houses, condos, and real estate listings in Austin, TX with Spyglass Realty - Austin's top-rated real estate brokerage.",
  keywords: "Austin homes for sale, Austin real estate, Austin TX homes, buy house Austin, Spyglass Realty",
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

import { Metadata } from "next";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/home/Footer";
import ReviewsContent from "./ReviewsContent";

export const metadata: Metadata = {
  title: "Client Reviews & Testimonials | Spyglass Realty",
  description:
    "Read what our clients say about their experience with Spyglass Realty. Over 1,000+ five-star reviews from satisfied home buyers and sellers across Austin, Texas.",
  openGraph: {
    title: "Client Reviews & Testimonials | Spyglass Realty",
    description:
      "Read what our clients say about their experience with Spyglass Realty. Over 1,000+ five-star reviews from satisfied home buyers and sellers across Austin, Texas.",
  },
};

export default function ReviewsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ReviewsContent />
      <Footer />

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Spyglass Realty",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "1000",
              bestRating: "5",
              worstRating: "1",
            },
          }),
        }}
      />
    </div>
  );
}

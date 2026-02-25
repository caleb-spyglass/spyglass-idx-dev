"use client";

import { useState } from "react";
import { Star, MapPin, Quote, Users, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Sample testimonials — in production this comes from the API
const allTestimonials = [
  {
    id: "1",
    reviewerName: "Sarah Johnson",
    reviewerLocation: "Austin, TX",
    reviewText:
      "Working with Spyglass Realty was an exceptional experience. Their team went above and beyond to help us find our dream home in the perfect neighborhood. Professional, knowledgeable, and genuinely caring. I couldn't be happier with the service we received.",
    rating: 5,
    source: "google",
    isFeatured: true,
    agentName: "John Smith",
    communityName: "Cedar Park",
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    reviewerName: "Michael Chen",
    reviewerLocation: "Round Rock, TX",
    reviewText:
      "Outstanding service from start to finish. The agent was incredibly responsive and helped us navigate a competitive market with confidence. Their market knowledge and negotiation skills saved us thousands. Would definitely recommend to anyone buying or selling.",
    rating: 5,
    source: "zillow",
    isFeatured: true,
    agentName: "Jane Doe",
    communityName: "Round Rock",
    createdAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "3",
    reviewerName: "Jennifer Williams",
    reviewerLocation: "Cedar Park, TX",
    reviewText:
      "Sold our home quickly and for above asking price! The marketing strategy was excellent and the communication throughout the process was top-notch. They made what could have been a stressful experience completely smooth.",
    rating: 5,
    source: "facebook",
    isFeatured: false,
    agentName: "John Smith",
    communityName: null,
    createdAt: "2024-01-08T00:00:00Z",
  },
  {
    id: "4",
    reviewerName: "David Rodriguez",
    reviewerLocation: "Leander, TX",
    reviewText:
      "As first-time buyers, we were nervous about the process. The Spyglass team made everything clear and stress-free. They truly have your best interests at heart and will fight for you during negotiations.",
    rating: 5,
    source: "google",
    isFeatured: false,
    agentName: "Jane Doe",
    communityName: "Leander",
    createdAt: "2024-01-05T00:00:00Z",
  },
  {
    id: "5",
    reviewerName: "Lisa Thompson",
    reviewerLocation: "Georgetown, TX",
    reviewText:
      "Professional, knowledgeable, and results-driven. They helped us sell our previous home and buy our new one seamlessly. Excellent communication and follow-through on every detail.",
    rating: 4,
    source: "google",
    isFeatured: false,
    agentName: null,
    communityName: "Georgetown",
    createdAt: "2024-01-03T00:00:00Z",
  },
  {
    id: "6",
    reviewerName: "Amanda Foster",
    reviewerLocation: "Pflugerville, TX",
    reviewText:
      "We relocated from out of state and the Spyglass team made it seamless. They provided virtual tours, neighborhood guides, and even connected us with local resources. Couldn't have done it without them.",
    rating: 5,
    source: "google",
    isFeatured: false,
    agentName: "John Smith",
    communityName: "Pflugerville",
    createdAt: "2024-02-12T00:00:00Z",
  },
  {
    id: "7",
    reviewerName: "Robert & Maria Garcia",
    reviewerLocation: "Austin, TX",
    reviewText:
      "Our agent was patient, thorough, and incredibly knowledgeable about the Austin market. We looked at over 20 homes before finding the perfect one, and never once felt rushed. Top-tier service.",
    rating: 5,
    source: "google",
    isFeatured: false,
    agentName: "Jane Doe",
    communityName: "Austin",
    createdAt: "2024-02-08T00:00:00Z",
  },
  {
    id: "8",
    reviewerName: "Kevin Wright",
    reviewerLocation: "Lakeway, TX",
    reviewText:
      "Sold our lakefront property in record time. The photography, staging advice, and marketing plan were exceptional. We received multiple offers within the first week. Highly recommend Spyglass.",
    rating: 5,
    source: "zillow",
    isFeatured: false,
    agentName: null,
    communityName: "Lakeway",
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "9",
    reviewerName: "Priya Patel",
    reviewerLocation: "Cedar Park, TX",
    reviewText:
      "The entire buying experience was smooth and well-organized. Our agent anticipated every question we had and was always a step ahead. We felt supported and informed throughout the entire process.",
    rating: 5,
    source: "google",
    isFeatured: false,
    agentName: "John Smith",
    communityName: "Cedar Park",
    createdAt: "2024-03-15T00:00:00Z",
  },
  {
    id: "10",
    reviewerName: "James & Tracy O'Brien",
    reviewerLocation: "Dripping Springs, TX",
    reviewText:
      "We were downsizing from our family home and it was an emotional process. Our Spyglass agent handled everything with care and professionalism. Found us the perfect hill country home.",
    rating: 5,
    source: "google",
    isFeatured: false,
    agentName: "Jane Doe",
    communityName: "Dripping Springs",
    createdAt: "2024-03-10T00:00:00Z",
  },
  {
    id: "11",
    reviewerName: "Stephanie Nguyen",
    reviewerLocation: "Austin, TX",
    reviewText:
      "Bought my first condo downtown with Spyglass. My agent explained every step of the process clearly and made sure I understood all my options. I never felt pressured. Five stars all the way!",
    rating: 5,
    source: "google",
    isFeatured: false,
    agentName: null,
    communityName: "Downtown Austin",
    createdAt: "2024-04-01T00:00:00Z",
  },
  {
    id: "12",
    reviewerName: "Mark Sullivan",
    reviewerLocation: "Bee Cave, TX",
    reviewText:
      "Third transaction with Spyglass and they continue to exceed expectations. Their market analysis was spot-on and we sold above asking. They've earned a client for life.",
    rating: 5,
    source: "zillow",
    isFeatured: false,
    agentName: "John Smith",
    communityName: "Bee Cave",
    createdAt: "2024-04-18T00:00:00Z",
  },
  {
    id: "13",
    reviewerName: "Rachel Kim",
    reviewerLocation: "Round Rock, TX",
    reviewText:
      "The team's knowledge of Round Rock neighborhoods was invaluable. They helped us find a home near great schools within our budget. The negotiation saved us $15K. Absolutely thrilled.",
    rating: 5,
    source: "google",
    isFeatured: false,
    agentName: "Jane Doe",
    communityName: "Round Rock",
    createdAt: "2024-05-02T00:00:00Z",
  },
  {
    id: "14",
    reviewerName: "Chris & Lauren Anderson",
    reviewerLocation: "Austin, TX",
    reviewText:
      "We needed to sell quickly due to a job relocation and Spyglass delivered. From listing to closing in under 30 days, and we got a great price. Their urgency matched ours perfectly.",
    rating: 5,
    source: "google",
    isFeatured: false,
    agentName: null,
    communityName: "Austin",
    createdAt: "2024-05-20T00:00:00Z",
  },
  {
    id: "15",
    reviewerName: "Diana Morales",
    reviewerLocation: "Manor, TX",
    reviewText:
      "Spyglass helped us find an affordable home in a growing area. Our agent was honest about the pros and cons of each property, which we really appreciated. No pushy sales tactics.",
    rating: 5,
    source: "google",
    isFeatured: false,
    agentName: "John Smith",
    communityName: "Manor",
    createdAt: "2024-06-10T00:00:00Z",
  },
  {
    id: "16",
    reviewerName: "Tom Bradley",
    reviewerLocation: "Westlake, TX",
    reviewText:
      "Luxury home purchase handled flawlessly. The attention to detail and discretion were exactly what we needed. Spyglass understands the high-end Austin market better than anyone.",
    rating: 5,
    source: "zillow",
    isFeatured: false,
    agentName: "Jane Doe",
    communityName: "Westlake",
    createdAt: "2024-06-25T00:00:00Z",
  },
  {
    id: "17",
    reviewerName: "Emily & Jason Park",
    reviewerLocation: "Austin, TX",
    reviewText:
      "We had a complicated situation — buying and selling simultaneously with tight timelines. The Spyglass team coordinated everything perfectly. Both transactions closed on the same day.",
    rating: 5,
    source: "google",
    isFeatured: false,
    agentName: null,
    communityName: "South Austin",
    createdAt: "2024-07-08T00:00:00Z",
  },
  {
    id: "18",
    reviewerName: "Sandra Mitchell",
    reviewerLocation: "Hutto, TX",
    reviewText:
      "Great experience from start to finish. Our agent was responsive, knowledgeable, and fought hard during negotiations. We got the home we wanted at a price we could afford.",
    rating: 5,
    source: "google",
    isFeatured: false,
    agentName: "John Smith",
    communityName: "Hutto",
    createdAt: "2024-07-22T00:00:00Z",
  },
  {
    id: "19",
    reviewerName: "Carlos Reyes",
    reviewerLocation: "Austin, TX",
    reviewText:
      "Investment property purchase went perfectly. My agent understood the rental market and helped me find a property with great cash flow potential. Already seeing returns.",
    rating: 5,
    source: "google",
    isFeatured: false,
    agentName: "Jane Doe",
    communityName: "East Austin",
    createdAt: "2024-08-05T00:00:00Z",
  },
  {
    id: "20",
    reviewerName: "Beth Ann Cooper",
    reviewerLocation: "Georgetown, TX",
    reviewText:
      "Second time using Spyglass and they've only gotten better. The technology tools they provide for tracking the buying process were incredibly helpful. Modern brokerage with personal service.",
    rating: 5,
    source: "google",
    isFeatured: false,
    agentName: null,
    communityName: "Georgetown",
    createdAt: "2024-08-19T00:00:00Z",
  },
];

const REVIEWS_PER_PAGE = 6;

const getSourceBadge = (source: string) => {
  const sourceConfig: Record<string, { label: string; className: string; icon: string }> = {
    google: {
      label: "Google",
      className: "bg-blue-100 text-blue-800",
      icon: "🔍",
    },
    zillow: {
      label: "Zillow",
      className: "bg-green-100 text-green-800",
      icon: "🏠",
    },
    facebook: {
      label: "Facebook",
      className: "bg-purple-100 text-purple-800",
      icon: "📘",
    },
    manual: {
      label: "Verified",
      className: "bg-gray-100 text-gray-800",
      icon: "✓",
    },
  };

  const config = sourceConfig[source] || sourceConfig.manual;

  return (
    <Badge className={`${config.className} text-xs`}>
      {config.icon} {config.label}
    </Badge>
  );
};

const renderStars = (rating: number) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ))}
  </div>
);

export default function ReviewsContent() {
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_PAGE);

  const visibleReviews = allTestimonials.slice(0, visibleCount);
  const hasMore = visibleCount < allTestimonials.length;

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-50 to-orange-100 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Quote className="h-8 w-8 text-[#EF4923]" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Client Reviews & Testimonials
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Don&apos;t just take our word for it. See what our clients have to
              say about their experience working with Spyglass Realty across
              Austin, Texas.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#EF4923] mb-2">
                  1,000+
                </div>
                <div className="text-gray-600">Five-Star Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#EF4923] mb-2">
                  98%
                </div>
                <div className="text-gray-600">Client Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#EF4923] mb-2">
                  4.9
                </div>
                <div className="text-gray-600 flex items-center justify-center gap-2">
                  Average Rating
                  <div className="flex">{renderStars(5)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid — no filters */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {visibleReviews.map((testimonial) => (
              <Card
                key={testimonial.id}
                className={`${
                  testimonial.isFeatured
                    ? "ring-2 ring-[#EF4923] ring-opacity-20 bg-orange-50"
                    : "bg-white"
                } hover:shadow-lg transition-all duration-300 border-gray-200`}
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#EF4923] flex items-center justify-center text-white font-medium">
                          {testimonial.reviewerName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {testimonial.reviewerName}
                          </h3>
                          {testimonial.reviewerLocation && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MapPin className="h-3 w-3" />
                              {testimonial.reviewerLocation}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {renderStars(testimonial.rating)}
                        {getSourceBadge(testimonial.source)}
                        {testimonial.isFeatured && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            ⭐ Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="mb-4">
                    <Quote className="h-5 w-5 text-[#EF4923] mb-2" />
                    <p className="text-gray-700 leading-relaxed">
                      {testimonial.reviewText}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="border-t pt-4 text-sm text-gray-500">
                    <div className="flex items-center justify-between">
                      <div>
                        {testimonial.agentName && (
                          <div className="flex items-center gap-1 mb-1">
                            <Users className="h-3 w-3" />
                            Worked with {testimonial.agentName}
                          </div>
                        )}
                        {testimonial.communityName && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {testimonial.communityName} area
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        {new Date(testimonial.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", year: "numeric" }
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                className="border-[#EF4923] text-[#EF4923] hover:bg-[#EF4923] hover:text-white"
                onClick={() =>
                  setVisibleCount((prev) => prev + REVIEWS_PER_PAGE)
                }
              >
                Load More Reviews
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#EF4923] to-orange-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">
            Ready to Experience the Spyglass Difference?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of satisfied clients who chose Spyglass Realty for
            their real estate needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/home-value">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-[#EF4923] hover:bg-gray-100"
              >
                Get Your Home Value
              </Button>
            </Link>
            <Link href="/agents">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#EF4923]"
              >
                Find an Agent
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

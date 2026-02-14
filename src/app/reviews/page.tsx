import { Metadata } from "next";
import { Star, MapPin, Quote, Filter, Users, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample testimonials data - in production this would come from the API
const testimonials = [
  {
    id: "1",
    reviewerName: "Sarah Johnson",
    reviewerLocation: "Austin, TX",
    reviewText: "Working with Spyglass Realty was an exceptional experience. Their team went above and beyond to help us find our dream home in the perfect neighborhood. Professional, knowledgeable, and genuinely caring. I couldn't be happier with the service we received.",
    rating: 5,
    source: "google",
    photoUrl: null,
    isFeatured: true,
    agentName: "John Smith",
    communityName: "Cedar Park",
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2", 
    reviewerName: "Michael Chen",
    reviewerLocation: "Round Rock, TX",
    reviewText: "Outstanding service from start to finish. The agent was incredibly responsive and helped us navigate a competitive market with confidence. Their market knowledge and negotiation skills saved us thousands. Would definitely recommend to anyone buying or selling.",
    rating: 5,
    source: "zillow",
    photoUrl: null,
    isFeatured: true,
    agentName: "Jane Doe",
    communityName: "Round Rock",
    createdAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "3",
    reviewerName: "Jennifer Williams", 
    reviewerLocation: "Cedar Park, TX",
    reviewText: "Sold our home quickly and for above asking price! The marketing strategy was excellent and the communication throughout the process was top-notch. They made what could have been a stressful experience completely smooth.",
    rating: 5,
    source: "facebook",
    photoUrl: null,
    isFeatured: false,
    agentName: "John Smith",
    communityName: null,
    createdAt: "2024-01-08T00:00:00Z",
  },
  {
    id: "4",
    reviewerName: "David Rodriguez",
    reviewerLocation: "Leander, TX", 
    reviewText: "As first-time buyers, we were nervous about the process. The Spyglass team made everything clear and stress-free. They truly have your best interests at heart and will fight for you during negotiations.",
    rating: 5,
    source: "google",
    photoUrl: null,
    isFeatured: false,
    agentName: "Jane Doe",
    communityName: "Leander",
    createdAt: "2024-01-05T00:00:00Z",
  },
  {
    id: "5",
    reviewerName: "Lisa Thompson",
    reviewerLocation: "Georgetown, TX",
    reviewText: "Professional, knowledgeable, and results-driven. They helped us sell our previous home and buy our new one seamlessly. Excellent communication and follow-through on every detail.",
    rating: 4,
    source: "manual",
    photoUrl: null,
    isFeatured: false,
    agentName: null,
    communityName: "Georgetown",
    createdAt: "2024-01-03T00:00:00Z",
  },
];

export const metadata: Metadata = {
  title: "Client Reviews & Testimonials | Spyglass Realty",
  description: "Read what our clients say about their experience with Spyglass Realty. Over 500+ five-star reviews from satisfied home buyers and sellers across Austin, Texas.",
  openGraph: {
    title: "Client Reviews & Testimonials | Spyglass Realty",
    description: "Read what our clients say about their experience with Spyglass Realty. Over 500+ five-star reviews from satisfied home buyers and sellers across Austin, Texas.",
  },
};

const getSourceBadge = (source: string) => {
  const sourceConfig = {
    google: { label: "Google", className: "bg-blue-100 text-blue-800", icon: "🔍" },
    zillow: { label: "Zillow", className: "bg-green-100 text-green-800", icon: "🏠" },
    facebook: { label: "Facebook", className: "bg-purple-100 text-purple-800", icon: "📘" },
    manual: { label: "Verified", className: "bg-gray-100 text-gray-800", icon: "✓" },
  };
  
  const config = sourceConfig[source as keyof typeof sourceConfig] || sourceConfig.manual;
  
  return (
    <Badge className={`${config.className} text-xs`}>
      {config.icon} {config.label}
    </Badge>
  );
};

const renderStars = (rating: number) => {
  return (
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
};

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-white">
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
              Don't just take our word for it. See what our clients have to say about their experience 
              working with Spyglass Realty across Austin, Texas.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#EF4923] mb-2">500+</div>
                <div className="text-gray-600">Five-Star Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#EF4923] mb-2">98%</div>
                <div className="text-gray-600">Client Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#EF4923] mb-2">4.9</div>
                <div className="text-gray-600 flex items-center justify-center gap-2">
                  Average Rating
                  <div className="flex">
                    {renderStars(5)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-900">Filter Reviews:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="zillow">Zillow</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Areas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  <SelectItem value="austin">Austin</SelectItem>
                  <SelectItem value="cedar-park">Cedar Park</SelectItem>
                  <SelectItem value="round-rock">Round Rock</SelectItem>
                  <SelectItem value="leander">Leander</SelectItem>
                  <SelectItem value="georgetown">Georgetown</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Agents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  <SelectItem value="john-smith">John Smith</SelectItem>
                  <SelectItem value="jane-doe">Jane Doe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.id}
                className={`${testimonial.isFeatured ? 'ring-2 ring-[#EF4923] ring-opacity-20 bg-orange-50' : 'bg-white'} 
                  hover:shadow-lg transition-all duration-300 border-gray-200`}
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
                        {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              className="border-[#EF4923] text-[#EF4923] hover:bg-[#EF4923] hover:text-white"
            >
              Load More Reviews
            </Button>
          </div>
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
            Join hundreds of satisfied clients who chose Spyglass Realty for their real estate needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-[#EF4923] hover:bg-gray-100"
            >
              Get Your Home Value
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#EF4923]"
            >
              Find an Agent
            </Button>
          </div>
        </div>
      </section>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Spyglass Realty",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "500",
              "bestRating": "5",
              "worstRating": "1"
            },
            "review": testimonials.map(testimonial => ({
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": testimonial.reviewerName
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": testimonial.rating,
                "bestRating": "5",
                "worstRating": "1"
              },
              "reviewBody": testimonial.reviewText,
              "datePublished": testimonial.createdAt
            }))
          })
        }}
      />
    </div>
  );
}
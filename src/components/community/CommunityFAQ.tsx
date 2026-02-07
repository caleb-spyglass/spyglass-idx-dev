'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { formatPrice } from '@/lib/utils';

export interface FAQItem {
  question: string;
  answer: string;
}

interface CommunityFAQProps {
  communityName: string;
  communitySlug: string;
  county: string;
  stats?: {
    activeListings: number;
    medianPrice: number;
    avgPrice: number;
    pricePerSqft: number;
    avgDaysOnMarket: number;
    avgSqft: number;
    avgBedrooms: number;
  } | null;
  highlights?: string[];
  bestFor?: string[];
  nearbyLandmarks?: string[];
}

function generateFAQs({
  communityName,
  county,
  stats,
  highlights,
  bestFor,
  nearbyLandmarks,
}: CommunityFAQProps): FAQItem[] {
  const faqs: FAQItem[] = [];

  // Q1: Average home price
  if (stats && stats.medianPrice > 0) {
    faqs.push({
      question: `What is the average home price in ${communityName}?`,
      answer: `The median home price in ${communityName} is ${formatPrice(stats.medianPrice)}, with an average price of ${formatPrice(stats.avgPrice)}. The average price per square foot is $${stats.pricePerSqft}. Prices vary depending on home size, condition, and specific location within the neighborhood. Contact Spyglass Realty for a personalized market analysis.`,
    });
  } else {
    faqs.push({
      question: `What is the average home price in ${communityName}?`,
      answer: `Home prices in ${communityName} vary depending on the property type, size, and location within the neighborhood. Contact Spyglass Realty at 512-827-8323 for the latest pricing data and a personalized market analysis.`,
    });
  }

  // Q2: Is it a good place to live?
  const bestForText = bestFor && bestFor.length > 0
    ? ` The neighborhood is especially popular with ${bestFor.slice(0, 3).join(', ').toLowerCase()}.`
    : '';
  const highlightsText = highlights && highlights.length > 0
    ? ` Key highlights include: ${highlights.slice(0, 3).join('; ').toLowerCase()}.`
    : '';
  faqs.push({
    question: `Is ${communityName} a good place to live?`,
    answer: `Yes, ${communityName} is a highly desirable neighborhood in ${county} County, Austin, Texas.${bestForText}${highlightsText} The area offers a great quality of life with access to Austin's dining, entertainment, outdoor recreation, and employment centers.`,
  });

  // Q3: How many homes are for sale?
  if (stats && stats.activeListings > 0) {
    const marketDesc = stats.avgDaysOnMarket <= 21
      ? "a seller's market with homes selling quickly"
      : stats.avgDaysOnMarket <= 40
      ? 'a balanced market with steady demand'
      : "a buyer's market with more time to decide";
    faqs.push({
      question: `How many homes are for sale in ${communityName}?`,
      answer: `There are currently ${stats.activeListings} active listings in ${communityName}. The market is ${marketDesc}, with homes averaging ${stats.avgDaysOnMarket} days on market. Browse all available listings on this page or contact Spyglass Realty for help finding your perfect home.`,
    });
  }

  // Q4: What are the best schools?
  faqs.push({
    question: `What are the best schools near ${communityName}?`,
    answer: `${communityName} is served by schools in ${county} County. The specific schools depend on your exact address within the neighborhood. Popular school districts serving the Austin area include Austin ISD, Eanes ISD, Lake Travis ISD, Leander ISD, and Round Rock ISD. Contact Spyglass Realty for detailed school zone information for any property you're considering.`,
  });

  // Q5: What is there to do nearby?
  if (nearbyLandmarks && nearbyLandmarks.length > 0) {
    faqs.push({
      question: `What is there to do near ${communityName}?`,
      answer: `${communityName} offers convenient access to a variety of attractions and amenities. Nearby points of interest include ${nearbyLandmarks.join(', ')}. The neighborhood's location in the greater Austin area also provides easy access to live music venues, dining, outdoor recreation, and cultural events.`,
    });
  }

  // Q6: What types of homes are available?
  if (stats && stats.avgSqft > 0) {
    faqs.push({
      question: `What types of homes are available in ${communityName}?`,
      answer: `${communityName} features a mix of property types including single-family homes, condos, and townhomes. The average home size is approximately ${Math.round(stats.avgSqft).toLocaleString()} square feet with ${stats.avgBedrooms} bedrooms. Properties range from starter homes to luxury estates, with something for every budget and lifestyle.`,
    });
  }

  // Q7: How do I buy a home?
  faqs.push({
    question: `How do I buy a home in ${communityName}?`,
    answer: `To buy a home in ${communityName}, start by browsing the active listings on this page. When you find properties you're interested in, contact Spyglass Realty at 512-827-8323 or use the contact form on this page. Our experienced agents specialize in ${communityName} and the greater Austin area and can guide you through every step of the home buying process, from showings to closing.`,
  });

  return faqs;
}

export default function CommunityFAQ(props: CommunityFAQProps) {
  const faqs = generateFAQs(props);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Frequently Asked Questions About {props.communityName}
      </h2>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              aria-expanded={openIndex === index}
            >
              <h3 className="text-base font-semibold text-gray-900 pr-4">
                {faq.question}
              </h3>
              <ChevronDownIcon
                className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <p className="px-5 pb-4 text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  );
}

// Export the FAQ generation function for use in layout metadata
export { generateFAQs };

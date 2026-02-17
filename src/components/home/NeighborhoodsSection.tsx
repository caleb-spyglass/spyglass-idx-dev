'use client';

import Link from 'next/link';
import { useSiteContent } from '@/hooks/useSiteContent';

const DEFAULTS = {
  heading: "Austin Neighborhoods",
  subtitle: "Explore the communities that make Austin one of the best places to live",
  items: [
    { name: 'South Congress', slug: 'south-congress', image: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=400' },
    { name: 'Downtown', slug: 'downtown', image: 'https://images.unsplash.com/photo-1570636614075-3009b1b5e25f?w=400' },
    { name: 'Westlake', slug: 'westlake-hills', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400' },
    { name: 'Mueller', slug: 'mueller', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400' },
    { name: 'East Austin', slug: 'east-austin', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400' },
    { name: 'Circle C Ranch', slug: 'circle-c-ranch', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400' },
  ],
  exploreAllText: "Explore All Neighborhoods",
  exploreAllLink: "/communities",
};

export function NeighborhoodsSection() {
  const content = useSiteContent('neighborhoods', DEFAULTS);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          {content.heading}
        </h2>
        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
          {content.subtitle}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {content.items.map((hood: any) => (
            <Link
              key={hood.slug}
              href={`/communities/${hood.slug}`}
              className="group relative h-48 md:h-56 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
            >
              <img
                src={hood.image}
                alt={hood.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="text-lg font-bold">{hood.name}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href={content.exploreAllLink}
            className="inline-flex items-center px-8 py-3 border-2 border-spyglass-orange text-spyglass-orange font-semibold rounded-lg hover:bg-spyglass-orange hover:text-white transition-all"
          >
            {content.exploreAllText}
          </Link>
        </div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { useSiteContent } from '@/hooks/useSiteContent';

const DEFAULTS = {
  heading: "What brings you here?",
  cards: [
    {
      title: "Find Your Next Home",
      description: "Access exclusive listings and AI-powered search to find properties before they hit the MLS.",
      imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      imageAlt: "Modern home interior",
      linkText: "See homes before they hit the market →",
      linkHref: "/buy",
    },
    {
      title: "Sell for More. Stress Less",
      description: "Our proven marketing strategy sells homes for 102% of asking price on average.",
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      imageAlt: "Luxury home exterior",
      linkText: "Get your free home valuation →",
      linkHref: "/sell",
    },
  ],
};

export function WhatBringsYouSection() {
  const content = useSiteContent('whatBringsYou', DEFAULTS);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          {content.heading}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {content.cards.map((card: any, index: number) => (
            <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <img
                src={card.imageUrl}
                alt={card.imageAlt || card.title}
                className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
                <p className="text-white/80 text-sm mb-4">
                  {card.description}
                </p>
                <Link 
                  href={card.linkHref} 
                  className="inline-flex items-center text-spyglass-orange font-medium hover:text-white transition-colors"
                >
                  {card.linkText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

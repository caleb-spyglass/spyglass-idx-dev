'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AISearchBar } from '@/components/search/AISearchBar';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useSiteContent } from '@/hooks/useSiteContent';

const DEFAULTS = {
  headline: "Your Home. Our Obsession.",
  subtitleStats: "1,200+ 5-star reviews  |  2,500+ Homes Sold  |  $2B+ in Volume  |  #1 Independent Brokerage",
  subtitleTagline: "Austin's premier real estate brokerage",
  backgroundImage: "/images/austin-skyline-hero.jpg",
  backgroundImageFallback: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
  primaryCtaText: "Search Homes",
  primaryCtaLink: "/search",
  secondaryCtaText: "What's My Home Worth?",
  secondaryCtaLink: "/sell",
  searchPlaceholder: "Enter neighborhood, address, or ZIP code",
  trustBarItems: [
    "1,200+ Reviews",
    "2,500+ Homes Sold",
    "$2B+ in Volume",
    "#1 Independent Brokerage",
  ],
};

interface HeroSectionProps {
  onSearchResults: (results: {
    listings: any[];
    total: number;
    summary: string;
    nlpId: string;
    matchedCommunity?: { name: string; slug: string } | null;
  }) => void;
  onShowSearchPage: () => void;
}

export function HeroSection({ onSearchResults, onShowSearchPage }: HeroSectionProps) {
  const content = useSiteContent('hero', DEFAULTS);

  const handleSearchResults = (results: any) => {
    onSearchResults(results);
    onShowSearchPage();
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${content.backgroundImage}'), url('${content.backgroundImageFallback}')`
          }}
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
          {content.headline}
        </h1>

        {/* Subtitle Stats */}
        <p className="text-lg md:text-xl text-white/80 mb-3">
          {content.subtitleStats}
        </p>
        <p className="text-base text-white/60 mb-8">
          {content.subtitleTagline}
        </p>

        {/* Dual CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button
            onClick={onShowSearchPage}
            className="px-8 py-3.5 bg-spyglass-orange hover:bg-spyglass-orange-hover text-white font-semibold rounded-lg transition-all text-lg shadow-lg hover:shadow-xl"
          >
            {content.primaryCtaText}
          </button>
          <Link
            href={content.secondaryCtaLink}
            className="px-8 py-3.5 bg-white/10 backdrop-blur-sm border-2 border-white/40 text-white font-semibold rounded-lg hover:bg-white/20 transition-all text-lg"
          >
            {content.secondaryCtaText}
          </Link>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <AISearchBar
                onResults={handleSearchResults}
                onClear={() => {}}
                placeholder={content.searchPlaceholder}
              />
            </div>
            <button
              onClick={onShowSearchPage}
              className="px-5 py-3 bg-spyglass-orange hover:bg-spyglass-orange-hover rounded-lg text-white transition-all flex items-center gap-2 font-medium"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              <span className="hidden md:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Trust Bar - Star Ratings */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
          <div className="flex items-center gap-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="ml-1">{content.trustBarItems[0]}</span>
          </div>
          {content.trustBarItems.slice(1).map((item: string, i: number) => (
            <span key={i}>
              <span className="hidden sm:inline text-white/30 mr-6">|</span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

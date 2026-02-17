'use client';

import { HeroSection } from './HeroSection';
import { StatsBar } from './StatsBar';
import { WhatBringsYouSection } from './WhatBringsYouSection';
import { SpyglassDifferenceSection } from './SpyglassDifferenceSection';
import { FeaturedListingsSection } from './FeaturedListingsSection';
import { TestimonialsSection } from './TestimonialsSection';
import { NeighborhoodsSection } from './NeighborhoodsSection';
import { NewFormSection } from './NewFormSection';
import { Footer } from './Footer';

interface HomePageProps {
  onSearchResults: (results: {
    listings: any[];
    total: number;
    summary: string;
    nlpId: string;
    matchedCommunity?: { name: string; slug: string } | null;
  }) => void;
  onShowSearchPage: () => void;
}

export function HomePage({ onSearchResults, onShowSearchPage }: HomePageProps) {
  return (
    <div className="min-h-screen">
      <HeroSection 
        onSearchResults={onSearchResults} 
        onShowSearchPage={onShowSearchPage} 
      />
      <StatsBar />
      <WhatBringsYouSection />
      <SpyglassDifferenceSection />
      <FeaturedListingsSection />
      <TestimonialsSection />
      <NeighborhoodsSection />
      <NewFormSection />
      <Footer />
    </div>
  );
}

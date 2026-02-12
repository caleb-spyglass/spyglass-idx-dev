'use client';

import { useState } from 'react';
import { HeroSection } from './HeroSection';
import { StatsBar } from './StatsBar';
import { AwardsSection } from './AwardsSection';
import { SellerSection } from './SellerSection';
import { BuyerSection } from './BuyerSection';
import { TestimonialsSection } from './TestimonialsSection';
import { ReviewsSection } from './ReviewsSection';
import { WhyChooseSection } from './WhyChooseSection';
import { ThreeReasonsSection } from './ThreeReasonsSection';
import { NewFormSection } from './NewFormSection';
import { YouTubeSection } from './YouTubeSection';
import { CTABar } from './CTABar';
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
      <AwardsSection />
      <SellerSection />
      <BuyerSection />
      <TestimonialsSection />
      <ReviewsSection />
      <WhyChooseSection />
      <ThreeReasonsSection />
      <NewFormSection />
      <YouTubeSection />
      <CTABar />
      <Footer />
    </div>
  );
}
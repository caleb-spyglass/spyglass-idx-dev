'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AISearchBar } from '@/components/search/AISearchBar';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

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
  const [activeTab, setActiveTab] = useState('buy');

  const handleSearchResults = (results: any) => {
    onSearchResults(results);
    onShowSearchPage();
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/austin-skyline-hero.jpg'), url('https://images.unsplash.com/photo-1531218150217-54595bc2b934?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
        {/* Welcome Label */}
        <div className="inline-block mb-4">
          <span className="px-4 py-2 bg-spyglass-orange/20 border border-spyglass-orange/40 rounded-full text-sm font-medium text-spyglass-orange uppercase tracking-wider">
            Welcome to Spyglass Realty
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
          Highly Reviewed, Trained, and Experienced{' '}
          <span className="text-spyglass-orange">Real Estate Agents</span>{' '}
          in Austin
        </h1>

        {/* Search Bar Container */}
        <div className="max-w-3xl mx-auto mb-8">
          {/* Search Tabs */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex bg-black/20 backdrop-blur-sm rounded-xl p-1">
              {[
                { id: 'buy', label: 'Buy' },
                { id: 'sell', label: 'Sell' },
                { id: 'rent', label: 'Rent' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-md'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Search Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <AISearchBar
                onResults={handleSearchResults}
                onClear={() => {}}
                placeholder="Try: '3 bed house in Austin under $500k with a pool'"
              />
            </div>
            
            {/* Filters Button */}
            <button
              onClick={onShowSearchPage}
              className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              <span className="hidden md:inline">Filters</span>
            </button>
          </div>

          {/* Search Button is integrated in AISearchBar */}
        </div>

        {/* Get Consultation Link */}
        <div className="text-center">
          <Link 
            href="/contact"
            className="inline-flex items-center text-spyglass-orange hover:text-white text-lg font-medium transition-colors group"
          >
            GET A CONSULTATION
            <svg 
              className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
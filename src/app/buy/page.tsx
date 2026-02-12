'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/home/Footer';
import { AISearchBar } from '@/components/search/AISearchBar';
import { useState } from 'react';
import { Listing } from '@/types/listing';

export default function BuyPage() {
  const [searchResults, setSearchResults] = useState<{ listings: Listing[]; total: number; summary: string } | null>(null);

  const handleSearchResults = (results: { listings: Listing[]; total: number; summary: string; nlpId: string; matchedCommunity?: { name: string; slug: string } | null }) => {
    setSearchResults(results);
    // Redirect to main search page with results
    window.location.href = '/';
  };

  const handleClearSearch = () => {
    setSearchResults(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-spyglass-dark to-spyglass-charcoal text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center space-y-6">
            <div className="inline-block bg-spyglass-orange/20 border border-spyglass-orange/30 rounded-full px-4 py-2 text-spyglass-orange font-medium text-sm uppercase tracking-wide">
              BUYING
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Buy a Home in Austin with{' '}
              <span className="text-spyglass-orange">Trusted Local Experts</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Let our experienced team guide you through every step of the home buying process in Austin, Texas.
            </p>
            
            {/* AI Search Bar */}
            <div className="max-w-4xl mx-auto mt-12">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold mb-4 text-center">
                  Find Your Perfect Home
                </h3>
                <AISearchBar
                  onResults={handleSearchResults}
                  onClear={handleClearSearch}
                  placeholder="Tell us what you're looking for... (e.g., 'Modern 3 bedroom home in South Austin under $600k')"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Service Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Full-Service Solution for Buyers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive support throughout your home buying journey, ensuring you make informed decisions every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Oriented */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Service Oriented</h3>
              <p className="text-gray-600">
                Our client-first approach ensures you receive personalized attention and dedicated support throughout your home buying experience.
              </p>
            </div>

            {/* Listening to Your Needs */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Listening to Your Needs</h3>
              <p className="text-gray-600">
                We take the time to understand your unique requirements, preferences, and budget to find the perfect home for your lifestyle.
              </p>
            </div>

            {/* Experienced and Reliable */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Experienced and Reliable</h3>
              <p className="text-gray-600">
                With years of experience in the Austin market, our team provides reliable guidance you can trust for one of life's biggest decisions.
              </p>
            </div>

            {/* Up-to-Date Information */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Up-to-Date Information</h3>
              <p className="text-gray-600">
                Stay ahead with real-time market data, new listings alerts, and comprehensive neighborhood insights to make informed decisions.
              </p>
            </div>

            {/* Relocation Services */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Relocation Services</h3>
              <p className="text-gray-600">
                Moving to Austin from another city? Our comprehensive relocation services make your transition smooth and stress-free.
              </p>
              <Link href="/relocation" className="inline-flex items-center text-spyglass-orange hover:text-spyglass-orange-hover font-medium mt-4">
                Learn more
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Search Active Listings */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Search Active Listings</h3>
              <p className="text-gray-600">
                Browse thousands of active listings with our advanced search tools, including AI-powered search and detailed filters.
              </p>
              <Link href="/" className="inline-flex items-center text-spyglass-orange hover:text-spyglass-orange-hover font-medium mt-4">
                Start searching
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Buyers Say
            </h2>
            <p className="text-xl text-gray-600">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "The Spyglass team made our home buying process incredibly smooth. Their knowledge of Austin neighborhoods was invaluable."
              </p>
              <div className="text-gray-900 font-semibold">Sarah & Mike Johnson</div>
              <div className="text-gray-500 text-sm">Bought in Travis Heights</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "Professional, responsive, and truly caring. They went above and beyond to help us find our dream home in Austin."
              </p>
              <div className="text-gray-900 font-semibold">David Chen</div>
              <div className="text-gray-500 text-sm">Bought in Mueller</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "As first-time home buyers, we couldn't have asked for better guidance. Every question was answered with patience and expertise."
              </p>
              <div className="text-gray-900 font-semibold">Amanda Rodriguez</div>
              <div className="text-gray-500 text-sm">Bought in South Lamar</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-spyglass-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's start your home buying journey today. Get personalized recommendations and expert guidance every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="bg-spyglass-orange hover:bg-spyglass-orange-hover px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Schedule Consultation
            </Link>
            <Link 
              href="/"
              className="border-2 border-white text-white hover:bg-white hover:text-spyglass-charcoal px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Start Searching
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
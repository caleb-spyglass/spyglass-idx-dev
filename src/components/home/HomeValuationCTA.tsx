'use client';

import { useState } from 'react';
import ContactModal from '@/components/forms/ContactModal';

/**
 * Home Valuation CTA section — high-converting lead capture for sellers.
 * Can be embedded on the homepage, sell page, community pages, etc.
 */
export default function HomeValuationCTA() {
  const [address, setAddress] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      setShowModal(true);
    }
  };

  return (
    <>
      <section className="bg-gradient-to-br from-spyglass-charcoal via-gray-800 to-gray-900 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80 mb-6">
            <svg className="w-4 h-4 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Free · Instant · No Obligation
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            What&apos;s Your Home Worth?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Get a free, no-obligation home valuation from Austin&apos;s top-rated brokerage. 
            Our market experts will provide a detailed analysis based on recent comparable sales.
          </p>

          {/* Address Input */}
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your home address"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-spyglass-orange focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 sm:px-8 py-4 bg-spyglass-orange hover:bg-spyglass-orange-hover text-white font-semibold rounded-xl transition-colors whitespace-nowrap"
              >
                Get Value
              </button>
            </div>
          </form>

          {/* Trust Signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
              </div>
              <span>4.9/5 on Google</span>
            </div>
            <div className="w-px h-4 bg-gray-600 hidden sm:block" />
            <div>500+ Reviews</div>
            <div className="w-px h-4 bg-gray-600 hidden sm:block" />
            <div>179+ Licensed Agents</div>
          </div>
        </div>
      </section>

      <ContactModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        listingAddress={address}
        variant="info"
        title="Get Your Free Home Valuation"
      />
    </>
  );
}

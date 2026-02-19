'use client';

import { useState, useEffect } from 'react';
import ContactModal from '@/components/forms/ContactModal';

interface ListingCTABarProps {
  listingAddress: string;
  mlsNumber: string;
  price: string;
  listingAgentName?: string;
}

/**
 * Floating CTA bar that appears at the bottom of listing detail pages
 * when the user scrolls past the hero section. Contains schedule showing
 * and request info buttons that open lead capture modals.
 */
export default function ListingCTABar({
  listingAddress,
  mlsNumber,
  price,
  listingAgentName,
}: ListingCTABarProps) {
  const [showBar, setShowBar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalVariant, setModalVariant] = useState<'showing' | 'info'>('showing');

  useEffect(() => {
    const handleScroll = () => {
      // Show bar after scrolling past 300px (past the hero)
      setShowBar(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openModal = (variant: 'showing' | 'info') => {
    setModalVariant(variant);
    setShowModal(true);
  };

  return (
    <>
      {/* Floating Bottom Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${
          showBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Price + Address (collapsed on mobile) */}
              <div className="hidden sm:block min-w-0 flex-1">
                <div className="text-lg font-bold text-gray-900">{price}</div>
                <div className="text-sm text-gray-500 truncate">{listingAddress}</div>
              </div>

              {/* Mobile: just price */}
              <div className="sm:hidden">
                <div className="text-lg font-bold text-gray-900">{price}</div>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                {/* Phone */}
                <a
                  href="tel:7377274889"
                  className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="hidden sm:inline">Call</span>
                </a>

                {/* Request Info */}
                <button
                  onClick={() => openModal('info')}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="hidden sm:inline">Request Info</span>
                </button>

                {/* Schedule Showing - Primary CTA */}
                <button
                  onClick={() => openModal('showing')}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-semibold"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule Showing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        listingAddress={listingAddress}
        mlsNumber={mlsNumber}
        variant={modalVariant}
        title={modalVariant === 'showing' ? 'Schedule a Showing' : 'Request Information'}
      />
    </>
  );
}

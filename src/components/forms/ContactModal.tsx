'use client';

import { useEffect } from 'react';
import LeadCaptureForm from './LeadCaptureForm';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingAddress?: string;
  mlsNumber?: string;
  communityName?: string;
  variant?: 'contact' | 'showing' | 'info';
  title?: string;
}

export default function ContactModal({
  isOpen,
  onClose,
  listingAddress,
  mlsNumber,
  communityName,
  variant = 'contact',
  title
}: ContactModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const defaultTitle = variant === 'showing' 
    ? 'Schedule a Showing' 
    : 'Contact an Agent';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title || defaultTitle}</h2>
            {listingAddress && (
              <p className="text-sm text-gray-500 mt-0.5">{listingAddress}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Quick Contact */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Prefer to talk?</p>
              <a href="tel:5125809338" className="text-lg font-semibold text-red-600 hover:text-red-700">
                512-580-9338
              </a>
            </div>
            <a 
              href="tel:5125809338"
              className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
          </div>

          {/* Form */}
          <LeadCaptureForm
            listingAddress={listingAddress}
            mlsNumber={mlsNumber}
            communityName={communityName}
            variant={variant}
            onSuccess={() => {
              setTimeout(onClose, 2500);
            }}
          />
        </div>
      </div>
    </div>
  );
}

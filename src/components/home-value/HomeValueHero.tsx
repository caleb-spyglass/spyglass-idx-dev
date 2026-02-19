'use client';

import { useState } from 'react';
import { PropertyData } from './HomeValueFlow';

interface HomeValueHeroProps {
  onAddressSubmit: (data: PropertyData) => void;
}

export function HomeValueHero({ onAddressSubmit }: HomeValueHeroProps) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    
    // Parse basic address info (this could be enhanced with Google Places API later)
    const parseAddress = (addr: string): PropertyData => {
      const parts = addr.split(',');
      const streetPart = parts[0]?.trim() || addr;
      const cityStatePart = parts[1]?.trim() || '';
      const zipPart = parts[2]?.trim() || '';
      
      // Extract zip code (5 digits)
      const zipMatch = (zipPart || cityStatePart).match(/\b\d{5}\b/);
      const zip = zipMatch ? zipMatch[0] : '';
      
      // Extract state (TX or Texas)
      const stateMatch = (cityStatePart + ' ' + zipPart).match(/\b(TX|Texas|tx|texas)\b/i);
      const state = stateMatch ? 'TX' : '';
      
      // Extract city (everything before state/zip)
      let city = cityStatePart;
      if (stateMatch) {
        city = cityStatePart.replace(/\b(TX|Texas|tx|texas)\b/i, '').trim();
      }
      if (zipMatch && cityStatePart.includes(zip)) {
        city = city.replace(zip, '').trim();
      }
      
      return {
        address: streetPart,
        city: city || 'Austin',
        state: state || 'TX',
        zip,
      };
    };

    const propertyData = parseAddress(address);
    
    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onAddressSubmit(propertyData);
    setLoading(false);
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-spyglass-dark to-spyglass-charcoal text-white py-32 md:py-40">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          {/* Trust signals */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-8 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span>4.9/5 Rating</span>
            </div>
            <div className="h-4 w-px bg-gray-400"></div>
            <span>1,247+ Agents</span>
            <div className="h-4 w-px bg-gray-400"></div>
            <span>Free · Instant · No Obligation</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            What's Your{' '}
            <span className="text-spyglass-orange">Home Worth?</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Get an accurate estimate in under 2 minutes. No registration required.
          </p>

          {/* Address Input Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl">
              <div className="mb-6">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your home address (e.g., 123 Main St, Austin, TX 78701)"
                  className="w-full px-6 py-4 text-lg text-gray-900 border-2 border-gray-200 rounded-xl focus:border-spyglass-orange focus:outline-none transition-colors"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading || !address.trim()}
                className="w-full bg-spyglass-orange hover:bg-spyglass-orange-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-lg font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Finding Your Property...
                  </div>
                ) : (
                  'Get My Home Value'
                )}
              </button>
            </div>
          </form>

          {/* Additional Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>MLS Data Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>100% Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>Updated Daily</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-spyglass-orange">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enter Your Address</h3>
              <p className="text-gray-600">We'll find your property and show you basic details for confirmation.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-spyglass-orange">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Instant Estimate</h3>
              <p className="text-gray-600">Receive your home's value range immediately, based on recent sales data.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-spyglass-orange">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Refine & Get Report</h3>
              <p className="text-gray-600">Answer a few questions to get a detailed analysis with comparable sales.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
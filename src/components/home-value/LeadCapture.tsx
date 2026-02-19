'use client';

import { useState } from 'react';
import { PropertyData, EstimateData, QualificationData, ContactData } from './HomeValueFlow';

interface LeadCaptureProps {
  propertyData: PropertyData;
  estimateData: EstimateData;
  qualificationData: QualificationData;
  onComplete: (contactData: ContactData) => void;
}

export function LeadCapture({ propertyData, estimateData, qualificationData, onComplete }: LeadCaptureProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', phone: '' });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate adjusted estimate based on condition
  const conditionMultipliers = {
    'excellent': 1.05,
    'good': 1.0,
    'fair': 0.95,
    'needs-work': 0.85
  };

  const multiplier = qualificationData.condition ? conditionMultipliers[qualificationData.condition] : 1.0;
  const adjustedEstimate = {
    low: Math.round(estimateData.lowEstimate * multiplier),
    high: Math.round(estimateData.highEstimate * multiplier)
  };

  const validateForm = () => {
    const newErrors = { email: '', phone: '' };
    let isValid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Phone validation (optional but if provided, should be valid)
    if (phone.trim()) {
      const phoneRegex = /^[\+]?[1]?[\-\.\s]?\(?[0-9]{3}\)?[\-\.\s]?[0-9]{3}[\-\.\s]?[0-9]{4}$/;
      if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Submit lead to API
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Home Valuation User', // We'll collect name in a future version
          email,
          phone,
          message: `Home Valuation Request
Property: ${propertyData.address}, ${propertyData.city}, ${propertyData.state} ${propertyData.zip}
Estimated Value: ${formatPrice(adjustedEstimate.low)} - ${formatPrice(adjustedEstimate.high)}
Condition: ${qualificationData.condition}
Timeline: ${qualificationData.timeline}`,
          formType: 'home_valuation',
          listingAddress: `${propertyData.address}, ${propertyData.city}, ${propertyData.state} ${propertyData.zip}`,
          source: 'spyglass-idx-home-value',
        }),
      });

      if (response.ok) {
        onComplete({ email, phone });
      } else {
        // Still proceed to show the report even if lead capture fails
        onComplete({ email, phone });
      }
    } catch (error) {
      console.error('Lead submission error:', error);
      // Still proceed to show the report
      onComplete({ email, phone });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-spyglass-orange/10 to-spyglass-charcoal/10 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Celebration Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full mb-4 text-2xl">
            🎉
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Complete Home Analysis is Ready!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We've prepared a detailed report with comparable sales, market insights, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Report Preview */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              What's Included in Your Report
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Detailed Property Valuation</h3>
                  <p className="text-gray-600 text-sm">Refined estimate: {formatPrice(adjustedEstimate.low)} - {formatPrice(adjustedEstimate.high)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Comparable Sales Analysis</h3>
                  <p className="text-gray-600 text-sm">3-5 recent sales in your neighborhood with details</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Market Trends & Insights</h3>
                  <p className="text-gray-600 text-sm">Price trends, inventory levels, and market forecasts</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Neighborhood Statistics</h3>
                  <p className="text-gray-600 text-sm">Days on market, price per sq ft, and local activity</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Selling Cost Breakdown</h3>
                  <p className="text-gray-600 text-sm">Estimate of fees, commissions, and net proceeds</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-spyglass-orange/5 border border-spyglass-orange/20 rounded-lg">
              <div className="flex items-center gap-2 text-spyglass-orange font-medium mb-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Bonus: Free Agent Consultation
              </div>
              <p className="text-gray-600 text-sm">
                Get personalized advice from a Spyglass Realty expert about your property and the local market.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Where should we send your free report?
            </h2>
            <p className="text-gray-600 mb-6">
              Your complete analysis will be delivered instantly to your email.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="your@email.com"
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent transition-colors ${
                    errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="(512) 555-0123"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  For quick questions about your report (optional)
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-spyglass-orange hover:bg-spyglass-orange-hover disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Preparing Your Report...
                  </div>
                ) : (
                  'Get My Free Report'
                )}
              </button>

              <div className="text-center text-sm text-gray-500">
                <p>
                  🔒 Your information is secure and will never be shared.
                  <br />
                  No spam, unsubscribe anytime.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
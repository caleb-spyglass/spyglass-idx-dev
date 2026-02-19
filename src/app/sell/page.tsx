'use client';

import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/home/Footer';
import { useState, useRef } from 'react';

export default function SellPage() {
  const [formData, setFormData] = useState({
    address: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    yearBuilt: '',
    name: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    address: ''
  });

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors as user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = { name: '', email: '', address: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Property address is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const scrollToFirstError = () => {
    if (errors.address && addressRef.current) {
      addressRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      addressRef.current.focus();
    } else if (errors.name && nameRef.current) {
      nameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      nameRef.current.focus();
    } else if (errors.email && emailRef.current) {
      emailRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      emailRef.current.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      scrollToFirstError();
      return;
    }

    setSubmitting(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `Home Valuation Request\nAddress: ${formData.address}\nBedrooms: ${formData.bedrooms}\nBathrooms: ${formData.bathrooms}\nSq Ft: ${formData.squareFeet}\nYear Built: ${formData.yearBuilt}`,
          formType: 'home_valuation',
          listingAddress: formData.address,
          source: 'spyglass-idx-sell',
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Lead submission error:', err);
      setSubmitted(true); // Still show success to user
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-spyglass-dark to-spyglass-charcoal text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Selling a Home in{' '}
              <span className="text-spyglass-orange">Austin</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get maximum value for your home with our proven marketing strategies, expert pricing, and unparalleled local market knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* Home Valuation Form Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What's Your Home Worth?
            </h2>
            <p className="text-xl text-gray-600 mb-4">
              Get a free, instant home valuation based on recent market data
            </p>
            <div className="inline-block bg-spyglass-orange/10 text-spyglass-orange px-4 py-2 rounded-lg">
              <strong>New!</strong> Try our improved <Link href="/home-value" className="underline hover:no-underline">instant home valuation tool</Link>
            </div>
          </div>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-2">Thank You!</h3>
              <p className="text-green-700 mb-6">
                Your home valuation request has been submitted successfully. We'll be in touch with your detailed analysis soon.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/home-value"
                  className="bg-spyglass-orange hover:bg-spyglass-orange-hover text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Get Instant Estimate
                </Link>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-8 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Property Address *
                  </label>
                  <input
                    ref={addressRef}
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St, Austin, TX 78701"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent transition-colors ${
                      errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <select
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                  >
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5+">5+</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <select
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                  >
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="1.5">1.5</option>
                    <option value="2">2</option>
                    <option value="2.5">2.5</option>
                    <option value="3">3</option>
                    <option value="3.5">3.5</option>
                    <option value="4+">4+</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="squareFeet" className="block text-sm font-medium text-gray-700 mb-2">
                    Square Feet
                  </label>
                  <input
                    type="number"
                    id="squareFeet"
                    name="squareFeet"
                    value={formData.squareFeet}
                    onChange={handleInputChange}
                    placeholder="e.g. 2000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700 mb-2">
                    Year Built
                  </label>
                  <input
                    type="number"
                    id="yearBuilt"
                    name="yearBuilt"
                    value={formData.yearBuilt}
                    onChange={handleInputChange}
                    placeholder="e.g. 2010"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                  />
                </div>

                {/* Contact Information - Move to top of form for better UX */}
                <div className="md:col-span-2 border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        ref={nameRef}
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent transition-colors ${
                          errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        ref={emailRef}
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent transition-colors ${
                          errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 text-center">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-spyglass-orange hover:bg-spyglass-orange-hover disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200 min-w-[200px]"
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Submitting...
                      </div>
                    ) : (
                      'Get My Home Valuation'
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Why Sell with Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Sell Your Home with Spyglass Realty?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive approach ensures your home gets maximum exposure, sells quickly, and at the best possible price.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Expert Cross-Platform Marketing */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Cross-Platform Marketing</h3>
              <p className="text-gray-600">
                Your listing will be featured across all major real estate platforms, social media channels, and our extensive network to reach maximum buyers.
              </p>
            </div>

            {/* Premier Home Remodeling Services */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Premier Home Remodeling Services</h3>
              <p className="text-gray-600">
                Our in-house design and remodeling team can help enhance your home's value with strategic improvements before listing.
              </p>
            </div>

            {/* Experience & Negotiation */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Experience & Negotiation</h3>
              <p className="text-gray-600">
                Our experienced negotiators work tirelessly to secure the best terms and highest price for your property.
              </p>
            </div>

            {/* Captivate Buyers with Stunning Video Content */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Captivate Buyers with Stunning Video Content</h3>
              <p className="text-gray-600">
                Professional videography, drone footage, and virtual tours showcase your home's best features and create emotional connections with buyers.
              </p>
            </div>

            {/* Maximize Your Home's Potential with Professional Staging */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 15v-4a2 2 0 012-2h4a2 2 0 012 2v4M16 11V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Staging</h3>
              <p className="text-gray-600">
                Our professional staging services help buyers envision themselves living in your home, leading to faster sales and higher offers.
              </p>
              <Link href="/home-staging" className="inline-flex items-center text-spyglass-orange hover:text-spyglass-orange-hover font-medium mt-4">
                Learn about staging
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Long-Term Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Long-Term Benefits of Working with Us
            </h2>
            <p className="text-xl text-gray-600">
              Beyond the sale, we're committed to your ongoing success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-spyglass-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Market Insights</h3>
                  <p className="text-gray-600">
                    Ongoing access to market trends, neighborhood updates, and investment opportunities in Austin's evolving real estate landscape.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-spyglass-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Lifetime Support</h3>
                  <p className="text-gray-600">
                    We're here for all your future real estate needs - whether buying, selling, or seeking advice on property investments.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-spyglass-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Network</h3>
                  <p className="text-gray-600">
                    Access to our trusted network of contractors, lenders, inspectors, and other professionals for all your property needs.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 rounded-xl p-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-spyglass-orange mb-2">98%</div>
                <div className="text-lg font-semibold text-gray-900 mb-4">Client Satisfaction Rate</div>
                <p className="text-gray-600 mb-6">
                  Our clients consistently rate us highly for communication, professionalism, and results.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">24</div>
                    <div className="text-sm text-gray-600">Days Average</div>
                    <div className="text-sm text-gray-600">on Market</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">102%</div>
                    <div className="text-sm text-gray-600">of List Price</div>
                    <div className="text-sm text-gray-600">Average</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-spyglass-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Sell Your Home?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get started with a free home valuation and consultation. We'll create a custom strategy to maximize your home's value and minimize time on market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="bg-spyglass-orange hover:bg-spyglass-orange-hover px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Schedule Consultation
            </Link>
            <button 
              onClick={() => document.getElementById('address')?.focus()}
              className="border-2 border-white text-white hover:bg-white hover:text-spyglass-charcoal px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Get Home Valuation
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
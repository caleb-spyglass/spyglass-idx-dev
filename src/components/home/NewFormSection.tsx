'use client';

import { useState } from 'react';

export function NewFormSection() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'homepage-cta' }),
      });
    } catch {}
    setSubmitted(true);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Copy */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to make your move?
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Connect with Austin&apos;s most trusted real estate experts. We&apos;re here 
              to help you navigate the Austin market with confidence — whether you&apos;re 
              buying, selling, or just exploring your options.
            </p>
          </div>

          {/* Right - Form */}
          <div className="bg-gray-50 p-8 rounded-2xl">
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Thank you!</h3>
                <p className="text-gray-600">We&apos;ll be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-spyglass-orange/50 focus:border-spyglass-orange text-gray-900"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email or Phone"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-spyglass-orange/50 focus:border-spyglass-orange text-gray-900"
                    required
                  />
                </div>
                <textarea
                  placeholder="Tell us how we can help! (optional)"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-spyglass-orange/50 focus:border-spyglass-orange text-gray-900 resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-spyglass-orange hover:bg-spyglass-orange-hover text-white font-semibold rounded-lg transition-colors text-lg"
                >
                  Get Started
                </button>
                <p className="text-xs text-gray-400 text-center">
                  By submitting, you agree to our terms of service.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

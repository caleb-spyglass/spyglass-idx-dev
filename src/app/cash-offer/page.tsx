import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/home/Footer';

export default function CashOfferPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-spyglass-dark to-spyglass-charcoal text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Cash Offer <span className="text-spyglass-orange">Trade In</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Buy your new home before selling your current one. Get a competitive cash offer on your existing home to strengthen your buying power.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Cash Offer Trade In Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our Cash Offer Trade In program eliminates the stress of timing your home sale and purchase
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-spyglass-orange text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Your Cash Offer</h3>
              <p className="text-gray-600">
                We provide a competitive cash offer on your current home within 48 hours, based on current market conditions and recent sales data.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-spyglass-orange text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Shop with Confidence</h3>
              <p className="text-gray-600">
                Make offers on your dream home knowing you have the financial backing to close quickly and compete with all-cash buyers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-spyglass-orange text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Close on Your Terms</h3>
              <p className="text-gray-600">
                We handle both transactions seamlessly, allowing you to move directly from your old home to your new one without double moves or temporary housing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Benefits of Cash Offer Trade In
            </h2>
            <p className="text-xl text-gray-600">
              Advantages that give you a competitive edge in today's market
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-spyglass-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No Contingencies</h3>
                  <p className="text-gray-600">
                    Make offers without sale contingencies, making your offer more attractive to sellers in competitive markets.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-spyglass-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast Closings</h3>
                  <p className="text-gray-600">
                    Close on your new home in as little as 2 weeks, giving you a significant advantage over traditional financing buyers.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-spyglass-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No Double Moves</h3>
                  <p className="text-gray-600">
                    Avoid the expense and hassle of temporary housing or storage by coordinating both transactions seamlessly.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-spyglass-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Competitive Offers</h3>
                  <p className="text-gray-600">
                    Our cash offers are based on current market value, ensuring you receive fair value for your current home.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-spyglass-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 15v-4a2 2 0 012-2h4a2 2 0 012 2v4M16 11V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No Repairs Needed</h3>
                  <p className="text-gray-600">
                    We buy your home as-is, eliminating the need for costly repairs or improvements before selling.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-spyglass-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Guidance</h3>
                  <p className="text-gray-600">
                    Our experienced team manages both transactions, ensuring nothing falls through the cracks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                Is Cash Offer Trade In Right for You?
              </h2>
              <p className="text-lg text-gray-600">
                Our Cash Offer Trade In program is ideal for homeowners who want to upgrade or relocate without the stress of timing two separate transactions.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-spyglass-orange rounded-full"></div>
                  <span className="text-gray-700">Homeowners looking to upgrade to a larger home</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-spyglass-orange rounded-full"></div>
                  <span className="text-gray-700">Families relocating for work or lifestyle</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-spyglass-orange rounded-full"></div>
                  <span className="text-gray-700">Empty nesters downsizing to a different area</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-spyglass-orange rounded-full"></div>
                  <span className="text-gray-700">Investors looking to 1031 exchange</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-spyglass-orange rounded-full"></div>
                  <span className="text-gray-700">Anyone wanting to avoid double moves and storage</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-300 rounded-xl aspect-[4/3] flex items-center justify-center">
              <span className="text-gray-500">Cash Offer Process Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about our Cash Offer Trade In program
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How is the cash offer price determined?</h3>
              <p className="text-gray-600">
                Our cash offer is based on a comprehensive market analysis using recent comparable sales, current market conditions, and the property's condition. We aim to provide a fair, competitive offer that reflects true market value.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What are the fees associated with this program?</h3>
              <p className="text-gray-600">
                Our program includes a service fee that covers the convenience and risk we take on your behalf. All fees are clearly disclosed upfront with no hidden costs. The fee is often offset by the savings from not needing temporary housing or storage.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How quickly can I get a cash offer?</h3>
              <p className="text-gray-600">
                We can provide a preliminary cash offer within 24-48 hours after reviewing your property details. A formal offer is typically available within a week after a property assessment.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Can I still list my home traditionally if I don't like the cash offer?</h3>
              <p className="text-gray-600">
                Absolutely! There's no obligation to accept our cash offer. You can choose to list your home on the open market instead. We'll work with you to determine the best strategy for your situation.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What types of properties are eligible?</h3>
              <p className="text-gray-600">
                We consider single-family homes, townhomes, and condos in the greater Austin area. Properties should be in reasonable condition and located in areas with good market demand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-spyglass-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get your free cash offer today and discover how our Trade In program can simplify your next move.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="bg-spyglass-orange hover:bg-spyglass-orange-hover px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Get My Cash Offer
            </Link>
            <Link 
              href="/sell"
              className="border-2 border-white text-white hover:bg-white hover:text-spyglass-charcoal px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Learn About Selling
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
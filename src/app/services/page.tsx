import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/home/Footer';

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-spyglass-dark to-spyglass-charcoal text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Why Choose{' '}
              <span className="text-spyglass-orange">Spyglass Realty</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive real estate services backed by cutting-edge technology, exceptional design, and unwavering commitment to your success.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Oriented */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-spyglass-orange/20">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Service Oriented</h3>
              <p className="text-gray-600">
                Our client-first philosophy ensures every decision we make is in your best interest. From the first consultation to closing day and beyond, we're dedicated to exceeding your expectations.
              </p>
            </div>

            {/* Experienced */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-spyglass-orange/20">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Experienced</h3>
              <p className="text-gray-600">
                Years of Austin market expertise translate into confident navigation of complex transactions, market timing, and strategic pricing that delivers results.
              </p>
            </div>

            {/* Design and Remodel */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-spyglass-orange/20">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Design and Remodel</h3>
              <p className="text-gray-600">
                Our in-house design team helps maximize your property's value with strategic improvements, modern updates, and stunning transformations that attract buyers.
              </p>
            </div>

            {/* Professional Staging */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-spyglass-orange/20">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 15v-4a2 2 0 012-2h4a2 2 0 012 2v4M16 11V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Staging</h3>
              <p className="text-gray-600">
                Transform your space to highlight its best features and help buyers envision their future home. Professional staging leads to faster sales and higher offers.
              </p>
              <Link href="/home-staging" className="inline-flex items-center text-spyglass-orange hover:text-spyglass-orange-hover font-medium mt-4">
                Learn more
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Negotiating Tactics */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-spyglass-orange/20">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Negotiating Tactics</h3>
              <p className="text-gray-600">
                Strategic negotiation skills honed through hundreds of successful transactions ensure you get the best terms, whether buying or selling.
              </p>
            </div>

            {/* Digital Marketing */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-spyglass-orange/20">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Digital Marketing</h3>
              <p className="text-gray-600">
                Comprehensive digital marketing strategies including social media campaigns, targeted online advertising, and premium listing placements across all major platforms.
              </p>
            </div>

            {/* Video Marketing */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-spyglass-orange/20">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Video Marketing</h3>
              <p className="text-gray-600">
                Professional video tours, drone footage, and cinematic property showcases that captivate buyers and create emotional connections with your listing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Sections */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Selling a Home in Austin */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Selling a Home in Austin</h2>
              <p className="text-gray-600 mb-8">
                Our comprehensive selling process is designed to maximize your home's value and minimize time on market through strategic pricing, professional marketing, and expert negotiation.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-spyglass-orange rounded-full"></div>
                  <span className="text-gray-700">Comprehensive Market Analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-spyglass-orange rounded-full"></div>
                  <span className="text-gray-700">Professional Photography & Video</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-spyglass-orange rounded-full"></div>
                  <span className="text-gray-700">Strategic Home Staging</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-spyglass-orange rounded-full"></div>
                  <span className="text-gray-700">Multi-Platform Marketing Campaign</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-spyglass-orange rounded-full"></div>
                  <span className="text-gray-700">Expert Negotiation & Closing Support</span>
                </div>
              </div>
              <Link 
                href="/sell"
                className="inline-flex items-center bg-spyglass-orange text-white px-6 py-3 rounded-lg hover:bg-spyglass-orange-hover transition-colors font-medium mt-8"
              >
                Start Selling
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Buying a Home in Austin */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Buying a Home in Austin</h2>
              <p className="text-gray-600 mb-8">
                Navigate Austin's competitive market with confidence. Our buyer services provide expert guidance, market insights, and negotiation skills to secure your dream home.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-spyglass-orange rounded-full"></div>
                  <span className="text-gray-700">Personalized Home Search Strategy</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-spyglass-orange rounded-full"></div>
                  <span className="text-gray-700">Neighborhood & Market Analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-spyglass-orange rounded-full"></div>
                  <span className="text-gray-700">Private Showings & Tours</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-spyglass-orange rounded-full"></div>
                  <span className="text-gray-700">Competitive Offer Strategy</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-spyglass-orange rounded-full"></div>
                  <span className="text-gray-700">Inspection & Closing Coordination</span>
                </div>
              </div>
              <Link 
                href="/buy"
                className="inline-flex items-center bg-spyglass-orange text-white px-6 py-3 rounded-lg hover:bg-spyglass-orange-hover transition-colors font-medium mt-8"
              >
                Start Buying
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the experienced professionals dedicated to your real estate success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ryan Rodenbeck</h3>
              <p className="text-spyglass-orange font-medium mb-4">Principal Broker</p>
              <p className="text-gray-600 text-sm">
                Austin market expert with over a decade of experience helping clients achieve their real estate goals.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Mitchell</h3>
              <p className="text-spyglass-orange font-medium mb-4">Senior Agent</p>
              <p className="text-gray-600 text-sm">
                Specializes in luxury properties and new construction throughout Austin's premier neighborhoods.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">David Thompson</h3>
              <p className="text-spyglass-orange font-medium mb-4">Buyer Specialist</p>
              <p className="text-gray-600 text-sm">
                First-time homebuyer expert helping Austin families find their perfect home within budget.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/team"
              className="inline-flex items-center text-spyglass-orange hover:text-spyglass-orange-hover font-medium text-lg"
            >
              Meet the Full Team
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Client Testimonials</h2>
            <p className="text-xl text-gray-600">
              Hear what our clients have to say about their experience
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
                "Exceptional service from start to finish. Their marketing strategy got us multiple offers above asking price."
              </p>
              <div className="text-gray-900 font-semibold">Jennifer & Mark Stevens</div>
              <div className="text-gray-500 text-sm">Sold in Zilker</div>
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
                "Professional staging and photography made all the difference. Our home looked incredible online and sold quickly."
              </p>
              <div className="text-gray-900 font-semibold">Carlos Rodriguez</div>
              <div className="text-gray-500 text-sm">Sold in East Austin</div>
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
                "Their technology and AI search tools helped us find exactly what we were looking for in our ideal neighborhood."
              </p>
              <div className="text-gray-900 font-semibold">Lisa & Tom Chen</div>
              <div className="text-gray-500 text-sm">Bought in Mueller</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-spyglass-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Experience the Difference?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let us put our comprehensive services to work for you. Contact us today for a free consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="bg-spyglass-orange hover:bg-spyglass-orange-hover px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Schedule Consultation
            </Link>
            <Link 
              href="/about"
              className="border-2 border-white text-white hover:bg-white hover:text-spyglass-charcoal px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Learn About Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
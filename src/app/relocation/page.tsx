import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/home/Footer';

export default function RelocationPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-spyglass-dark to-spyglass-charcoal text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="text-spyglass-orange">Relocation</span> Services
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Moving to Austin? Let our comprehensive relocation services make your transition smooth, stress-free, and successful.
            </p>
          </div>
        </div>
      </section>

      {/* Welcome to Austin Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                Welcome to Austin, Texas
              </h2>
              <p className="text-lg text-gray-600">
                Austin is one of the fastest-growing cities in America, attracting professionals, families, and retirees with its unique blend of culture, technology, and natural beauty. From the vibrant downtown scene to peaceful Hill Country neighborhoods, Austin offers something for everyone.
              </p>
              <p className="text-lg text-gray-600">
                Our relocation specialists understand the challenges of moving to a new city. We're here to guide you through every step of the process, from neighborhood selection to school districts to finding the perfect home.
              </p>
            </div>
            <div className="bg-gray-300 rounded-xl aspect-[4/3] flex items-center justify-center">
              <span className="text-gray-500">Austin Skyline Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* Relocation Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Complete Relocation Support
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We handle all aspects of your move to Austin, making your transition as seamless as possible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Neighborhood Tours */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Virtual & In-Person Neighborhood Tours</h3>
              <p className="text-gray-600">
                Explore Austin's diverse neighborhoods through virtual tours and guided in-person visits to find the perfect area for your lifestyle and budget.
              </p>
            </div>

            {/* School District Information */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">School District Research</h3>
              <p className="text-gray-600">
                Comprehensive information about Austin ISD and surrounding school districts, including ratings, programs, and enrollment assistance for families with children.
              </p>
            </div>

            {/* Cost of Living Analysis */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cost of Living Analysis</h3>
              <p className="text-gray-600">
                Detailed comparison of living costs between Austin and your current city, covering housing, utilities, transportation, and lifestyle expenses.
              </p>
            </div>

            {/* Corporate Relocation */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Corporate Relocation Partners</h3>
              <p className="text-gray-600">
                Direct coordination with HR departments and relocation companies to streamline the process and maximize your relocation benefits.
              </p>
            </div>

            {/* Temporary Housing */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 15v-4a2 2 0 012-2h4a2 2 0 012 2v4M16 11V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Temporary Housing Solutions</h3>
              <p className="text-gray-600">
                Assistance finding short-term rentals, extended stay hotels, and corporate housing while you search for your permanent home.
              </p>
            </div>

            {/* Local Resources */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Local Resources & Connections</h3>
              <p className="text-gray-600">
                Connections to local services including utilities setup, internet providers, healthcare, veterinarians, and community organizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Austin */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Austin?
            </h2>
            <p className="text-xl text-gray-600">
              Discover what makes Austin one of America's most desirable cities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation Hub</h3>
              <p className="text-gray-600 text-sm">
                Home to major tech companies and startups, Austin offers abundant career opportunities in technology and beyond.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Music Capital</h3>
              <p className="text-gray-600 text-sm">
                World-famous music scene with SXSW, ACL Festival, and live music venues throughout the city.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Year-Round Sunshine</h3>
              <p className="text-gray-600 text-sm">
                300+ days of sunshine annually with mild winters perfect for outdoor activities and recreation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Diverse Communities</h3>
              <p className="text-gray-600 text-sm">
                Welcoming neighborhoods from downtown lofts to suburban family communities to Hill Country retreats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Relocation Process
            </h2>
            <p className="text-xl text-gray-600">
              A step-by-step approach to make your move seamless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-spyglass-orange text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Discovery Call</h3>
              <p className="text-gray-600 text-sm">
                Initial consultation to understand your needs, timeline, and preferences for your Austin move.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-spyglass-orange text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Area Research</h3>
              <p className="text-gray-600 text-sm">
                Detailed neighborhood analysis and virtual tours to identify the best areas for your lifestyle.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-spyglass-orange text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">House Hunting</h3>
              <p className="text-gray-600 text-sm">
                Guided home search with virtual and in-person showings tailored to your specific criteria.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-spyglass-orange text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Settlement Support</h3>
              <p className="text-gray-600 text-sm">
                Post-move assistance with local connections, utilities, and getting settled in your new Austin home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-spyglass-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Make Austin Home?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let our relocation specialists guide you through every step of your move to Austin. Schedule your free consultation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="bg-spyglass-orange hover:bg-spyglass-orange-hover px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Schedule Consultation
            </Link>
            <Link 
              href="/buy"
              className="border-2 border-white text-white hover:bg-white hover:text-spyglass-charcoal px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Start Home Search
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
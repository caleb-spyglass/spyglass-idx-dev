import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/home/Footer';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-spyglass-dark to-spyglass-charcoal text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Let Us Show You What We Are{' '}
                <span className="text-spyglass-orange">All About</span>
              </h1>
              <p className="text-xl text-gray-300">
                At Spyglass Realty, we're more than just real estate agents – we're your partners in making one of life's biggest decisions with confidence and success.
              </p>
            </div>
            <div className="flex-1">
              {/* Team Photo Placeholder */}
              <div className="bg-gray-300/20 rounded-xl aspect-[4/3] flex items-center justify-center">
                <span className="text-gray-300">Team Photo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Review Badges Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
            {/* Google Reviews */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-2xl font-bold text-gray-900">5.0</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="text-gray-600 font-medium">Google Reviews</div>
            </div>

            {/* Zillow Reviews */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.836 2.007L12 1.5l-.836.507L3 7.5v13h5v-7h8v7h5v-13l-8.164-5.493zm0 0L21 7.5V8h-2.5V6.25L12.836 2.007z"/>
                </svg>
                <span className="text-2xl font-bold text-gray-900">5.0</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="text-gray-600 font-medium">Zillow Reviews</div>
            </div>

            {/* Facebook Reviews */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-2xl font-bold text-gray-900">5.0</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="text-gray-600 font-medium">Facebook Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Alternating Content Sections */}
      
      {/* Our Clients Come First */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gray-300 rounded-xl aspect-[4/3] flex items-center justify-center">
                <span className="text-gray-500">Image: Client Meeting</span>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                Our Clients Come First. Always.
              </h2>
              <p className="text-lg text-gray-600">
                Every decision we make is guided by what's best for our clients. From our initial consultation to years after closing, we maintain relationships built on trust, transparency, and unwavering commitment to your success.
              </p>
              <p className="text-lg text-gray-600">
                We believe that real estate is about people, not just properties. That's why we take the time to understand your unique needs, timeline, and goals before crafting a personalized strategy that delivers results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* We Strive to be Cutting Edge */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                We Strive to be Cutting Edge
              </h2>
              <p className="text-lg text-gray-600">
                Technology isn't just a tool for us – it's a competitive advantage we leverage to give our clients the best possible experience. From AI-powered search capabilities to virtual reality tours, we embrace innovation.
              </p>
              <p className="text-lg text-gray-600">
                Our cutting-edge marketing strategies, including professional video production, drone photography, and targeted digital campaigns, ensure your property gets maximum exposure in today's competitive market.
              </p>
            </div>
            <div>
              <div className="bg-gray-300 rounded-xl aspect-[4/3] flex items-center justify-center">
                <span className="text-gray-500">Image: Technology/Innovation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* We Learn From the Best */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gray-300 rounded-xl aspect-[4/3] flex items-center justify-center">
                <span className="text-gray-500">Image: Education/Training</span>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                We Learn From the Best
              </h2>
              <p className="text-lg text-gray-600">
                Our commitment to excellence drives us to continuously learn from industry leaders, attend premium training programs, and stay ahead of market trends. We invest in our education so we can invest in your success.
              </p>
              <p className="text-lg text-gray-600">
                By maintaining relationships with top agents nationwide and participating in exclusive mastermind groups, we bring global best practices to Austin's local market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* We Invest in Better Technology for You */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                We Invest in Better Technology for You
              </h2>
              <p className="text-lg text-gray-600">
                From our custom-built IDX platform with AI search capabilities to professional-grade photography equipment and marketing tools, we spare no expense in providing you with the most advanced real estate technology available.
              </p>
              <p className="text-lg text-gray-600">
                Our investment in premium technology platforms, CRM systems, and marketing automation ensures you receive timely communications, accurate data, and seamless transactions from start to finish.
              </p>
            </div>
            <div>
              <div className="bg-gray-300 rounded-xl aspect-[4/3] flex items-center justify-center">
                <span className="text-gray-500">Image: Technology Investment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-spyglass-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              These principles guide everything we do and shape how we serve our clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Our Education Into Our Craft is Ongoing */}
            <div className="text-center">
              <div className="w-16 h-16 bg-spyglass-orange/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Our Education Into Our Craft is Ongoing</h3>
              <p className="text-gray-300">
                We never stop learning. Continuous education in market trends, technology, and sales strategies ensures we provide cutting-edge service to every client.
              </p>
            </div>

            {/* Presentation is Essential */}
            <div className="text-center">
              <div className="w-16 h-16 bg-spyglass-orange/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Presentation is Essential</h3>
              <p className="text-gray-300">
                First impressions matter. From professional photography to staging to personal appearance, we ensure everything reflects the quality and professionalism our clients deserve.
              </p>
            </div>

            {/* Design is Paramount */}
            <div className="text-center">
              <div className="w-16 h-16 bg-spyglass-orange/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-spyglass-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2-2-2M21 12H9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Design is Paramount</h3>
              <p className="text-gray-300">
                Beautiful, functional design in everything we create – from marketing materials to home staging to digital platforms – creates emotional connections that drive results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600">
              Real stories from real clients who chose Spyglass Realty
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
                "Working with Spyglass Realty was the best decision we made. Their technology made searching so much easier, and their expertise made negotiating stress-free."
              </p>
              <div className="text-gray-900 font-semibold">Michael & Sarah Johnson</div>
              <div className="text-gray-500 text-sm">Bought in Travis Heights</div>
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
                "The attention to detail in their marketing was incredible. Professional photos, staging, and video tours helped our home sell in just 5 days!"
              </p>
              <div className="text-gray-900 font-semibold">Amanda Rodriguez</div>
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
                "Their client-first approach really showed. They were available whenever we had questions and always had our best interests at heart."
              </p>
              <div className="text-gray-900 font-semibold">David & Lisa Chen</div>
              <div className="text-gray-500 text-sm">Bought & Sold with Spyglass</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Work Together?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Experience the Spyglass Realty difference for yourself. Let's start with a conversation about your real estate goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="bg-spyglass-orange hover:bg-spyglass-orange-hover text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Schedule Consultation
            </Link>
            <Link 
              href="/team"
              className="border-2 border-spyglass-orange text-spyglass-orange hover:bg-spyglass-orange hover:text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Meet Our Team
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
import Link from 'next/link';

export function BuyerSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-1">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Happy family in front of their new home"
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-spyglass-orange/20 to-transparent rounded-xl"></div>
            </div>
          </div>

          {/* Content */}
          <div className="order-2">
            {/* Label */}
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-spyglass-orange/10 text-spyglass-orange text-sm font-semibold uppercase tracking-wider rounded-full">
                I AM A BUYER
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Are You Looking to Buy a Home in Austin?
            </h2>

            {/* Body Text */}
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our experienced buyers' agents understand the Austin market like 
              no other. We provide comprehensive market analysis, neighborhood 
              insights, and personalized service to help you find the perfect home.
            </p>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              With our advanced AI-powered search technology and deep local 
              expertise, we'll help you navigate Austin's competitive market 
              and secure your dream home at the best possible price.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-spyglass-orange text-white font-semibold rounded-lg hover:bg-spyglass-orange-hover transition-colors"
              >
                Free Consultation
              </Link>
              <Link 
                href="/buying"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-spyglass-orange text-spyglass-orange font-semibold rounded-lg hover:bg-spyglass-orange hover:text-white transition-all"
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
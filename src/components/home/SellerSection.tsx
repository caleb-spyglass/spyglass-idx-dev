import Link from 'next/link';

export function SellerSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            {/* Label */}
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-spyglass-orange/10 text-spyglass-orange text-sm font-semibold uppercase tracking-wider rounded-full">
                I AM A SELLER
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Are You Looking to Sell a Home in Austin?
            </h2>

            {/* Body Text */}
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Spyglass is a boutique of marketing excellence with 
              expertise home selling experience throughout Austin. With over 
              6 times the volume of the average agent, we utilize advanced 
              marketing strategies, professional photography, and comprehensive 
              market analysis to get your home sold faster and for top dollar.
            </p>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our proven track record shows homes sell 23 days faster than 
              the average agent and for 3% higher sale prices. Let our award-winning 
              team help you navigate the selling process with confidence.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-spyglass-charcoal text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Free Consultation
              </Link>
              <Link 
                href="/selling"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-spyglass-orange text-spyglass-orange font-semibold rounded-lg hover:bg-spyglass-orange hover:text-white transition-all"
              >
                Read More
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Professional handshake representing successful home sale"
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-spyglass-orange/20 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
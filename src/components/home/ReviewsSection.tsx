import Link from 'next/link';

export function ReviewsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            {/* Stars */}
            <div className="flex mb-6">
              <div className="flex text-spyglass-orange">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-8 h-8 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Over 700 5-Star Reviews
            </h2>

            {/* Body Text */}
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our clients consistently rate us 5 stars across all platforms. 
              We're proud of our reputation for exceptional service, market expertise, 
              and results that exceed expectations.
            </p>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              From first-time homebuyers to luxury property investors, our clients 
              trust us to deliver outstanding results. Read what they have to say 
              about their experience working with Spyglass Realty.
            </p>

            {/* Button */}
            <Link 
              href="/reviews"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-spyglass-orange text-spyglass-orange font-semibold rounded-lg hover:bg-spyglass-orange hover:text-white transition-all"
            >
              Read More
            </Link>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Professional handshake representing successful partnership"
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-spyglass-orange/10 to-transparent rounded-xl"></div>
              
              {/* Floating Review Card */}
              <div className="absolute bottom-6 left-6 bg-white p-4 rounded-lg shadow-lg max-w-xs">
                <div className="flex text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic">
                  "Absolutely amazing experience! They went above and beyond..."
                </p>
                <p className="text-xs text-gray-500 mt-1">- Sarah M.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export function AwardsSection() {
  return (
    <section className="py-16 bg-spyglass-charcoal text-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Main Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          Multiple Award Winning Real Estate Brokerage In Austin
        </h2>

        {/* Award Logos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Leading RE Logo */}
          <div className="flex flex-col items-center">
            <div className="bg-white/10 p-6 rounded-lg mb-4 w-full max-w-xs h-24 flex items-center justify-center">
              <span className="text-2xl font-bold text-spyglass-orange">LEADING</span>
            </div>
            <p className="text-sm text-gray-300">Leading Real Estate Companies</p>
          </div>

          {/* Inc 5000 Logo */}
          <div className="flex flex-col items-center">
            <div className="bg-white/10 p-6 rounded-lg mb-4 w-full max-w-xs h-24 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-spyglass-orange">Inc.</div>
                <div className="text-lg font-semibold">5000</div>
              </div>
            </div>
            <p className="text-sm text-gray-300">Fastest Growing Companies</p>
          </div>

          {/* Austin Business Journal Logo */}
          <div className="flex flex-col items-center">
            <div className="bg-white/10 p-6 rounded-lg mb-4 w-full max-w-xs h-24 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-bold text-spyglass-orange">AUSTIN</div>
                <div className="text-sm font-semibold">BUSINESS JOURNAL</div>
              </div>
            </div>
            <p className="text-sm text-gray-300">Austin Business Journal</p>
          </div>
        </div>

        {/* Review Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Google Reviews */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-lg font-bold">5.0</span>
            </div>
            <p className="text-sm font-medium">Google Reviews</p>
            <p className="text-xs text-gray-400">Based on 700+ reviews</p>
          </div>

          {/* Zillow Reviews */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-lg font-bold">5.0</span>
            </div>
            <p className="text-sm font-medium">Zillow Reviews</p>
            <p className="text-xs text-gray-400">Premier Agent</p>
          </div>

          {/* Facebook Reviews */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-lg font-bold">5.0</span>
            </div>
            <p className="text-sm font-medium">Facebook Reviews</p>
            <p className="text-xs text-gray-400">Verified Business</p>
          </div>
        </div>
      </div>
    </section>
  );
}
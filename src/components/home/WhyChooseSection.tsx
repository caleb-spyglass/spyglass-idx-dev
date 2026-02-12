import Link from 'next/link';

export function WhyChooseSection() {
  return (
    <section className="py-16 bg-spyglass-charcoal text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Label */}
        <div className="inline-block mb-4">
          <span className="px-4 py-2 bg-spyglass-orange/20 border border-spyglass-orange/40 text-spyglass-orange text-sm font-semibold uppercase tracking-wider rounded-full">
            Why Choose Spyglass?
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Helping You Unlock the Power of Homeownership
        </h2>

        {/* Body Text */}
        <div className="max-w-3xl mx-auto mb-10">
          <p className="text-lg leading-relaxed mb-6 text-gray-300">
            At Spyglass Realty, we believe homeownership is more than just a transaction—it's 
            about finding your place in the world. Our award-winning team combines cutting-edge 
            technology with personalized service to make your real estate journey seamless.
          </p>
          
          <p className="text-lg leading-relaxed text-gray-300">
            Whether you're buying your first home or selling your tenth, we're here to guide 
            you every step of the way with expertise, integrity, and results that speak for themselves.
          </p>
        </div>

        {/* Button */}
        <Link 
          href="/about"
          className="inline-flex items-center justify-center px-8 py-3 border-2 border-spyglass-orange text-spyglass-orange font-semibold rounded-lg hover:bg-spyglass-orange hover:text-white transition-all"
        >
          Find Out More
        </Link>
      </div>
    </section>
  );
}
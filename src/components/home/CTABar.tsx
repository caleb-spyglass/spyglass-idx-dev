import Link from 'next/link';

export function CTABar() {
  return (
    <section className="py-16 bg-spyglass-orange">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
          Take The First Step to Your Real Estate Journey
        </h2>

        {/* Description */}
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          Ready to buy or sell? Our expert team is here to guide you through every step 
          of the process. Schedule your free consultation today.
        </p>

        {/* Button */}
        <Link 
          href="/contact"
          className="inline-flex items-center justify-center px-10 py-4 bg-white text-spyglass-orange font-bold text-lg rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
        >
          Start Now
        </Link>
      </div>
    </section>
  );
}
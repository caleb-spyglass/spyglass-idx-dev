import Link from 'next/link';

export function NewFormSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          We are a New Form of Realty
        </h2>

        {/* Body Text */}
        <div className="max-w-3xl mx-auto mb-10">
          <p className="text-lg leading-relaxed mb-6 text-gray-600">
            Spyglass Realty represents the evolution of real estate services. We combine 
            traditional expertise with innovative technology to create a seamless, modern 
            experience that puts our clients first.
          </p>
          
          <p className="text-lg leading-relaxed mb-6 text-gray-600">
            Our approach is built on transparency, efficiency, and results. We're not just 
            keeping up with the changing real estate landscape—we're leading it.
          </p>
          
          <p className="text-lg leading-relaxed text-gray-600">
            Experience the difference that a forward-thinking, client-focused real estate 
            brokerage can make in your property journey.
          </p>
        </div>

        {/* Button */}
        <Link 
          href="/about"
          className="inline-flex items-center justify-center px-8 py-3 bg-spyglass-orange text-white font-semibold rounded-lg hover:bg-spyglass-orange-hover transition-colors"
        >
          Find Out More
        </Link>
      </div>
    </section>
  );
}
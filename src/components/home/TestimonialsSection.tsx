'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useSiteContent } from '@/hooks/useSiteContent';

const DEFAULTS = {
  label: "Testimonials",
  heading: "What Are Our Past Customers Saying...",
  items: [
    {
      quote: "Spyglass Realty exceeded our expectations in every way. They sold our home in just 8 days above asking price and helped us find our dream home. Their market knowledge and negotiation skills are unmatched.",
      agent: "Agent Tom",
      rating: 5,
    },
    {
      quote: "Working with Spyglass was the best decision we made. They were professional, responsive, and truly cared about finding us the right home. The whole process was seamless and stress-free.",
      agent: "Agent Sarah",
      rating: 5,
    },
    {
      quote: "I've bought and sold several homes over the years, and Spyglass is by far the best real estate team I've worked with. Their attention to detail and market expertise made all the difference.",
      agent: "Agent Mike",
      rating: 5,
    },
  ],
};

export function TestimonialsSection() {
  const content = useSiteContent('testimonials', DEFAULTS);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = content.items;

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (!testimonials.length) return null;

  return (
    <section className="py-16 bg-spyglass-charcoal text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Label */}
        <div className="inline-block mb-4">
          <span className="px-4 py-2 bg-spyglass-orange/20 border border-spyglass-orange/40 text-spyglass-orange text-sm font-semibold uppercase tracking-wider rounded-full">
            {content.label}
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          {content.heading}
        </h2>

        {/* Testimonial Content */}
        <div className="relative min-h-[200px] flex items-center justify-center">
          <div className="max-w-3xl mx-auto">
            {/* Stars */}
            <div className="flex justify-center mb-6">
              <div className="flex text-yellow-400">
                {[...Array(testimonials[currentTestimonial].rating)].map((_: any, i: number) => (
                  <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Quote */}
            <blockquote className="text-xl md:text-2xl leading-relaxed mb-8 font-light italic">
              &ldquo;{testimonials[currentTestimonial].quote}&rdquo;
            </blockquote>

            {/* Agent */}
            <p className="text-spyglass-orange font-semibold">
              {testimonials[currentTestimonial].agent}
            </p>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentTestimonial 
                  ? 'bg-spyglass-orange' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
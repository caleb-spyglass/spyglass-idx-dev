import type { Metadata } from 'next';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/home/Footer';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact Us | Free Consultation | Spyglass Realty',
  description: 'Get in touch with Spyglass Realty for a free consultation. Our Austin real estate experts are here to help with buying, selling, and investing.',
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-spyglass-charcoal to-gray-800 text-white py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get Your Free Consultation
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Ready to buy, sell, or invest in Austin real estate? Our expert team is here to guide you every step of the way.
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Request Your Free Consultation</h2>
                <ContactPageClient />
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-6 h-6 text-spyglass-orange mr-4">
                        <svg fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Call us</p>
                        <a href="tel:737-727-4889" className="text-lg font-semibold text-spyglass-orange hover:text-spyglass-orange-hover">
                          737-727-4889
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-6 h-6 text-spyglass-orange mr-4">
                        <svg fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email us</p>
                        <a href="mailto:info@spyglassrealty.com" className="text-lg font-semibold text-spyglass-orange hover:text-spyglass-orange-hover">
                          info@spyglassrealty.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-6 h-6 text-spyglass-orange mr-4">
                        <svg fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Visit us</p>
                        <p className="text-lg font-semibold text-gray-900">
                          2025 Guadalupe Street<br />
                          Austin, TX 78705
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-spyglass-orange text-white rounded-lg p-8">
                  <h3 className="text-xl font-bold mb-4">Why Choose Spyglass Realty?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                      </svg>
                      179+ agents across Austin & Houston
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                      </svg>
                      Deep Austin market expertise since 2010
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                      </svg>
                      $500M+ in annual production
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                      </svg>
                      Personalized service — no upfront costs
                    </li>
                  </ul>
                </div>

                {/* Google Reviews Widget */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-400">
                      {'★★★★★'.split('').map((s, i) => <span key={i} className="text-xl">{s}</span>)}
                    </div>
                    <span className="text-lg font-bold text-gray-900">4.9</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Based on 500+ reviews from happy clients on Google, Zillow, and Realtor.com
                  </p>
                  <a href="/reviews" className="text-sm text-spyglass-orange hover:underline mt-2 inline-block">
                    Read our reviews →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

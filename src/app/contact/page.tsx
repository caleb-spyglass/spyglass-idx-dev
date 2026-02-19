import type { Metadata } from 'next';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/home/Footer';

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
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-2">
                      I'm interested in *
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                    >
                      <option value="">Please select...</option>
                      <option value="buying">Buying a home</option>
                      <option value="selling">Selling a home</option>
                      <option value="investing">Real estate investing</option>
                      <option value="renting">Renting/Property management</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Tell us about your needs
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                      placeholder="Describe your real estate needs, timeline, preferred areas, etc."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-spyglass-orange hover:bg-spyglass-orange-hover text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Request Free Consultation
                  </button>
                </form>
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
                      Deep Austin market expertise
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                      </svg>
                      Personalized service & attention
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                      </svg>
                      Proven track record of success
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                      </svg>
                      No upfront costs or obligations
                    </li>
                  </ul>
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
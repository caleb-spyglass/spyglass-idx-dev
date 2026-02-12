import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/home/Footer';
import { CTABar } from '@/components/home/CTABar';

export default function HomeStagingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero */}
      <section className="relative bg-spyglass-charcoal text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-spyglass-orange text-sm font-semibold tracking-widest uppercase mb-4">Home Staging</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Professional Home Staging Services
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Our certified home stagers transform your property to appeal to the largest audience of buyers, helping you sell faster and for more money.
          </p>
        </div>
      </section>

      {/* Why Stage */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Stage Your Home?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Sell Faster', desc: 'Staged homes sell 73% faster than non-staged homes on average. First impressions matter, and staging ensures your home makes the best one possible.' },
              { title: 'Higher Sale Price', desc: 'Professionally staged homes can sell for 6-20% more than non-staged homes. The investment in staging pays for itself many times over.' },
              { title: 'Stand Out Online', desc: '97% of buyers start their search online. Staged homes photograph better and generate more interest from listing photos and virtual tours.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-8 text-center">
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Staging Process</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {[
              { title: 'Consultation', desc: 'Our certified home stager walks through your property, identifying areas for improvement and creating a personalized staging plan.' },
              { title: 'Design & Coordination', desc: 'We select furniture, décor, and accessories that highlight your home\'s best features. We coordinate everything with our trusted vendors.' },
              { title: 'Professional Staging', desc: 'Our team transforms your space, arranging every detail to create an inviting atmosphere that appeals to the broadest range of buyers.' },
              { title: 'Complimentary Service', desc: 'For our listing clients, professional staging consultation and coordination is provided free of charge as part of our comprehensive services.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-spyglass-orange text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Stage Your Home?</h2>
          <p className="text-gray-600 mb-8">Contact us today to learn more about our complimentary staging services for sellers.</p>
          <a href="/contact" className="inline-block bg-spyglass-orange hover:bg-spyglass-orange/90 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
            Get a Free Consultation
          </a>
        </div>
      </section>

      <CTABar />
      <Footer />
    </div>
  );
}

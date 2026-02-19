import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/home/Footer';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  GlobeAltIcon, 
  MapPinIcon,
  ArrowLeftIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { BuildingOfficeIcon, UserIcon } from '@heroicons/react/24/solid';

interface AgentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  officeLocation: string;
  bio?: string;
  professionalTitle?: string;
  licenseNumber?: string;
  websiteUrl?: string;
  headshotUrl?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
  };
  subdomain?: string;
  videoUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  customSchema?: any;
}

async function getAgent(slug: string): Promise<AgentProfile | null> {
  try {
    const response = await fetch(
      `https://mission-control.spyglassrealty.com/api/agents/${slug}`,
      { 
        next: { revalidate: 300 } // Revalidate every 5 minutes
      }
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.agent;
  } catch (error) {
    console.error('Error fetching agent:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const agent = await getAgent(slug);
  
  if (!agent) {
    return {
      title: 'Agent Not Found | Spyglass Realty',
      description: 'The requested agent profile could not be found.',
    };
  }

  const title = agent.metaTitle || `${agent.firstName} ${agent.lastName} - ${agent.professionalTitle || 'Real Estate Agent'} | Spyglass Realty`;
  const description = agent.metaDescription || 
    `Contact ${agent.firstName} ${agent.lastName}, ${agent.professionalTitle || 'Real Estate Agent'} at Spyglass Realty's ${agent.officeLocation} office. ${agent.bio?.slice(0, 120) || 'Expert real estate services.'}`;

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      images: agent.headshotUrl ? [{ url: agent.headshotUrl }] : [],
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: agent.headshotUrl ? [agent.headshotUrl] : [],
    },
  };

  return metadata;
}

function ContactForm({ agent }: { agent: AgentProfile }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact {agent.firstName}</h3>
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            placeholder="How can I help you with your real estate needs?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

export default async function AgentProfilePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const agent = await getAgent(slug);

  if (!agent) {
    notFound();
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": `${agent.firstName} ${agent.lastName}`,
    "jobTitle": agent.professionalTitle,
    "worksFor": {
      "@type": "Organization",
      "name": "Spyglass Realty",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": agent.officeLocation,
        "addressRegion": "Texas",
        "addressCountry": "US"
      }
    },
    "email": agent.email,
    "telephone": agent.phone,
    "url": agent.websiteUrl,
    "image": agent.headshotUrl,
    "description": agent.bio,
    "sameAs": Object.values(agent.socialLinks || {}).filter(Boolean)
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link 
              href="/agents" 
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to All Agents
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Agent Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Agent Header */}
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="bg-gradient-to-br from-red-600 to-red-700 px-8 py-12">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {agent.headshotUrl ? (
                      <img
                        src={agent.headshotUrl}
                        alt={`${agent.firstName} ${agent.lastName}`}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center border-4 border-white">
                        <UserIcon className="w-16 h-16 text-white" />
                      </div>
                    )}
                    <div className="text-white text-center md:text-left">
                      <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        {agent.firstName} {agent.lastName}
                      </h1>
                      {agent.professionalTitle && (
                        <p className="text-red-100 text-xl mb-3">{agent.professionalTitle}</p>
                      )}
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                        <BuildingOfficeIcon className="w-5 h-5" />
                        <span>{agent.officeLocation} Office</span>
                      </div>
                      {agent.licenseNumber && (
                        <p className="text-red-100 text-sm">License: {agent.licenseNumber}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Contact Bar */}
                <div className="px-8 py-6 bg-gray-50 border-b">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {agent.phone && (
                      <a
                        href={`tel:${agent.phone}`}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex-1"
                      >
                        <PhoneIcon className="w-5 h-5" />
                        {agent.phone}
                      </a>
                    )}
                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center justify-center gap-2 px-6 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex-1"
                    >
                      <EnvelopeIcon className="w-5 h-5" />
                      Email Me
                    </a>
                    {agent.websiteUrl && (
                      <a
                        href={agent.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <GlobeAltIcon className="w-5 h-5" />
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* About Section */}
              {agent.bio && (
                <div className="bg-white rounded-xl shadow-sm border p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">About {agent.firstName}</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{agent.bio}</p>
                  </div>
                </div>
              )}

              {/* Video Section */}
              {agent.videoUrl && (
                <div className="bg-white rounded-xl shadow-sm border p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction Video</h2>
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <a
                      href={agent.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <PlayIcon className="w-6 h-6" />
                      Watch Video
                    </a>
                  </div>
                </div>
              )}

              {/* Social Links */}
              {agent.socialLinks && Object.values(agent.socialLinks).some(Boolean) && (
                <div className="bg-white rounded-xl shadow-sm border p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Connect With {agent.firstName}</h2>
                  <div className="flex flex-wrap gap-4">
                    {agent.socialLinks.facebook && (
                      <a 
                        href={agent.socialLinks.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </a>
                    )}
                    {agent.socialLinks.instagram && (
                      <a 
                        href={agent.socialLinks.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.33-1.297C4.232 14.804 3.742 13.653 3.742 12.356c0-1.297.49-2.448 1.297-3.33.882-.807 2.033-1.297 3.33-1.297s2.448.49 3.33 1.297c.882.882 1.297 2.033 1.297 3.33s-.415 2.552-1.297 3.434c-.882.807-2.033 1.297-3.33 1.297zm7.069 0c-1.297 0-2.448-.49-3.33-1.297-.882-.882-1.297-2.137-1.297-3.434s.415-2.552 1.297-3.434c.882-.807 2.033-1.297 3.33-1.297s2.448.49 3.33 1.297c.882.882 1.297 2.137 1.297 3.434s-.415 2.552-1.297 3.434c-.882.807-2.033 1.297-3.33 1.297z"/>
                        </svg>
                        Instagram
                      </a>
                    )}
                    {agent.socialLinks.linkedin && (
                      <a 
                        href={agent.socialLinks.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                      </a>
                    )}
                    {agent.socialLinks.twitter && (
                      <a 
                        href={agent.socialLinks.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        Twitter
                      </a>
                    )}
                    {agent.socialLinks.youtube && (
                      <a 
                        href={agent.socialLinks.youtube} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        YouTube
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Contact Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <ContactForm agent={agent} />
                
                {/* Office Info */}
                <div className="mt-6 bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Office Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">{agent.officeLocation} Office</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">737-727-4889</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">info@spyglassrealty.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}
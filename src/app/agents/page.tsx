'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/home/Footer';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
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
}

function AgentsContent() {
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';
  
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOffice, setSelectedOffice] = useState('all');

  // Fetch agents from Mission Control API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedOffice !== 'all') params.append('office', selectedOffice);
        if (searchTerm) params.append('search', searchTerm);
        
        const response = await fetch(`https://mission-control.spyglassrealty.com/api/agents?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch agents');
        }
        const data = await response.json();
        setAgents(data.agents || []);
      } catch (err) {
        console.error('Error fetching agents:', err);
        setError('Unable to load agent profiles');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [searchTerm, selectedOffice]);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = searchTerm === '' || 
      `${agent.firstName} ${agent.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.professionalTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOffice = selectedOffice === 'all' || agent.officeLocation === selectedOffice;
    
    return matchesSearch && matchesOffice;
  });

  const offices = ['Austin', 'Houston', 'Corpus Christi'];

  return (
    <div className="min-h-screen bg-gray-50">
      {!isEmbed && <Header />}

      {/* Hero */}
      <div className="bg-gray-900 text-white">
        <div className={`max-w-7xl mx-auto px-4 ${isEmbed ? 'py-6' : 'py-12 md:py-16'}`}>
          <h1 className={`${isEmbed ? 'text-2xl' : 'text-3xl md:text-4xl'} font-bold mb-3`}>
            Our Agents
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Work with Austin&apos;s most dedicated real estate professionals. 
            Our agents know the local market inside and out.
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedOffice}
              onChange={(e) => setSelectedOffice(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="all">All Offices</option>
              {offices.map(office => (
                <option key={office} value={office}>{office}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading agents...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-3 text-red-700 hover:text-red-800 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Agent Grid */}
        {!loading && !error && (
          <>
            {filteredAgents.length === 0 ? (
              <div className="text-center py-12">
                <UserIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents.map((agent) => (
                  <div key={agent.id} className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-shadow duration-300">
                    {/* Agent Photo */}
                    <div className="relative p-6 pb-4">
                      {agent.headshotUrl ? (
                        <img
                          src={agent.headshotUrl}
                          alt={`${agent.firstName} ${agent.lastName}`}
                          className="w-24 h-24 rounded-full mx-auto object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                          <UserIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Agent Info */}
                    <div className="px-6 pb-6">
                      <h3 className="text-xl font-semibold text-gray-900 text-center mb-1">
                        {agent.firstName} {agent.lastName}
                      </h3>
                      {agent.professionalTitle && (
                        <p className="text-gray-600 text-center mb-3">{agent.professionalTitle}</p>
                      )}
                      
                      <div className="flex items-center justify-center gap-1 mb-4">
                        <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{agent.officeLocation}</span>
                      </div>

                      {agent.bio && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{agent.bio}</p>
                      )}

                      {/* Contact Actions */}
                      <div className="space-y-2">
                        <a
                          href={`tel:${agent.phone}`}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <PhoneIcon className="w-4 h-4" />
                          {agent.phone || 'Contact'}
                        </a>
                        <a
                          href={`mailto:${agent.email}`}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <EnvelopeIcon className="w-4 h-4" />
                          Email
                        </a>
                        {agent.subdomain && (
                          <Link
                            href={`/agents/${agent.subdomain}`}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            View Profile
                          </Link>
                        )}
                      </div>

                      {/* Social Links */}
                      {agent.socialLinks && Object.values(agent.socialLinks).some(Boolean) && (
                        <div className="flex justify-center gap-3 mt-4 pt-4 border-t">
                          {agent.socialLinks.facebook && (
                            <a href={agent.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            </a>
                          )}
                          {agent.socialLinks.instagram && (
                            <a href={agent.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.33-1.297C4.232 14.804 3.742 13.653 3.742 12.356c0-1.297.49-2.448 1.297-3.33.882-.807 2.033-1.297 3.33-1.297s2.448.49 3.33 1.297c.882.882 1.297 2.033 1.297 3.33s-.415 2.552-1.297 3.434c-.882.807-2.033 1.297-3.33 1.297zm7.069 0c-1.297 0-2.448-.49-3.33-1.297-.882-.882-1.297-2.137-1.297-3.434s.415-2.552 1.297-3.434c.882-.807 2.033-1.297 3.33-1.297s2.448.49 3.33 1.297c.882.882 1.297 2.137 1.297 3.434s-.415 2.552-1.297 3.434c-.882.807-2.033 1.297-3.33 1.297z"/></svg>
                            </a>
                          )}
                          {agent.socialLinks.linkedin && (
                            <a href={agent.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                            </a>
                          )}
                          {agent.socialLinks.twitter && (
                            <a href={agent.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Contact Fallback */}
            <div className="mt-12 bg-white rounded-xl shadow-sm border p-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help Finding the Right Agent?</h3>
                <p className="text-gray-600 mb-6">Contact us and we'll connect you with the perfect agent for your needs.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="tel:7377274889"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <PhoneIcon className="w-5 h-5" />
                    737-727-4889
                  </a>
                  <a
                    href="mailto:info@spyglassrealty.com"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <EnvelopeIcon className="w-5 h-5" />
                    info@spyglassrealty.com
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer - only show if not in embed mode */}
      {!isEmbed && <Footer />}

      {/* Powered by footer for embeds */}
      {isEmbed && (
        <div className="bg-white border-t border-gray-200 px-4 py-2 text-center text-xs text-gray-500">
          Powered by{' '}
          <a 
            href="https://spyglassrealty.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Spyglass Realty
          </a>
        </div>
      )}
    </div>
  );
}

export default function AgentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50"><Header /><div className="p-8 text-center">Loading...</div></div>}>
      <AgentsContent />
    </Suspense>
  );
}

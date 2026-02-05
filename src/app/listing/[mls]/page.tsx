'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { Listing } from '@/types/listing';
import { formatPrice, formatNumber } from '@/lib/utils';
import { 
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
  MapPinIcon,
  HomeIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      try {
        const response = await fetch(`/api/listings/${params.mls}`);
        if (!response.ok) {
          throw new Error('Listing not found');
        }
        const data = await response.json();
        setListing(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load listing');
      } finally {
        setLoading(false);
      }
    }

    if (params.mls) {
      fetchListing();
    }
  }, [params.mls]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with lead capture system
    console.log('Lead submitted:', contactForm);
    setFormSubmitted(true);
  };

  const nextPhoto = () => {
    if (listing) {
      setCurrentPhotoIndex((prev) => (prev + 1) % listing.photos.length);
    }
  };

  const prevPhoto = () => {
    if (listing) {
      setCurrentPhotoIndex((prev) => (prev - 1 + listing.photos.length) % listing.photos.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
            <div className="h-96 bg-gray-200 rounded-lg mb-6" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-24 bg-gray-200 rounded" />
              <div className="h-24 bg-gray-200 rounded" />
              <div className="h-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'This listing may have been removed or is no longer available.'}</p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-spyglass-orange text-white rounded-lg hover:bg-spyglass-orange/90 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    'Active': 'bg-green-500',
    'Pending': 'bg-yellow-500',
    'Sold': 'bg-red-500',
    'Coming Soon': 'bg-blue-500'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to results
        </button>
      </div>

      {/* Photo Gallery */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="relative">
          {/* Main Image */}
          <div 
            className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => setShowGallery(true)}
          >
            {listing.photos.length > 0 ? (
              <img
                src={listing.photos[currentPhotoIndex]}
                alt={`${listing.address.street} - Photo ${currentPhotoIndex + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <HomeIcon className="w-24 h-24 text-gray-400" />
              </div>
            )}
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-lg font-medium">View all {listing.photos.length} photos</span>
            </div>

            {/* Navigation arrows */}
            {listing.photos.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                >
                  <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                >
                  <ChevronRightIcon className="w-6 h-6 text-gray-800" />
                </button>
              </>
            )}

            {/* Photo counter */}
            {listing.photos.length > 1 && (
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 rounded-full text-white text-sm">
                {currentPhotoIndex + 1} / {listing.photos.length}
              </div>
            )}

            {/* Status badge */}
            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm font-medium ${statusColors[listing.status]}`}>
              {listing.status}
            </div>
          </div>

          {/* Thumbnail strip */}
          {listing.photos.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {listing.photos.slice(0, 6).map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPhotoIndex(idx)}
                  className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden ${
                    currentPhotoIndex === idx ? 'ring-2 ring-spyglass-orange' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              {listing.photos.length > 6 && (
                <button
                  onClick={() => setShowGallery(true)}
                  className="flex-shrink-0 w-24 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors"
                >
                  +{listing.photos.length - 6} more
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {formatPrice(listing.price)}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <MapPinIcon className="w-5 h-5" />
                  <span className="text-lg">{listing.address.full}</span>
                </div>
                {listing.address.neighborhood && (
                  <p className="text-spyglass-orange font-medium">{listing.address.neighborhood}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-3 rounded-full border border-gray-300 hover:border-gray-400 transition-colors"
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-gray-600" />
                  )}
                </button>
                <button
                  onClick={() => navigator.share?.({ title: listing.address.full, url: window.location.href })}
                  className="p-3 rounded-full border border-gray-300 hover:border-gray-400 transition-colors"
                >
                  <ShareIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {listing.bedrooms > 0 && (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">{listing.bedrooms}</p>
                  <p className="text-gray-500">Bedrooms</p>
                </div>
              )}
              {listing.bathrooms > 0 && (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">{listing.bathrooms}</p>
                  <p className="text-gray-500">Bathrooms</p>
                </div>
              )}
              {listing.sqft > 0 && (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(listing.sqft)}</p>
                  <p className="text-gray-500">Sq Ft</p>
                </div>
              )}
              {listing.yearBuilt && (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">{listing.yearBuilt}</p>
                  <p className="text-gray-500">Year Built</p>
                </div>
              )}
            </div>

            {/* Description */}
            {listing.description && (
              <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Property</h2>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                  {listing.description}
                </p>
              </div>
            )}

            {/* Property Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Property Type</span>
                  <span className="font-medium">{listing.propertyType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">MLS #</span>
                  <span className="font-medium">{listing.mlsNumber}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Days on Market</span>
                  <span className="font-medium">{listing.daysOnMarket}</span>
                </div>
                {listing.lotSize && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Lot Size</span>
                    <span className="font-medium">{listing.lotSize} acres</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Listed</span>
                  <span className="font-medium">
                    {new Date(listing.listDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Last Updated</span>
                  <span className="font-medium">
                    {new Date(listing.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <a
                  href={`https://www.google.com/maps?q=${listing.coordinates.lat},${listing.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-spyglass-orange hover:underline"
                >
                  View on Google Maps →
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar - Contact Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Interested in this property?</h2>
              <p className="text-gray-600 mb-6">Schedule a tour or request more information</p>

              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Thank you!</h3>
                  <p className="text-gray-600">A Spyglass agent will be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                      placeholder="(512) 555-0100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spyglass-orange focus:border-transparent resize-none"
                      placeholder={`I'm interested in ${listing.address.street}...`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-spyglass-orange text-white rounded-lg font-medium hover:bg-spyglass-orange/90 transition-colors"
                  >
                    Request Information
                  </button>
                </form>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <a
                  href="tel:737-727-4889"
                  className="flex items-center justify-center gap-2 w-full py-3 border border-spyglass-orange text-spyglass-orange rounded-lg font-medium hover:bg-spyglass-orange/10 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call 737-727-4889
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full screen gallery modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex items-center justify-between p-4">
            <span className="text-white">
              {currentPhotoIndex + 1} / {listing.photos.length}
            </span>
            <button
              onClick={() => setShowGallery(false)}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <img
              src={listing.photos[currentPhotoIndex]}
              alt={`Photo ${currentPhotoIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            {listing.photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 p-3 bg-white/20 rounded-full hover:bg-white/40 transition-colors"
                >
                  <ChevronLeftIcon className="w-8 h-8 text-white" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-4 p-3 bg-white/20 rounded-full hover:bg-white/40 transition-colors"
                >
                  <ChevronRightIcon className="w-8 h-8 text-white" />
                </button>
              </>
            )}
          </div>
          {/* Thumbnail strip */}
          <div className="p-4 flex gap-2 overflow-x-auto justify-center">
            {listing.photos.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPhotoIndex(idx)}
                className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden ${
                  currentPhotoIndex === idx ? 'ring-2 ring-white' : 'opacity-50 hover:opacity-100'
                }`}
              >
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

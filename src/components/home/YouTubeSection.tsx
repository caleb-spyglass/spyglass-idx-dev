import Link from 'next/link';
import { PlayIcon } from '@heroicons/react/24/solid';

export function YouTubeSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            See Our Latest Videos on our YouTube Channel
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay informed with market updates, home buying tips, and exclusive property tours.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Featured Video */}
          <div className="md:col-span-2">
            <div className="relative bg-gray-200 rounded-xl overflow-hidden aspect-video group cursor-pointer hover:scale-105 transition-transform">
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Austin Market Update Video Thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-20 h-20 bg-spyglass-orange rounded-full flex items-center justify-center group-hover:bg-spyglass-orange-hover transition-colors">
                  <PlayIcon className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-semibold text-lg mb-1">
                  Austin Market Update - February 2024
                </h3>
                <p className="text-white/80 text-sm">
                  Latest trends and insights in the Austin real estate market
                </p>
              </div>
            </div>
          </div>

          {/* Side Videos */}
          <div className="space-y-4">
            <div className="relative bg-gray-200 rounded-lg overflow-hidden aspect-video group cursor-pointer hover:scale-105 transition-transform">
              <img
                src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="First Time Home Buyer Tips"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-12 h-12 bg-spyglass-orange rounded-full flex items-center justify-center group-hover:bg-spyglass-orange-hover transition-colors">
                  <PlayIcon className="w-4 h-4 text-white ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <h4 className="text-white font-medium text-sm">
                  First-Time Buyer Tips
                </h4>
              </div>
            </div>

            <div className="relative bg-gray-200 rounded-lg overflow-hidden aspect-video group cursor-pointer hover:scale-105 transition-transform">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Home Staging Tips"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-12 h-12 bg-spyglass-orange rounded-full flex items-center justify-center group-hover:bg-spyglass-orange-hover transition-colors">
                  <PlayIcon className="w-4 h-4 text-white ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <h4 className="text-white font-medium text-sm">
                  Home Staging Tips
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* See All Button */}
        <div className="text-center">
          <Link 
            href="https://www.youtube.com/@spyglassrealty"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 bg-spyglass-orange text-white font-semibold rounded-lg hover:bg-spyglass-orange-hover transition-colors"
          >
            See All
          </Link>
        </div>
      </div>
    </section>
  );
}
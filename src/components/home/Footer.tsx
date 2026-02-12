import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-spyglass-charcoal text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Image
                src="/spyglass-logo-footer.svg"
                alt="Spyglass Realty"
                width={60}
                height={60}
                className="h-12 w-auto filter brightness-0 invert"
              />
            </div>
            
            <div className="space-y-2 text-gray-300">
              <p>2025 Guadalupe Street</p>
              <p>Austin, TX 78705</p>
              <p className="text-spyglass-orange font-semibold">737-727-4889</p>
            </div>
          </div>

          {/* Featured Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-spyglass-orange">Featured</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Featured Listings
                </Link>
              </li>
              <li>
                <Link href="/newsroom" className="text-gray-300 hover:text-white transition-colors">
                  Newsroom
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/mortgage" className="text-gray-300 hover:text-white transition-colors">
                  Mortgage Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Communities Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-spyglass-orange">Communities</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/communities/barton-hills" className="text-gray-300 hover:text-white transition-colors">
                  Barton Hills
                </Link>
              </li>
              <li>
                <Link href="/communities/travis-heights" className="text-gray-300 hover:text-white transition-colors">
                  Travis Heights
                </Link>
              </li>
              <li>
                <Link href="/communities/zilker" className="text-gray-300 hover:text-white transition-colors">
                  Zilker
                </Link>
              </li>
              <li>
                <Link href="/communities/south-lamar" className="text-gray-300 hover:text-white transition-colors">
                  South Lamar
                </Link>
              </li>
              <li>
                <Link href="/communities/downtown" className="text-gray-300 hover:text-white transition-colors">
                  Downtown
                </Link>
              </li>
              <li>
                <Link href="/communities" className="text-gray-300 hover:text-white transition-colors">
                  All Communities
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-spyglass-orange">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/buying" className="text-gray-300 hover:text-white transition-colors">
                  Buying
                </Link>
              </li>
              <li>
                <Link href="/selling" className="text-gray-300 hover:text-white transition-colors">
                  Selling
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/agents" className="text-gray-300 hover:text-white transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-6 mb-8">
          <a
            href="https://facebook.com/spyglassrealty"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-spyglass-orange transition-colors"
            aria-label="Facebook"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a
            href="https://twitter.com/spyglassrealty"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-spyglass-orange transition-colors"
            aria-label="X (Twitter)"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a
            href="https://instagram.com/spyglassrealty"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-spyglass-orange transition-colors"
            aria-label="Instagram"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988c6.62 0 11.987-5.367 11.987-11.988C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447c0-1.297.49-2.448 1.297-3.323C5.901 8.198 7.052 7.708 8.349 7.708c1.297 0 2.448.49 3.323 1.297c.876.875 1.366 2.026 1.366 3.323c0 1.297-.49 2.448-1.297 3.323c-.875.876-2.026 1.366-3.323 1.366z"/>
            </svg>
          </a>
          <a
            href="https://linkedin.com/company/spyglass-realty"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-spyglass-orange transition-colors"
            aria-label="LinkedIn"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a
            href="https://youtube.com/@spyglassrealty"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-spyglass-orange transition-colors"
            aria-label="YouTube"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Spyglass Realty. All Rights Reserved.
          </p>
          
          <div className="flex space-x-6 text-sm">
            <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
              Sitemap
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
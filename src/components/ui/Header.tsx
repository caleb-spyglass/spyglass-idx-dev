'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [sellingOpen, setSellingOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <header className="bg-spyglass-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/spyglass-logo-white.svg"
              alt="Spyglass Realty"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/buy" className="text-sm hover:text-spyglass-orange transition-colors">
              Buying
            </Link>
            
            {/* Search Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setSearchOpen(true)}
                onMouseLeave={() => setSearchOpen(false)}
                className="text-sm hover:text-spyglass-orange transition-colors flex items-center gap-1"
              >
                Search
                <ChevronDownIcon className="w-3 h-3" />
              </button>
              {searchOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-56 bg-spyglass-charcoal/95 backdrop-blur-sm text-white rounded-lg shadow-lg py-2 z-50 border border-gray-600"
                  onMouseEnter={() => setSearchOpen(true)}
                  onMouseLeave={() => setSearchOpen(false)}
                >
                  <Link href="/featured-listings" className="block px-4 py-2 text-sm hover:text-spyglass-orange transition-colors">
                    Featured Listings
                  </Link>
                  <Link href="/agents" className="block px-4 py-2 text-sm hover:text-spyglass-orange transition-colors">
                    Agents
                  </Link>
                  <Link href="/communities" className="block px-4 py-2 text-sm hover:text-spyglass-orange transition-colors">
                    Communities
                  </Link>
                  <Link href="/zip-codes" className="block px-4 py-2 text-sm hover:text-spyglass-orange transition-colors">
                    Search by Zip Code
                  </Link>
                  <Link href="/" className="block px-4 py-2 text-sm hover:text-spyglass-orange transition-colors">
                    Search by Maps
                  </Link>
                </div>
              )}
            </div>
            
            {/* Services Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
                className="text-sm hover:text-spyglass-orange transition-colors flex items-center gap-1"
              >
                Services
                <ChevronDownIcon className="w-3 h-3" />
              </button>
              {servicesOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-56 bg-spyglass-charcoal/95 backdrop-blur-sm text-white rounded-lg shadow-lg py-2 z-50 border border-gray-600"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <Link href="/services" className="block px-4 py-2 text-sm hover:text-spyglass-orange transition-colors">
                    Services
                  </Link>
                  <Link href="/mortgage-calculator" className="block px-4 py-2 text-sm hover:text-spyglass-orange transition-colors">
                    Mortgage Calculator
                  </Link>
                  <Link href="/relocation" className="block px-4 py-2 text-sm hover:text-spyglass-orange transition-colors">
                    Relocation
                  </Link>
                  <Link href="/cash-offer" className="block px-4 py-2 text-sm hover:text-spyglass-orange transition-colors">
                    Cash Offer Trade In
                  </Link>
                </div>
              )}
            </div>

            {/* Selling Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setSellingOpen(true)}
                onMouseLeave={() => setSellingOpen(false)}
                className="text-sm hover:text-spyglass-orange transition-colors flex items-center gap-1"
              >
                Selling
                <ChevronDownIcon className="w-3 h-3" />
              </button>
              {sellingOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-48 bg-spyglass-charcoal/95 backdrop-blur-sm text-white rounded-lg shadow-lg py-2 z-50 border border-gray-600"
                  onMouseEnter={() => setSellingOpen(true)}
                  onMouseLeave={() => setSellingOpen(false)}
                >
                  <Link href="/home-staging" className="block px-4 py-2 text-sm hover:text-spyglass-orange transition-colors">
                    Home Staging
                  </Link>
                  <Link href="/sell" className="block px-4 py-2 text-sm hover:text-spyglass-orange transition-colors">
                    Selling
                  </Link>
                </div>
              )}
            </div>

            {/* About Us Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setAboutOpen(true)}
                onMouseLeave={() => setAboutOpen(false)}
                className="text-sm hover:text-spyglass-orange transition-colors flex items-center gap-1"
              >
                About Us
                <ChevronDownIcon className="w-3 h-3" />
              </button>
              {aboutOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-48 bg-spyglass-charcoal/95 backdrop-blur-sm text-white rounded-lg shadow-lg py-2 z-50 border border-gray-600"
                  onMouseEnter={() => setAboutOpen(true)}
                  onMouseLeave={() => setAboutOpen(false)}
                >
                  <Link href="/about" className="block px-4 py-2 text-sm hover:text-spyglass-orange transition-colors">
                    About Us
                  </Link>
                  <Link href="/team" className="block px-4 py-2 text-sm hover:text-spyglass-orange transition-colors">
                    Our Team
                  </Link>
                  <Link href="/reviews" className="block px-4 py-2 text-sm hover:text-spyglass-orange transition-colors">
                    Reviews
                  </Link>
                </div>
              )}
            </div>

            <Link href="/sign-in" className="text-sm hover:text-spyglass-orange transition-colors">
              Sign In
            </Link>
          </nav>

          {/* CTA Button and Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link 
              href="/contact"
              className="bg-spyglass-orange hover:bg-spyglass-orange-hover px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Free Consultation
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-600">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/buy" className="block px-3 py-2 text-sm hover:text-spyglass-orange">
                Buying
              </Link>
              <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
                Search
              </div>
              <Link href="/featured-listings" className="block px-6 py-2 text-sm hover:text-spyglass-orange">
                Featured Listings
              </Link>
              <Link href="/agents" className="block px-6 py-2 text-sm hover:text-spyglass-orange">
                Agents
              </Link>
              <Link href="/communities" className="block px-6 py-2 text-sm hover:text-spyglass-orange">
                Communities
              </Link>
              <Link href="/zip-codes" className="block px-6 py-2 text-sm hover:text-spyglass-orange">
                Search by Zip Code
              </Link>
              <Link href="/" className="block px-6 py-2 text-sm hover:text-spyglass-orange">
                Search by Maps
              </Link>
              <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
                Services
              </div>
              <Link href="/services" className="block px-6 py-2 text-sm hover:text-spyglass-orange">
                Services
              </Link>
              <Link href="/mortgage-calculator" className="block px-6 py-2 text-sm hover:text-spyglass-orange">
                Mortgage Calculator
              </Link>
              <Link href="/relocation" className="block px-6 py-2 text-sm hover:text-spyglass-orange">
                Relocation
              </Link>
              <Link href="/cash-offer" className="block px-6 py-2 text-sm hover:text-spyglass-orange">
                Cash Offer Trade In
              </Link>
              <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
                Selling
              </div>
              <Link href="/home-staging" className="block px-6 py-2 text-sm hover:text-spyglass-orange">
                Home Staging
              </Link>
              <Link href="/sell" className="block px-6 py-2 text-sm hover:text-spyglass-orange">
                Selling
              </Link>
              <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
                About Us
              </div>
              <Link href="/about" className="block px-6 py-2 text-sm hover:text-spyglass-orange">
                About Us
              </Link>
              <Link href="/team" className="block px-6 py-2 text-sm hover:text-spyglass-orange">
                Our Team
              </Link>
              <Link href="/reviews" className="block px-6 py-2 text-sm hover:text-spyglass-orange">
                Reviews
              </Link>
              <Link href="/sign-in" className="block px-3 py-2 text-sm hover:text-spyglass-orange">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
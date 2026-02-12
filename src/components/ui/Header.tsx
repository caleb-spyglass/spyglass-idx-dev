'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { UserMenu } from '@/components/auth/UserMenu';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [sellingOpen, setSellingOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <header className="bg-spyglass-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-spyglass-orange">SPYGLASS</span>
              <span className="font-light ml-1">REALTY</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/buying" className="text-sm hover:text-spyglass-orange transition-colors">
              Buying
            </Link>
            
            <Link href="/" className="text-sm hover:text-spyglass-orange transition-colors">
              Search
            </Link>
            
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
                  className="absolute top-full left-0 mt-1 w-48 bg-white text-gray-900 rounded-lg shadow-lg py-2 z-50"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <Link href="/mortgage" className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Mortgage Calculator
                  </Link>
                  <Link href="/valuation" className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Home Valuation
                  </Link>
                  <Link href="/market-report" className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Market Report
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
                  className="absolute top-full left-0 mt-1 w-48 bg-white text-gray-900 rounded-lg shadow-lg py-2 z-50"
                  onMouseEnter={() => setSellingOpen(true)}
                  onMouseLeave={() => setSellingOpen(false)}
                >
                  <Link href="/sell" className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Sell Your Home
                  </Link>
                  <Link href="/pricing" className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Pricing Strategy
                  </Link>
                  <Link href="/marketing" className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Marketing Your Home
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
                  className="absolute top-full left-0 mt-1 w-48 bg-white text-gray-900 rounded-lg shadow-lg py-2 z-50"
                  onMouseEnter={() => setAboutOpen(true)}
                  onMouseLeave={() => setAboutOpen(false)}
                >
                  <Link href="/about" className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Our Story
                  </Link>
                  <Link href="/agents" className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Our Team
                  </Link>
                  <Link href="/testimonials" className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Testimonials
                  </Link>
                  <Link href="/reviews" className="block px-4 py-2 text-sm hover:bg-gray-50">
                    Reviews
                  </Link>
                </div>
              )}
            </div>

            <Link href="/login" className="text-sm hover:text-spyglass-orange transition-colors">
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
              <Link href="/buying" className="block px-3 py-2 text-sm hover:text-spyglass-orange">
                Buying
              </Link>
              <Link href="/" className="block px-3 py-2 text-sm hover:text-spyglass-orange">
                Search
              </Link>
              <Link href="/services" className="block px-3 py-2 text-sm hover:text-spyglass-orange">
                Services
              </Link>
              <Link href="/selling" className="block px-3 py-2 text-sm hover:text-spyglass-orange">
                Selling
              </Link>
              <Link href="/about" className="block px-3 py-2 text-sm hover:text-spyglass-orange">
                About Us
              </Link>
              <Link href="/login" className="block px-3 py-2 text-sm hover:text-spyglass-orange">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
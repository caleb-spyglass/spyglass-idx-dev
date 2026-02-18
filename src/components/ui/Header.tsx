'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface DropdownProps {
  label: string;
  items: { href: string; label: string }[];
}

function NavDropdown({ label, items }: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="text-sm hover:text-spyglass-orange transition-colors flex items-center gap-1 py-5">
        {label}
        <ChevronDownIcon className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute top-full left-0 pt-0 w-56 z-50">
          <div className="bg-spyglass-charcoal/95 backdrop-blur-sm text-white rounded-lg shadow-lg py-2 border border-gray-600">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm hover:text-spyglass-orange hover:bg-white/5 transition-colors"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchItems = [
    { href: '/featured-listings', label: 'Featured Listings' },
    { href: '/commercial', label: 'Commercial Space' },
    { href: '/agents', label: 'Agents' },
    { href: '/communities', label: 'Communities' },
    { href: '/zip-codes', label: 'Search by Zip Code' },
    { href: '/', label: 'Search by Maps' },
  ];

  const servicesItems = [
    { href: '/services', label: 'Services' },
    { href: '/mortgage-calculator', label: 'Mortgage Calculator' },
    { href: '/relocation', label: 'Relocation' },
    { href: '/cash-offer', label: 'Cash Offer Trade In' },
  ];

  const sellingItems = [
    { href: '/sell', label: 'Selling' },
    { href: '/home-staging', label: 'Home Staging' },
  ];

  const aboutItems = [
    { href: '/about', label: 'About Us' },
    { href: '/agents', label: 'Our Team' },
    { href: '/reviews', label: 'Reviews' },
  ];

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
            
            <NavDropdown label="Search" items={searchItems} />
            <NavDropdown label="Services" items={servicesItems} />
            <NavDropdown label="Selling" items={sellingItems} />
            <NavDropdown label="About Us" items={aboutItems} />

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
              <Link href="/buy" className="block px-3 py-2 text-sm hover:text-spyglass-orange" onClick={() => setMobileMenuOpen(false)}>
                Buying
              </Link>
              <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
                Search
              </div>
              {searchItems.map((item) => (
                <Link key={item.href + item.label} href={item.href} className="block px-6 py-2 text-sm hover:text-spyglass-orange" onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
                Services
              </div>
              {servicesItems.map((item) => (
                <Link key={item.href} href={item.href} className="block px-6 py-2 text-sm hover:text-spyglass-orange" onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
                Selling
              </div>
              {sellingItems.map((item) => (
                <Link key={item.href} href={item.href} className="block px-6 py-2 text-sm hover:text-spyglass-orange" onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
                About Us
              </div>
              {aboutItems.map((item) => (
                <Link key={item.href + item.label} href={item.href} className="block px-6 py-2 text-sm hover:text-spyglass-orange" onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <Link href="/sign-in" className="block px-3 py-2 text-sm hover:text-spyglass-orange" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

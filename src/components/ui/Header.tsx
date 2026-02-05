'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-spyglass-charcoal text-white">
      <div className="max-w-full mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-spyglass-orange">SPYGLASS</span>
              <span className="font-light ml-1">REALTY</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm hover:text-spyglass-orange transition-colors">
              Buy
            </Link>
            <Link href="/sell" className="text-sm hover:text-spyglass-orange transition-colors">
              Sell
            </Link>
            <Link href="/communities" className="text-sm hover:text-spyglass-orange transition-colors">
              Communities
            </Link>
            <Link href="/agents" className="text-sm hover:text-spyglass-orange transition-colors">
              Agents
            </Link>
            <Link href="/about" className="text-sm hover:text-spyglass-orange transition-colors">
              About
            </Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <a 
              href="tel:737-727-4889" 
              className="hidden md:block text-sm hover:text-spyglass-orange transition-colors"
            >
              737-727-4889
            </a>
            <Link 
              href="/contact"
              className="bg-spyglass-orange hover:bg-spyglass-orange-hover px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getUser, saveUser, clearUser, User } from '@/lib/auth';
import { useFavorites } from '@/hooks/useFavorites';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import {
  UserCircleIcon,
  HeartIcon,
  BookmarkIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [formError, setFormError] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { favoritesCount } = useFavorites();
  const { searchesCount } = useSavedSearches();

  useEffect(() => {
    setUser(getUser());
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showModal]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError('Name and email are required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    const saved = saveUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
    });
    setUser(saved);
    setShowModal(false);
    setFormData({ name: '', email: '', phone: '' });
  };

  const handleSignOut = () => {
    clearUser();
    setUser(null);
    setShowDropdown(false);
  };

  const initials = user?.name
    ? user.name.charAt(0).toUpperCase()
    : '';

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {user ? (
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 rounded-full bg-spyglass-orange flex items-center justify-center text-white font-semibold text-sm">
              {initials}
            </div>
          </button>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 text-sm hover:text-spyglass-orange transition-colors"
          >
            <UserCircleIcon className="w-5 h-5" />
            Sign In
          </button>
        )}

        {/* Dropdown */}
        {showDropdown && user && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            {/* User info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="font-medium text-gray-900 text-sm">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>

            <div className="py-1">
              <Link
                href="/favorites"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <HeartIcon className="w-5 h-5 text-gray-400" />
                <span>My Favorites</span>
                {favoritesCount > 0 && (
                  <span className="ml-auto text-xs bg-spyglass-orange/10 text-spyglass-orange font-medium px-2 py-0.5 rounded-full">
                    {favoritesCount}
                  </span>
                )}
              </Link>
              <Link
                href="/saved-searches"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <BookmarkIcon className="w-5 h-5 text-gray-400" />
                <span>Saved Searches</span>
                {searchesCount > 0 && (
                  <span className="ml-auto text-xs bg-spyglass-orange/10 text-spyglass-orange font-medium px-2 py-0.5 rounded-full">
                    {searchesCount}
                  </span>
                )}
              </Link>
            </div>

            <div className="border-t border-gray-100 pt-1">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowRightStartOnRectangleIcon className="w-5 h-5 text-gray-400" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sign-in Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Create Your Account</h2>
                <p className="text-sm text-gray-500 mt-0.5">Save favorites & searches</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSignIn} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg">
                  {formError}
                </div>
              )}

              <div>
                <label htmlFor="auth-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  id="auth-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Smith"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="auth-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  id="auth-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="auth-phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  id="auth-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(512) 555-1234"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-spyglass-orange text-white font-semibold rounded-lg hover:bg-spyglass-orange/90 transition-colors"
              >
                Get Started
              </button>

              <p className="text-xs text-gray-500 text-center">
                By signing up you agree to receive property updates from Spyglass Realty. No spam, ever.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import { useState, useEffect, useTransition } from 'react';
import { saveSettingsAction } from '../actions';

const SETTING_FIELDS = [
  { key: 'company_name', label: 'Company Name', type: 'text' },
  { key: 'tagline', label: 'Tagline', type: 'text' },
  { key: 'phone', label: 'Phone', type: 'tel' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'address', label: 'Address', type: 'text' },
  { key: 'footer_text', label: 'Footer Text', type: 'text' },
  { key: 'facebook_url', label: 'Facebook URL', type: 'url' },
  { key: 'instagram_url', label: 'Instagram URL', type: 'url' },
  { key: 'youtube_url', label: 'YouTube URL', type: 'url' },
  { key: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
  { key: 'twitter_url', label: 'Twitter/X URL', type: 'url' },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        const flat: Record<string, string> = {};
        for (const [k, v] of Object.entries(data)) {
          flat[k] = typeof v === 'string' ? v : String(v ?? '');
        }
        setSettings(flat);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function handleChange(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    for (const [k, v] of Object.entries(settings)) {
      formData.set(k, v);
    }
    startTransition(async () => {
      const result = await saveSettingsAction(formData);
      if (result.success) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    });
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-gray-500 text-sm mt-1">
            Global settings — saved instantly and revalidated across the site
          </p>
        </div>

        {saveStatus === 'saved' && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700 flex items-center gap-2 mb-6">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Settings saved and revalidated across the site.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Company Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 mb-6">
            <h2 className="font-semibold text-gray-900 text-sm">Company Information</h2>
            {SETTING_FIELDS.filter(f =>
              ['company_name', 'tagline', 'phone', 'email', 'address', 'footer_text'].includes(f.key)
            ).map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={settings[field.key] ?? ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#EF4923] focus:border-[#EF4923]"
                />
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 mb-6">
            <h2 className="font-semibold text-gray-900 text-sm">Social Links</h2>
            {SETTING_FIELDS.filter(f => f.key.endsWith('_url')).map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={settings[field.key] ?? ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#EF4923] focus:border-[#EF4923]"
                  placeholder="https://"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 rounded-lg font-semibold text-white text-sm transition-opacity disabled:opacity-50"
              style={{ backgroundColor: '#EF4923' }}
            >
              {isPending ? 'Saving...' : 'Save Settings & Revalidate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { savePageAction } from '../../actions';
import type { CmsPage } from '@/lib/admin-db';

interface PageEditorFormProps {
  page: CmsPage;
}

export function PageEditorForm({ page }: PageEditorFormProps) {
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const [title, setTitle] = useState(page.title);
  const [metaTitle, setMetaTitle] = useState(page.meta_title);
  const [metaDescription, setMetaDescription] = useState(page.meta_description);
  const [isPublished, setIsPublished] = useState(page.is_published);
  const [contentJson, setContentJson] = useState(
    JSON.stringify(page.content, null, 2)
  );
  const [jsonError, setJsonError] = useState('');

  function validateJson(val: string) {
    try {
      JSON.parse(val);
      setJsonError('');
      return true;
    } catch {
      setJsonError('Invalid JSON');
      return false;
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateJson(contentJson)) return;

    setSaveStatus('saving');
    const formData = new FormData(e.currentTarget);
    // Override content with the current textarea value
    formData.set('content', contentJson);
    formData.set('is_published', String(isPublished));

    startTransition(async () => {
      const result = await savePageAction(formData);
      if (!result.success) {
        setErrorMsg(result.error ?? 'Save failed');
        setSaveStatus('error');
      } else {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    });
  }

  const frontendUrl = page.slug === '/' ? '/' : page.slug;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="slug" value={page.slug} />

      {/* Status bar */}
      {saveStatus === 'saved' && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Saved and revalidated! Changes are live.{' '}
          <Link href={frontendUrl} target="_blank" className="underline font-medium">
            View page →
          </Link>
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {errorMsg || 'Save failed. Try again.'}
        </div>
      )}

      {/* Basic fields */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 text-sm">Page Details</h2>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Page Title
          </label>
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#EF4923] focus:border-[#EF4923]"
            placeholder="Page title"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Meta Title <span className="font-normal text-gray-400">(browser tab & SEO)</span>
          </label>
          <input
            name="meta_title"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#EF4923] focus:border-[#EF4923]"
            placeholder="e.g. Buy a Home in Austin | Spyglass Realty"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Meta Description <span className="font-normal text-gray-400">(SEO snippet)</span>
          </label>
          <textarea
            name="meta_description"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#EF4923] focus:border-[#EF4923] resize-y"
            placeholder="150-160 character description for search engines"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#EF4923]"></div>
          </label>
          <span className="text-sm text-gray-700">Published</span>
        </div>
      </div>

      {/* Content JSON editor */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-sm">Content Sections (JSON)</h2>
          <span className="text-xs text-gray-400">JSONB — stores structured page content</span>
        </div>
        {jsonError && (
          <p className="text-xs text-red-600">{jsonError}</p>
        )}
        <textarea
          value={contentJson}
          onChange={(e) => {
            setContentJson(e.target.value);
            validateJson(e.target.value);
          }}
          rows={20}
          className={`w-full px-3 py-3 border rounded-lg text-xs font-mono focus:outline-none focus:ring-1 resize-y ${
            jsonError
              ? 'border-red-300 focus:ring-red-400 focus:border-red-400'
              : 'border-gray-300 focus:ring-[#EF4923] focus:border-[#EF4923]'
          }`}
          spellCheck={false}
        />
        <p className="text-xs text-gray-400">
          This JSON object can store any structured content for this page.
          Your frontend can read it via <code className="bg-gray-100 px-1 rounded">getPageContent(&apos;{page.slug}&apos;)</code> from <code className="bg-gray-100 px-1 rounded">@/lib/cms</code>.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link href={frontendUrl} target="_blank" className="text-sm text-gray-500 hover:text-gray-700 underline">
          View live page →
        </Link>
        <button
          type="submit"
          disabled={isPending || !!jsonError}
          className="px-6 py-2.5 rounded-lg font-semibold text-white text-sm transition-opacity disabled:opacity-50"
          style={{ backgroundColor: '#EF4923' }}
        >
          {isPending ? 'Saving...' : 'Save & Revalidate'}
        </button>
      </div>

      <p className="text-xs text-gray-400 text-right">
        Last updated:{' '}
        {new Date(page.updated_at).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })}
      </p>
    </form>
  );
}

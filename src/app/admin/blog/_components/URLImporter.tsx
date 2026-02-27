'use client';

import { useState, useTransition } from 'react';
import { importBlogFromUrlAction } from '../../actions';
import type { BlogBlock } from './blog-block-types';

interface URLImporterProps {
  onImport: (data: {
    title: string;
    metaDescription: string;
    canonicalUrl: string;
    featuredImage: string;
    blocks: BlogBlock[];
    excerpt: string;
    author: string;
  }) => void;
}

export function URLImporter({ onImport }: URLImporterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleImport() {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const result = await importBlogFromUrlAction(url.trim());
        if (!result.success) {
          setError(result.error || 'Import failed');
          return;
        }

        onImport({
          title: result.data!.title,
          metaDescription: result.data!.metaDescription,
          canonicalUrl: result.data!.canonicalUrl,
          featuredImage: result.data!.featuredImage,
          blocks: result.data!.blocks as BlogBlock[],
          excerpt: result.data!.excerpt,
          author: result.data!.author,
        });

        setSuccess(`Imported "${result.data!.title}" — ${result.data!.blocks.length} blocks`);
        setUrl('');
        setTimeout(() => {
          setIsOpen(false);
          setSuccess('');
        }, 2000);
      } catch (e) {
        setError('Unexpected error during import');
        console.error(e);
      }
    });
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
      >
        <span>🔗</span> Import from URL
      </button>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
          <span>🔗</span> Import from WordPress URL
        </h3>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setError('');
            setSuccess('');
          }}
          className="text-blue-400 hover:text-blue-600 text-sm"
        >
          ✕ Close
        </button>
      </div>

      <p className="text-xs text-blue-600">
        Paste a Spyglass blog URL to automatically import content, headings, images, and metadata into the block editor.
      </p>

      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://spyglassrealty.com/blog/your-post-slug"
          className="flex-1 px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleImport();
            }
          }}
        />
        <button
          type="button"
          onClick={handleImport}
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {isPending ? (
            <span className="flex items-center gap-1.5">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Importing...
            </span>
          ) : (
            'Import'
          )}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          ❌ {error}
        </p>
      )}
      {success && (
        <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          ✅ {success}
        </p>
      )}
    </div>
  );
}

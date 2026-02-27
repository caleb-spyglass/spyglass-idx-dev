'use client';

import { useState, useTransition } from 'react';
import { importBlogFromUrlAction, importBlogFromHtmlAction } from '../../actions';
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
  const [mode, setMode] = useState<'url' | 'html'>('url');
  const [url, setUrl] = useState('');
  const [htmlInput, setHtmlInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleImport() {
    if (mode === 'url' && !url.trim()) {
      setError('Please enter a URL');
      return;
    }
    if (mode === 'html' && !htmlInput.trim()) {
      setError('Please paste the HTML source');
      return;
    }

    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const result = mode === 'url'
          ? await importBlogFromUrlAction(url.trim())
          : await importBlogFromHtmlAction(htmlInput.trim(), url.trim() || undefined);

        if (!result.success) {
          setError(result.error || 'Import failed');
          return;
        }

        if (!result.data!.blocks.length) {
          setError(`Page fetched but 0 content blocks found. The page may be JavaScript-rendered or the content structure wasn't recognized. Try "Paste HTML" mode instead.`);
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
        setHtmlInput('');
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
          <span>🔗</span> Import Blog Content
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

      {/* Mode toggle */}
      <div className="flex gap-1 bg-blue-100 rounded-lg p-0.5">
        <button
          type="button"
          onClick={() => { setMode('url'); setError(''); }}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            mode === 'url'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-blue-500 hover:text-blue-700'
          }`}
        >
          Fetch from URL
        </button>
        <button
          type="button"
          onClick={() => { setMode('html'); setError(''); }}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            mode === 'html'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-blue-500 hover:text-blue-700'
          }`}
        >
          Paste HTML
        </button>
      </div>

      {mode === 'url' ? (
        <>
          <p className="text-xs text-blue-600">
            Paste a blog URL to automatically import content, headings, images, and metadata.
          </p>
          <div className="flex gap-2">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://spyglassrealty.com/blog/your-post-slug.html"
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
              {isPending ? 'Importing...' : 'Import'}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-xs text-blue-600">
            If URL fetch fails (403/blocked), right-click the blog page → &quot;View Page Source&quot; → copy all → paste below.
          </p>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Source URL (optional, for canonical)"
            className="w-full px-3 py-1.5 border border-blue-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          />
          <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            placeholder="Paste the full HTML source here..."
            rows={6}
            className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white font-mono text-xs"
          />
          <button
            type="button"
            onClick={handleImport}
            disabled={isPending}
            className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Parsing...' : 'Parse HTML'}
          </button>
        </>
      )}

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

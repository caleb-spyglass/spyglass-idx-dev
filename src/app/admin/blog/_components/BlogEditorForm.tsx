'use client';

import { useState, useTransition, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveBlogPostAction } from '../../actions';
import type { CmsBlogPost } from '@/lib/admin-db';
import { BlogBlockEditor } from './BlogBlockEditor';
import { SEOPanel } from './SEOPanel';
import { URLImporter } from './URLImporter';
import {
  type BlogBlock,
  blocksToHtml,
  htmlToBlocks,
  estimateReadingTime,
} from './blog-block-types';

interface BlogEditorFormProps {
  post?: CmsBlogPost;
  isNew?: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const BASE_URL = 'https://spyglassrealty.com';

export function BlogEditorForm({ post, isNew = false }: BlogEditorFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Core fields
  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!isNew);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image ?? '');
  const [author, setAuthor] = useState(post?.author ?? '');
  const [category, setCategory] = useState(post?.category ?? '');
  const [tags, setTags] = useState(post?.tags?.join(', ') ?? '');
  const [isPublished, setIsPublished] = useState(post?.is_published ?? false);

  // SEO fields
  const [metaDescription, setMetaDescription] = useState(post?.excerpt ?? '');
  const [canonicalUrl, setCanonicalUrl] = useState(
    post?.slug ? `${BASE_URL}/blog/${post.slug}` : ''
  );

  // Block-based content — parse existing HTML content into blocks on mount
  const [blocks, setBlocks] = useState<BlogBlock[]>(() => {
    if (post?.content) {
      const parsed = htmlToBlocks(post.content);
      return parsed.length > 0 ? parsed : [];
    }
    return [];
  });

  // Computed reading time
  const readingTime = useMemo(() => estimateReadingTime(blocks), [blocks]);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugManuallyEdited) {
      const newSlug = slugify(val);
      setSlug(newSlug);
      setCanonicalUrl(`${BASE_URL}/blog/${newSlug}`);
    }
  }

  function handleSlugChange(val: string) {
    setSlug(val);
    setSlugManuallyEdited(true);
    setCanonicalUrl(`${BASE_URL}/blog/${val}`);
  }

  const handleImport = useCallback(
    (data: {
      title: string;
      metaDescription: string;
      canonicalUrl: string;
      featuredImage: string;
      blocks: BlogBlock[];
      excerpt: string;
      author: string;
    }) => {
      setTitle(data.title);
      setSlug(slugify(data.title));
      setSlugManuallyEdited(false);
      setMetaDescription(data.metaDescription);
      setCanonicalUrl(data.canonicalUrl || `${BASE_URL}/blog/${slugify(data.title)}`);
      setFeaturedImage(data.featuredImage);
      setBlocks(data.blocks);
      setExcerpt(data.excerpt);
      if (data.author) setAuthor(data.author);
    },
    []
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setErrorMsg('Title and slug are required.');
      setSaveStatus('error');
      return;
    }

    setSaveStatus('saving');

    // Convert blocks to HTML for storage
    const htmlContent = blocksToHtml(blocks);

    const formData = new FormData();
    if (post?.id) formData.set('id', String(post.id));
    formData.set('slug', slug);
    formData.set('title', title);
    formData.set('content', htmlContent);
    formData.set('excerpt', excerpt || metaDescription);
    formData.set('featured_image', featuredImage);
    formData.set('author', author);
    formData.set('category', category);
    formData.set('tags', tags);
    formData.set('is_published', String(isPublished));

    startTransition(async () => {
      const result = await saveBlogPostAction(formData);
      if (!result.success) {
        setErrorMsg(result.error ?? 'Save failed');
        setSaveStatus('error');
      } else {
        setSaveStatus('saved');
        if (isNew && result.slug) {
          router.push(`/admin/blog/${result.slug}`);
        } else {
          setTimeout(() => setSaveStatus('idle'), 3000);
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status bar */}
      {saveStatus === 'saved' && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Saved and revalidated!
          {isPublished && (
            <Link
              href={`/blog/${slug}`}
              target="_blank"
              className="underline font-medium"
            >
              View post →
            </Link>
          )}
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {errorMsg || 'Save failed. Try again.'}
        </div>
      )}

      {/* URL Import */}
      <URLImporter onImport={handleImport} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#EF4923] focus:border-[#EF4923]"
                placeholder="Post title"
                required
              />
              {/* Title character counter */}
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-gray-400">SEO title length</span>
                <span
                  className={
                    title.length >= 30 && title.length <= 65
                      ? 'text-green-600 font-medium'
                      : title.length > 65
                      ? 'text-red-500 font-medium'
                      : 'text-amber-500 font-medium'
                  }
                >
                  {title.length}/65
                  {title.length >= 30 && title.length <= 65 && ' ✓'}
                  {title.length > 65 && ' (too long)'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Slug <span className="text-red-500">*</span>
                <span className="text-gray-400 font-normal ml-1">(/blog/slug)</span>
              </label>
              <input
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#EF4923] focus:border-[#EF4923]"
                placeholder="post-slug"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#EF4923] focus:border-[#EF4923] resize-y"
                placeholder="Short summary shown in blog listings..."
              />
            </div>
          </div>

          {/* Block-based Content Editor */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <BlogBlockEditor blocks={blocks} onChange={setBlocks} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Publish */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm">Publish</h3>

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
              <span className="text-sm text-gray-700">
                {isPublished ? 'Published' : 'Draft'}
              </span>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 rounded-lg font-semibold text-white text-sm transition-opacity disabled:opacity-50"
              style={{ backgroundColor: '#EF4923' }}
            >
              {isPending ? 'Saving...' : isNew ? 'Create Post' : 'Save & Revalidate'}
            </button>
          </div>

          {/* SEO Panel */}
          <SEOPanel
            title={title}
            metaDescription={metaDescription}
            onMetaDescriptionChange={setMetaDescription}
            canonicalUrl={canonicalUrl}
            onCanonicalUrlChange={setCanonicalUrl}
            publishDate={post?.published_at ?? null}
            modifiedDate={post?.updated_at ?? null}
            readingTime={readingTime}
          />

          {/* Meta / Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm">Details</h3>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Author</label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#EF4923] focus:border-[#EF4923]"
                placeholder="Author name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Category</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#EF4923] focus:border-[#EF4923]"
                placeholder="e.g. Market Updates"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Tags <span className="text-gray-400 font-normal">(comma-separated)</span>
              </label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#EF4923] focus:border-[#EF4923]"
                placeholder="austin, real estate, buying"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Featured Image URL
              </label>
              <input
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#EF4923] focus:border-[#EF4923]"
                placeholder="https://..."
                type="url"
              />
              {featuredImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featuredImage}
                  alt="Featured"
                  className="mt-2 w-full h-32 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>
          </div>

          {/* Last updated */}
          {post && (
            <div className="text-xs text-gray-400 text-right">
              Last updated:{' '}
              {new Date(post.updated_at).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

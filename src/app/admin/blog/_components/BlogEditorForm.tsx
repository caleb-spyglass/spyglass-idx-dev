'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveBlogPostAction } from '../../actions';
import type { CmsBlogPost } from '@/lib/admin-db';

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

export function BlogEditorForm({ post, isNew = false }: BlogEditorFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!isNew);
  const [content, setContent] = useState(post?.content ?? '');
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image ?? '');
  const [author, setAuthor] = useState(post?.author ?? '');
  const [category, setCategory] = useState(post?.category ?? '');
  const [tags, setTags] = useState(post?.tags?.join(', ') ?? '');
  const [isPublished, setIsPublished] = useState(post?.is_published ?? false);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugManuallyEdited) {
      setSlug(slugify(val));
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setErrorMsg('Title and slug are required.');
      setSaveStatus('error');
      return;
    }

    setSaveStatus('saving');
    const formData = new FormData();
    if (post?.id) formData.set('id', String(post.id));
    formData.set('slug', slug);
    formData.set('title', title);
    formData.set('content', content);
    formData.set('excerpt', excerpt);
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
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Saved and revalidated!
          {isPublished && (
            <Link href={`/blog/${slug}`} target="_blank" className="underline font-medium">
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
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Slug <span className="text-red-500">*</span>
                <span className="text-gray-400 font-normal ml-1">(/blog/slug)</span>
              </label>
              <input
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugManuallyEdited(true);
                }}
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

          {/* Content */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Content</label>
              <span className="text-xs text-gray-400">HTML or plain text</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={24}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#EF4923] focus:border-[#EF4923] resize-y font-mono"
              placeholder="<p>Write your blog post content here...</p>"
            />
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

          {/* Meta */}
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
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Featured Image URL</label>
              <input
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#EF4923] focus:border-[#EF4923]"
                placeholder="https://..."
                type="url"
              />
              {featuredImage && (
                <img
                  src={featuredImage}
                  alt="Featured"
                  className="mt-2 w-full h-32 object-cover rounded-lg border border-gray-200"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
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

import Link from 'next/link';
import { getBlogPosts } from '@/lib/admin-db';
import { DeleteButton } from './_components/DeleteButton';

export default async function BlogManager() {
  let posts: Awaited<ReturnType<typeof getBlogPosts>> = [];
  let error: string | null = null;

  try {
    posts = await getBlogPosts();
  } catch {
    error = 'CMS tables not initialized.';
  }

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
            <p className="text-gray-500 text-sm mt-1">
              Create, edit, and publish blog posts
            </p>
          </div>
          <Link
            href="/admin/blog/new"
            className="px-4 py-2.5 rounded-lg font-semibold text-white text-sm"
            style={{ backgroundColor: '#EF4923' }}
          >
            + New Post
          </Link>
        </div>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-sm text-yellow-800">
            {error} Go to{' '}
            <Link href="/admin" className="underline">Dashboard</Link>{' '}
            to initialize.
          </div>
        )}

        {/* Posts table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-700">
              {posts.length} posts
            </span>
          </div>

          {posts.length === 0 && !error ? (
            <div className="px-5 py-12 text-center">
              <p className="text-gray-400 text-sm mb-4">No blog posts yet.</p>
              <Link
                href="/admin/blog/new"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: '#EF4923' }}
              >
                Create your first post
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Title</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Category</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Date</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-900">{post.title}</div>
                      <div className="text-xs text-gray-400 font-mono">/blog/{post.slug}</div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">
                      {post.category || '—'}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          post.is_published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {post.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Not published'}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {post.is_published && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="text-xs text-gray-400 hover:text-gray-600"
                          >
                            View
                          </Link>
                        )}
                        <Link
                          href={`/admin/blog/${post.slug}`}
                          className="text-xs font-medium text-[#EF4923] hover:underline"
                        >
                          Edit
                        </Link>
                        <DeleteButton id={post.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

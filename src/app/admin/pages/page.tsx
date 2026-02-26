import Link from 'next/link';
import { getAllPages, initCmsTables, seedPages } from '@/lib/admin-db';

function slugToParam(slug: string): string {
  if (slug === '/') return 'home';
  return slug.replace(/^\//, '');
}

export default async function PagesManager() {
  let pages: Awaited<ReturnType<typeof getAllPages>> = [];
  let error: string | null = null;

  try {
    pages = await getAllPages();
  } catch {
    error = 'CMS tables not initialized. Click Initialize below.';
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
            <p className="text-gray-500 text-sm mt-1">
              Edit content and metadata for all frontend pages
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-sm text-yellow-800">
            {error} Go to{' '}
            <Link href="/admin" className="underline">
              Dashboard
            </Link>{' '}
            to initialize.
          </div>
        )}

        {/* Pages table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {pages.length} pages
            </span>
          </div>

          {pages.length === 0 && !error ? (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">
              No pages found. Initialize the CMS to seed all pages.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Title</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Slug</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Updated</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">{page.title}</td>
                    <td className="px-5 py-3 text-gray-500 font-mono text-xs">{page.slug}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          page.is_published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {page.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {new Date(page.updated_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/pages/${slugToParam(page.slug)}`}
                        className="text-xs font-medium text-[#EF4923] hover:underline"
                      >
                        Edit
                      </Link>
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

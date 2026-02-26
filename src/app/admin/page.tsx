import Link from 'next/link';
import { initCmsAction } from './actions';

async function getDashboardStats() {
  try {
    const { getAllPages, getBlogPosts } = await import('@/lib/admin-db');
    const [pages, posts] = await Promise.all([getAllPages(), getBlogPosts()]);
    return {
      totalPages: pages.length,
      publishedPages: pages.filter((p) => p.is_published).length,
      totalPosts: posts.length,
      publishedPosts: posts.filter((p) => p.is_published).length,
      recentPages: pages
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 5),
      recentPosts: posts.slice(0, 5),
    };
  } catch {
    return null;
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your site content</p>
          </div>
          <form action={initCmsAction}>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Initialize / Re-seed DB
            </button>
          </form>
        </div>

        {/* Stats cards */}
        {stats ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Total Pages"
                value={stats.totalPages}
                sub={`${stats.publishedPages} published`}
              />
              <StatCard
                label="Blog Posts"
                value={stats.totalPosts}
                sub={`${stats.publishedPosts} published`}
              />
              <StatCard
                label="Site Status"
                value="Live"
                sub="Frontend active"
                accent
              />
              <StatCard
                label="Revalidation"
                value="On-demand"
                sub="Instant updates"
                accent
              />
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Recent pages */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900 text-sm">Recently Updated Pages</h2>
                  <Link href="/admin/pages" className="text-xs text-[#EF4923] hover:underline">
                    View all
                  </Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {stats.recentPages.length === 0 ? (
                    <p className="px-5 py-4 text-sm text-gray-400">No pages yet</p>
                  ) : (
                    stats.recentPages.map((page) => (
                      <Link
                        key={page.slug}
                        href={`/admin/pages/${slugToParam(page.slug)}`}
                        className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-sm text-gray-700 font-medium">{page.title}</span>
                        <span className="text-xs text-gray-400">{page.slug}</span>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* Recent blog posts */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900 text-sm">Recent Blog Posts</h2>
                  <Link href="/admin/blog" className="text-xs text-[#EF4923] hover:underline">
                    View all
                  </Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {stats.recentPosts.length === 0 ? (
                    <p className="px-5 py-4 text-sm text-gray-400">No blog posts yet</p>
                  ) : (
                    stats.recentPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/admin/blog/${post.slug}`}
                        className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-sm text-gray-700 font-medium">{post.title}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            post.is_published
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {post.is_published ? 'Published' : 'Draft'}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Quick edit popular pages */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 text-sm">Quick Edit Pages</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px bg-gray-100">
                {[
                  { label: 'Home', param: 'home' },
                  { label: 'About', param: 'about' },
                  { label: 'Buy', param: 'buy' },
                  { label: 'Sell', param: 'sell' },
                  { label: 'Contact', param: 'contact' },
                  { label: 'Cash Offer', param: 'cash-offer' },
                  { label: 'Reviews', param: 'reviews' },
                  { label: 'Services', param: 'services' },
                  { label: 'Agents', param: 'agents' },
                  { label: 'Blog', param: 'blog' },
                ].map((page) => (
                  <Link
                    key={page.param}
                    href={`/admin/pages/${page.param}`}
                    className="bg-white px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#EF4923] transition-colors"
                  >
                    {page.label}
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500 mb-4">CMS tables not initialized yet.</p>
            <form action={initCmsAction}>
              <button
                type="submit"
                className="px-6 py-3 rounded-lg font-semibold text-white text-sm"
                style={{ backgroundColor: '#EF4923' }}
              >
                Initialize CMS Database
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string | number;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className={`text-2xl font-bold mb-1 ${accent ? 'text-[#EF4923]' : 'text-gray-900'}`}>
        {value}
      </div>
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
    </div>
  );
}

function slugToParam(slug: string): string {
  if (slug === '/') return 'home';
  return slug.replace(/^\//, '');
}

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/home/Footer';

const MISSION_CONTROL_URL = process.env.NEXT_PUBLIC_MISSION_CONTROL_URL || 'https://missioncontrol-tjfm.onrender.com';

// ── Types ──────────────────────────────────────────────────────────────

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImageUrl?: string;
  publishedAt: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  tags: string[];
  readingTime?: number;
  viewCount: number;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface BlogListResponse {
  posts: BlogPost[];
}

interface BlogCategoriesResponse {
  categories: BlogCategory[];
}

// ── Data Fetching ─────────────────────────────────────────────────────

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${MISSION_CONTROL_URL}/api/blog/posts?page=1&limit=12`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });
    
    if (!res.ok) {
      console.error('Failed to fetch blog posts:', res.status, res.statusText);
      return [];
    }
    
    const data: BlogListResponse = await res.json();
    return data.posts || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const res = await fetch(`${MISSION_CONTROL_URL}/api/blog/categories`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (!res.ok) {
      console.error('Failed to fetch blog categories:', res.status, res.statusText);
      return [];
    }
    
    const data: BlogCategoriesResponse = await res.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
}

// ── Metadata ──────────────────────────────────────────────────────────

export const metadata = {
  title: 'Austin Real Estate Blog | Market Insights & Home Buying Tips | Spyglass Realty',
  description: 'Stay informed with expert real estate insights from Spyglass Realty. Get Austin market updates, home buying tips, selling strategies, and neighborhood guides from our experienced agents.',
  keywords: 'Austin real estate blog, Austin market updates, home buying tips, selling tips, Austin neighborhoods, real estate advice, market trends, Spyglass Realty',
  openGraph: {
    title: 'Austin Real Estate Blog | Spyglass Realty',
    description: 'Expert real estate insights, market updates, and home buying tips from Austin\'s top real estate team.',
    type: 'website',
    url: 'https://spyglass-idx.vercel.app/blog',
    siteName: 'Spyglass Realty',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Austin Real Estate Blog | Spyglass Realty',
    description: 'Expert real estate insights, market updates, and home buying tips from Austin\'s top real estate team.',
  },
};

// ── Component ─────────────────────────────────────────────────────────

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getBlogPosts(),
    getBlogCategories(),
  ]);

  const featuredPosts = posts.slice(0, 3);
  const regularPosts = posts.slice(3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getExcerpt = (post: BlogPost) => {
    return post.excerpt || `Learn more about ${post.title.toLowerCase()} and get expert insights from our Austin real estate team.`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-spyglass-dark to-spyglass-charcoal text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Austin Real Estate{' '}
              <span className="text-spyglass-orange">Insights</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Stay ahead of the market with expert insights, neighborhood guides, 
              and actionable tips from Austin&apos;s premier real estate team.
            </p>
            
            {/* Category Pills */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/blog/category/${category.slug}`}
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Articles</h2>
              <p className="text-lg text-gray-600">
                Our most popular and timely insights
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <article key={post.id} className={`group ${index === 0 ? 'lg:col-span-2' : ''}`}>
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      {/* Featured Image */}
                      <div className={`relative bg-gray-200 ${index === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'} overflow-hidden`}>
                        {post.featuredImageUrl ? (
                          <img
                            src={post.featuredImageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-spyglass-orange/20 to-spyglass-charcoal/20 flex items-center justify-center">
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <time dateTime={post.publishedAt}>
                            {formatDate(post.publishedAt)}
                          </time>
                          {post.readingTime && (
                            <>
                              <span>•</span>
                              <span>{post.readingTime} min read</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{post.viewCount} views</span>
                        </div>
                        
                        <h3 className={`font-bold text-gray-900 group-hover:text-spyglass-orange transition-colors mb-3 ${index === 0 ? 'text-2xl' : 'text-xl'}`}>
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {getExcerpt(post)}
                        </p>
                        
                        {/* Author & Tags */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {post.authorAvatar ? (
                              <img
                                src={post.authorAvatar}
                                alt={post.authorName}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-spyglass-orange/20 rounded-full flex items-center justify-center">
                                <span className="text-spyglass-orange text-sm font-medium">
                                  {post.authorName.charAt(0)}
                                </span>
                              </div>
                            )}
                            <span className="text-sm font-medium text-gray-700">
                              {post.authorName}
                            </span>
                          </div>
                          
                          {post.tags.length > 0 && (
                            <div className="flex gap-2">
                              {post.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Posts Grid */}
      {regularPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Articles</h2>
              <p className="text-lg text-gray-600">
                Stay informed with our latest real estate insights
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <article key={post.id} className="group">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      {/* Featured Image */}
                      <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                        {post.featuredImageUrl ? (
                          <img
                            src={post.featuredImageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-spyglass-orange/20 to-spyglass-charcoal/20 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <time dateTime={post.publishedAt}>
                            {formatDate(post.publishedAt)}
                          </time>
                          {post.readingTime && (
                            <>
                              <span>•</span>
                              <span>{post.readingTime} min read</span>
                            </>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-spyglass-orange transition-colors mb-3">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {getExcerpt(post)}
                        </p>
                        
                        {/* Author & Tags */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {post.authorAvatar ? (
                              <img
                                src={post.authorAvatar}
                                alt={post.authorName}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-spyglass-orange/20 rounded-full flex items-center justify-center">
                                <span className="text-spyglass-orange text-sm font-medium">
                                  {post.authorName.charAt(0)}
                                </span>
                              </div>
                            )}
                            <span className="text-sm font-medium text-gray-700">
                              {post.authorName}
                            </span>
                          </div>
                          
                          {post.tags.length > 0 && (
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                              {post.tags[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
            
            {/* Load More Button (placeholder for future pagination) */}
            <div className="text-center mt-12">
              <button className="bg-spyglass-orange hover:bg-spyglass-orange-hover text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors">
                Load More Articles
              </button>
            </div>
          </div>
        </section>
      )}

      {/* No Posts State */}
      {posts.length === 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-lg text-gray-600 mb-8">
              We&apos;re working on bringing you the latest Austin real estate insights and market updates. 
              Check back soon for expert tips on buying, selling, and investing in Austin real estate.
            </p>
            <Link 
              href="/contact"
              className="bg-spyglass-orange hover:bg-spyglass-orange-hover text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors inline-block"
            >
              Contact Us for Insights
            </Link>
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <section className="py-16 bg-spyglass-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
          <p className="text-xl text-gray-300 mb-8">
            Get the latest Austin real estate insights delivered straight to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button className="bg-spyglass-orange hover:bg-spyglass-orange-hover text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
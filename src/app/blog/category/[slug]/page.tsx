export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
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
  metaTitle?: string;
  metaDescription?: string;
}

interface CategoryPostsResponse {
  posts: BlogPost[];
  category: BlogCategory;
  totalPosts: number;
}

interface BlogCategoriesResponse {
  categories: BlogCategory[];
}

// ── Data Fetching ─────────────────────────────────────────────────────

async function getCategoryPosts(categorySlug: string, page: number = 1): Promise<CategoryPostsResponse | null> {
  try {
    // For now, we'll get all posts and filter client-side
    // In a real implementation, you'd pass the category parameter to the API
    const res = await fetch(`${MISSION_CONTROL_URL}/api/blog/posts?page=${page}&limit=12`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });
    
    if (!res.ok) {
      console.error('Failed to fetch category posts:', res.status, res.statusText);
      return null;
    }
    
    const data = await res.json();
    const posts = data.posts || [];
    
    // Get category info from categories endpoint
    const categoriesRes = await fetch(`${MISSION_CONTROL_URL}/api/blog/categories`, {
      next: { revalidate: 3600 },
    });
    
    let category: BlogCategory | null = null;
    if (categoriesRes.ok) {
      const categoriesData: BlogCategoriesResponse = await categoriesRes.json();
      category = categoriesData.categories.find(cat => cat.slug === categorySlug) || null;
    }
    
    if (!category) {
      return null;
    }
    
    // TODO: In a real implementation, the API would filter posts by category
    // For now, we'll return all posts as if they belong to this category
    
    return {
      posts,
      category,
      totalPosts: posts.length,
    };
  } catch (error) {
    console.error('Error fetching category posts:', error);
    return null;
  }
}

async function getAllCategories(): Promise<BlogCategory[]> {
  try {
    const res = await fetch(`${MISSION_CONTROL_URL}/api/blog/categories`, {
      next: { revalidate: 3600 },
    });
    
    if (!res.ok) {
      return [];
    }
    
    const data: BlogCategoriesResponse = await res.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// ── Metadata Generation ───────────────────────────────────────────────

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const categoryData = await getCategoryPosts(params.slug);
  
  if (!categoryData) {
    return {
      title: 'Category Not Found | Spyglass Realty Blog',
      description: 'The blog category you are looking for could not be found.',
    };
  }

  const { category } = categoryData;
  const title = category.metaTitle || `${category.name} | Austin Real Estate Blog | Spyglass Realty`;
  const description = category.metaDescription || category.description || 
    `Read the latest ${category.name.toLowerCase()} articles from Spyglass Realty. Expert Austin real estate insights and advice.`;

  return {
    title,
    description,
    keywords: `${category.name}, Austin real estate, Spyglass Realty, ${category.name.toLowerCase()} blog`,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://spyglass-idx.vercel.app/blog/category/${category.slug}`,
      siteName: 'Spyglass Realty',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

// ── Component ─────────────────────────────────────────────────────────

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const [categoryData, allCategories] = await Promise.all([
    getCategoryPosts(params.slug),
    getAllCategories(),
  ]);

  if (!categoryData) {
    notFound();
  }

  const { posts, category, totalPosts } = categoryData;

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
      
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-spyglass-orange">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/blog" className="text-gray-500 hover:text-spyglass-orange">
              Blog
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">
              {category.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-xl text-gray-600 mb-8">
                {category.description}
              </p>
            )}
            
            {/* Stats */}
            <div className="flex items-center gap-6 text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <span>{totalPosts} article{totalPosts !== 1 ? 's' : ''}</span>
              </div>
            </div>
            
            {/* Other Categories */}
            {allCategories.length > 1 && (
              <div className="mt-8">
                <p className="text-sm font-medium text-gray-700 mb-3">Other Categories:</p>
                <div className="flex flex-wrap gap-3">
                  {allCategories
                    .filter(cat => cat.slug !== category.slug)
                    .map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/blog/category/${cat.slug}`}
                        className="bg-gray-100 hover:bg-spyglass-orange hover:text-white text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="group">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full">
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
                      <div className="p-6 flex flex-col h-full">
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
                        
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-spyglass-orange transition-colors mb-3">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                          {getExcerpt(post)}
                        </p>
                        
                        {/* Author & Tags */}
                        <div className="flex items-center justify-between mt-auto">
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
            {posts.length >= 12 && (
              <div className="text-center mt-12">
                <button className="bg-spyglass-orange hover:bg-spyglass-orange-hover text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors">
                  Load More Articles
                </button>
              </div>
            )}
          </div>
        </section>
      ) : (
        /* No Posts State */
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No Articles Yet</h2>
            <p className="text-lg text-gray-600 mb-8">
              We haven&apos;t published any articles in the {category.name} category yet. 
              Check back soon for expert insights on {category.name.toLowerCase()}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/blog"
                className="bg-spyglass-orange hover:bg-spyglass-orange-hover text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                View All Articles
              </Link>
              <Link 
                href="/contact"
                className="border-2 border-spyglass-orange text-spyglass-orange hover:bg-spyglass-orange hover:text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                Contact Us for Insights
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Categories (if posts exist) */}
      {posts.length > 0 && allCategories.length > 1 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Other Topics</h2>
              <p className="text-lg text-gray-600">
                Discover more insights across our blog categories
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCategories
                .filter(cat => cat.slug !== category.slug)
                .slice(0, 6)
                .map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/blog/category/${cat.slug}`}
                    className="group"
                  >
                    <div className="bg-gray-50 hover:bg-spyglass-orange rounded-xl p-6 transition-colors">
                      <div className="w-12 h-12 bg-spyglass-orange/20 group-hover:bg-white/20 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-spyglass-orange group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-white mb-2">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="text-gray-600 group-hover:text-white/80 text-sm line-clamp-2">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <section className="py-16 bg-spyglass-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
          <p className="text-xl text-gray-300 mb-8">
            Get the latest {category.name.toLowerCase()} insights delivered straight to your inbox
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
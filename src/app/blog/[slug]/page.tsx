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
  content: string;
  excerpt?: string;
  featuredImageUrl?: string;
  ogImageUrl?: string;
  publishedAt: string;
  authorId: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  tableOfContents?: Array<{ id: string; title: string; level: number }>;
  ctaConfig?: {
    enabled: boolean;
    title?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  readingTime?: number;
  viewCount: number;
  author: {
    id: string;
    name: string;
    email?: string;
    bio?: string;
    avatarUrl?: string;
    socialLinks?: {
      twitter?: string;
      linkedin?: string;
      facebook?: string;
      instagram?: string;
      website?: string;
    };
  };
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

interface BlogPostResponse {
  post: BlogPost;
}

interface RelatedPostsResponse {
  posts: BlogPost[];
}

// ── Data Fetching ─────────────────────────────────────────────────────

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${MISSION_CONTROL_URL}/api/blog/posts/${slug}`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });
    
    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      console.error('Failed to fetch blog post:', res.status, res.statusText);
      return null;
    }
    
    const data: BlogPostResponse = await res.json();
    return data.post;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

async function getRelatedPosts(currentSlug: string): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${MISSION_CONTROL_URL}/api/blog/posts?limit=3`, {
      next: { revalidate: 300 },
    });
    
    if (!res.ok) {
      return [];
    }
    
    const data: RelatedPostsResponse = await res.json();
    // Filter out current post and return max 3
    return data.posts.filter(post => post.slug !== currentSlug).slice(0, 3);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

// ── Metadata Generation ───────────────────────────────────────────────

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | Spyglass Realty Blog',
      description: 'The blog post you are looking for could not be found.',
    };
  }

  const title = post.metaTitle || `${post.title} | Spyglass Realty Blog`;
  const description = post.metaDescription || post.excerpt || `Read "${post.title}" on the Spyglass Realty blog for expert Austin real estate insights.`;
  const canonicalUrl = post.canonicalUrl || `https://spyglass-idx.vercel.app/blog/${post.slug}`;
  const ogImageUrl = post.ogImageUrl || post.featuredImageUrl || '/images/og-default-blog.jpg';

  return {
    title,
    description,
    keywords: post.tags.join(', ') + ', Austin real estate, Spyglass Realty',
    authors: [{ name: post.author.name }],
    publishedTime: post.publishedAt,
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonicalUrl,
      siteName: 'Spyglass Realty',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      authors: [post.author.name],
      publishedTime: post.publishedAt,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

// ── Component ─────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, relatedPosts] = await Promise.all([
    getBlogPost(params.slug),
    getRelatedPosts(params.slug),
  ]);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const generateTOC = () => {
    if (!post.tableOfContents || post.tableOfContents.length === 0) {
      return null;
    }

    return (
      <nav className="bg-gray-50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h3>
        <ul className="space-y-2">
          {post.tableOfContents.map((item) => (
            <li key={item.id} style={{ marginLeft: `${(item.level - 1) * 1}rem` }}>
              <a
                href={`#${item.id}`}
                className="text-sm text-gray-600 hover:text-spyglass-orange transition-colors"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt || post.metaDescription,
    "image": post.featuredImageUrl || post.ogImageUrl,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "url": post.author.socialLinks?.website,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Spyglass Realty",
      "logo": {
        "@type": "ImageObject",
        "url": "https://spyglass-idx.vercel.app/images/logo.png"
      }
    },
    "datePublished": post.publishedAt,
    "dateModified": post.publishedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://spyglass-idx.vercel.app/blog/${post.slug}`
    },
    "keywords": post.tags.join(", "),
    "articleSection": post.categories.map(cat => cat.name).join(", "),
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        {/* Breadcrumbs */}
        <div className="bg-gray-50 py-4">
          <div className="max-w-4xl mx-auto px-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-spyglass-orange">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/blog" className="text-gray-500 hover:text-spyglass-orange">
                Blog
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium truncate">
                {post.title}
              </span>
            </nav>
          </div>
        </div>

        <main className="flex-1">
          {/* Article Header */}
          <header className="bg-white py-12">
            <div className="max-w-4xl mx-auto px-4">
              {/* Categories */}
              {post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/blog/category/${category.slug}`}
                      className="bg-spyglass-orange/10 text-spyglass-orange hover:bg-spyglass-orange hover:text-white px-3 py-1 rounded-full text-sm font-medium transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
                {/* Author */}
                <div className="flex items-center gap-3">
                  {post.author.avatarUrl ? (
                    <img
                      src={post.author.avatarUrl}
                      alt={post.author.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-spyglass-orange/20 rounded-full flex items-center justify-center">
                      <span className="text-spyglass-orange text-lg font-medium">
                        {post.author.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{post.author.name}</p>
                    <p className="text-sm text-gray-500">Real Estate Expert</p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <time dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt)}
                  </time>
                </div>

                {/* Reading Time */}
                {post.readingTime && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{post.readingTime} min read</span>
                  </div>
                )}

                {/* View Count */}
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{post.viewCount.toLocaleString()} views</span>
                </div>
              </div>

              {/* Featured Image */}
              {post.featuredImageUrl && (
                <div className="aspect-[16/9] rounded-xl overflow-hidden mb-8">
                  <img
                    src={post.featuredImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </header>

          {/* Article Content */}
          <section className="py-8">
            <div className="max-w-4xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Table of Contents (Sidebar on larger screens) */}
                {post.tableOfContents && post.tableOfContents.length > 0 && (
                  <aside className="lg:col-span-1 order-2 lg:order-1">
                    <div className="sticky top-8">
                      {generateTOC()}
                    </div>
                  </aside>
                )}

                {/* Main Content */}
                <article className={`${post.tableOfContents && post.tableOfContents.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'} order-1 lg:order-2`}>
                  <div 
                    className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-a:text-spyglass-orange hover:prose-a:text-spyglass-orange-hover prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-blockquote:border-spyglass-orange prose-blockquote:bg-gray-50 prose-blockquote:rounded-r-lg"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </article>
              </div>
            </div>
          </section>

          {/* Tags */}
          {post.tags.length > 0 && (
            <section className="py-8 border-t bg-gray-50">
              <div className="max-w-4xl mx-auto px-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-white text-gray-700 hover:bg-spyglass-orange hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Author Bio */}
          <section className="py-12 bg-white border-t">
            <div className="max-w-4xl mx-auto px-4">
              <div className="bg-gray-50 rounded-xl p-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Author Avatar */}
                  <div className="flex-shrink-0">
                    {post.author.avatarUrl ? (
                      <img
                        src={post.author.avatarUrl}
                        alt={post.author.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-spyglass-orange/20 rounded-full flex items-center justify-center">
                        <span className="text-spyglass-orange text-2xl font-bold">
                          {post.author.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Author Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{post.author.name}</h3>
                    {post.author.bio && (
                      <p className="text-gray-600 mb-4">{post.author.bio}</p>
                    )}
                    
                    {/* Social Links */}
                    {post.author.socialLinks && (
                      <div className="flex gap-4">
                        {post.author.socialLinks.website && (
                          <a
                            href={post.author.socialLinks.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-spyglass-orange transition-colors"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          </a>
                        )}
                        {post.author.socialLinks.linkedin && (
                          <a
                            href={post.author.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-spyglass-orange transition-colors"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </a>
                        )}
                        {post.author.socialLinks.twitter && (
                          <a
                            href={post.author.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-spyglass-orange transition-colors"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          {post.ctaConfig?.enabled && (
            <section className="py-16 bg-spyglass-charcoal text-white">
              <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  {post.ctaConfig.title || "Ready to Take Action?"}
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  {post.ctaConfig.description || "Let's discuss your real estate goals and how we can help you achieve them."}
                </p>
                <Link
                  href={post.ctaConfig.buttonUrl || "/contact"}
                  className="bg-spyglass-orange hover:bg-spyglass-orange-hover text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors inline-block"
                >
                  {post.ctaConfig.buttonText || "Contact Us"}
                </Link>
              </div>
            </section>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="py-16 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4">
                <div className="mb-12 text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Articles</h2>
                  <p className="text-lg text-gray-600">Continue reading for more insights</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost) => (
                    <article key={relatedPost.id} className="group">
                      <Link href={`/blog/${relatedPost.slug}`} className="block">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                          {/* Featured Image */}
                          <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                            {relatedPost.featuredImageUrl ? (
                              <img
                                src={relatedPost.featuredImageUrl}
                                alt={relatedPost.title}
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
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-spyglass-orange transition-colors mb-3">
                              {relatedPost.title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-3">
                              {relatedPost.excerpt || `Read more about ${relatedPost.title.toLowerCase()}`}
                            </p>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-500">
                                {formatDate(relatedPost.publishedAt)}
                              </span>
                              {relatedPost.readingTime && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-sm text-gray-500">
                                    {relatedPost.readingTime} min read
                                  </span>
                                </>
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
        </main>

        <Footer />
      </div>
    </>
  );
}
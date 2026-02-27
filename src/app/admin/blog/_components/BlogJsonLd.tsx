/**
 * BlogJsonLd — Generates JSON-LD structured data for BlogPosting and BreadcrumbList.
 * This is used both in the admin preview and on the published blog page.
 */

interface BlogJsonLdProps {
  title: string;
  description: string;
  image: string;
  author: string;
  datePublished: string;
  dateModified: string;
  slug: string;
  canonicalUrl?: string;
  tags?: string[];
  category?: string;
}

export function generateBlogPostingSchema({
  title,
  description,
  image,
  author,
  datePublished,
  dateModified,
  slug,
  canonicalUrl,
  tags,
  category,
}: BlogJsonLdProps) {
  const url =
    canonicalUrl || `https://spyglassrealty.com/blog/${slug}`;

  const blogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: image || undefined,
    author: {
      '@type': 'Person',
      name: author || 'Spyglass Realty',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Spyglass Realty',
      logo: {
        '@type': 'ImageObject',
        url: 'https://spyglassrealty.com/images/logo.png',
      },
    },
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: tags?.join(', ') || undefined,
    articleSection: category || undefined,
    url,
  };

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://spyglassrealty.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://spyglassrealty.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: url,
      },
    ],
  };

  return { blogPosting, breadcrumbList };
}

/** React component that renders JSON-LD script tags */
export function BlogJsonLd(props: BlogJsonLdProps) {
  const { blogPosting, breadcrumbList } = generateBlogPostingSchema(props);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPosting),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbList),
        }}
      />
    </>
  );
}

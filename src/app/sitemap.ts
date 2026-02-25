import { MetadataRoute } from 'next';
import { ALL_SEO_SLUGS } from '@/data/seo-url-aliases';

// Community slugs from the scraped content + any communities generateStaticParams pulls
// We dynamically import to avoid build issues
async function getCommunitySlugsList(): Promise<string[]> {
  try {
    const data = await import('@/data/scraped-community-content.json');
    const entries = Array.isArray(data.default) ? data.default : data;
    return [...new Set((entries as { slug: string }[]).map((e) => e.slug))];
  } catch {
    return [];
  }
}

// Zip codes from static data
function getZipCodeSlugs(): string[] {
  // Hardcoded from zip-codes-data.ts to avoid import issues
  return [
    '78613', '78617', '78620', '78628', '78641', '78645', '78652',
    '78701', '78702', '78703', '78704', '78705', '78717', '78721',
    '78722', '78723', '78724', '78726', '78728', '78729', '78730',
    '78731', '78732', '78733', '78734', '78735', '78736', '78737',
    '78738', '78739', '78741', '78744', '78745', '78746', '78747',
    '78748', '78749', '78750', '78751', '78752', '78753', '78754', '78757',
  ];
}

const BASE_URL = 'https://spyglassrealty.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const communitySlugs = await getCommunitySlugsList();
  const zipSlugs = getZipCodeSlugs();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/communities`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/buy`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/sell`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/agents`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/home-value`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/cash-offer`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/home-staging`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/relocation`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/commercial`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/featured-listings`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/mortgage-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/zip-codes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ];

  // SEO slug pages (top-level /[slug] — neighborhoods, cities, condos, etc.)
  const seoPages: MetadataRoute.Sitemap = ALL_SEO_SLUGS.map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Community detail pages (/communities/[slug])
  const communityPages: MetadataRoute.Sitemap = communitySlugs.map((slug) => ({
    url: `${BASE_URL}/communities/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Zip code pages
  const zipPages: MetadataRoute.Sitemap = zipSlugs.map((zip) => ({
    url: `${BASE_URL}/zip-codes/${zip}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...seoPages, ...communityPages, ...zipPages];
}

import { COMMUNITIES } from '@/data/communities-polygons';
import { ZIP_COMMUNITIES, CITY_COMMUNITIES } from '@/data/area-communities';
import CommunitiesClientIsland from '@/components/community/CommunitiesClientIsland';
import { Footer } from '@/components/home/Footer';
import { formatCommunityName } from '@/lib/nearby-communities';
import { getAllCommunityCardMeta } from '@/data/community-card-data';

// Filter to Austin-area communities for the structured data
const AUSTIN_COUNTIES = ['Travis', 'Williamson', 'Hays'];
const austinCommunities = COMMUNITIES.filter((c) => AUSTIN_COUNTIES.includes(c.county));
const uniqueAustin = Array.from(
  new Map(austinCommunities.map((c) => [c.slug, c])).values()
).sort((a, b) => a.name.localeCompare(b.name));

// Build card metadata at build time (hero images, snippets)
const cardMeta = getAllCommunityCardMeta(uniqueAustin.map((c) => c.slug));

export default function CommunitiesPage() {
  // Build ItemList structured data for SEO
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Austin Area Communities',
    description:
      'Neighborhoods and communities in the greater Austin, Texas metropolitan area.',
    numberOfItems: uniqueAustin.length,
    itemListElement: uniqueAustin.slice(0, 100).map((community, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: formatCommunityName(community.name),
      url: `https://search.spyglassrealty.com/communities/${community.slug}`,
      item: {
        '@type': 'Place',
        name: formatCommunityName(community.name),
        address: {
          '@type': 'PostalAddress',
          addressLocality: formatCommunityName(community.name),
          addressRegion: 'TX',
          addressCountry: 'US',
        },
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://search.spyglassrealty.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Communities',
        item: 'https://search.spyglassrealty.com/communities',
      },
    ],
  };

  return (
    <>
      {/* Structured data — server-rendered */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hidden SEO content — visible to crawlers, provides link equity */}
      <div className="sr-only">
        <h1>Austin Area Communities &amp; Neighborhoods</h1>
        <p>
          Explore neighborhoods across Travis County, Williamson County, and Hays County.
          Find homes for sale, market statistics, and neighborhood guides for every Austin community.
        </p>
        <nav aria-label="Community directory">
          <ul>
            {uniqueAustin.map((community) => (
              <li key={community.slug}>
                <a href={`/communities/${community.slug}`}>
                  Homes for Sale in {formatCommunityName(community.name)}, Austin TX
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Zip Code Pages */}
        <h2>Search by Zip Code</h2>
        <nav aria-label="Zip code directory">
          <ul>
            {ZIP_COMMUNITIES.map((zc) => (
              <li key={zc.slug}>
                <a href={`/communities/${zc.slug}`}>
                  Homes for Sale in {zc.filterValue} ({zc.name})
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* City Pages */}
        <h2>Search by City</h2>
        <nav aria-label="City directory">
          <ul>
            {CITY_COMMUNITIES.map((cc) => (
              <li key={cc.slug}>
                <a href={`/communities/${cc.slug}`}>
                  Homes for Sale in {cc.name}, TX
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Interactive client component */}
      <CommunitiesClientIsland cardMeta={cardMeta} />
      
      <Footer />
    </>
  );
}

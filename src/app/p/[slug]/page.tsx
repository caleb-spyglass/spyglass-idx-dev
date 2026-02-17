import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PageRenderer } from '@/components/page-builder/PublicBlockRenderer';

const MISSION_CONTROL_API = process.env.MISSION_CONTROL_API_URL || 'https://missioncontrol-tjfm.onrender.com';

interface PageData {
  id: string;
  title: string;
  slug: string;
  pageType: string;
  content: string;
  sections: any[];
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  indexingDirective: string | null;
  customSchema: any;
  breadcrumbPath: Array<{ name: string; url: string }> | null;
  customScripts: string | null;
}

async function getPage(slug: string): Promise<PageData | null> {
  try {
    const res = await fetch(`${MISSION_CONTROL_API}/api/pages/${slug}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.page || null;
  } catch (error) {
    console.error('Failed to fetch page from Mission Control:', error);
    return null;
  }
}

// ── Generate metadata ──────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) {
    return { title: 'Page Not Found' };
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || undefined,
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription || undefined,
      images: page.ogImageUrl ? [{ url: page.ogImageUrl }] : undefined,
    },
    robots: page.indexingDirective
      ? {
          index: !page.indexingDirective.includes('noindex'),
          follow: !page.indexingDirective.includes('nofollow'),
        }
      : undefined,
  };
}

// ── Page Component ──────────────────────────────────

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) {
    notFound();
  }

  const blocks = page.sections || [];

  return (
    <>
      {/* Breadcrumbs */}
      {page.breadcrumbPath && page.breadcrumbPath.length > 0 && (
        <nav className="max-w-[1200px] mx-auto px-4 py-4">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            {page.breadcrumbPath.map((crumb, i) => (
              <li key={i} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                {crumb.url ? (
                  <a href={crumb.url} className="hover:text-[#EF4923] transition-colors">
                    {crumb.name}
                  </a>
                ) : (
                  <span className="text-gray-900 font-medium">{crumb.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Page content - rendered blocks */}
      <PageRenderer blocks={blocks} />

      {/* JSON-LD Schema */}
      {page.customSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(page.customSchema) }}
        />
      )}

      {/* Custom Scripts */}
      {page.customScripts && (
        <div dangerouslySetInnerHTML={{ __html: page.customScripts }} />
      )}
    </>
  );
}

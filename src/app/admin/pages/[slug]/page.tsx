import Link from 'next/link';
import { getPage, savePage } from '@/lib/admin-db';
import { PageEditorForm } from './PageEditorForm';

interface PageEditorProps {
  params: Promise<{ slug: string }>;
}

function paramToDbSlug(param: string): string {
  if (param === 'home') return '/';
  return '/' + param;
}

export async function generateMetadata({ params }: PageEditorProps) {
  const { slug } = await params;
  const dbSlug = paramToDbSlug(slug);
  return { title: `Edit ${dbSlug} | CMS Admin` };
}

export default async function PageEditor({ params }: PageEditorProps) {
  const { slug } = await params;
  const dbSlug = paramToDbSlug(slug);

  // Try to get the page; create it if it doesn't exist
  let page = await getPage(dbSlug);
  if (!page) {
    // Auto-create the page entry
    page = await savePage(dbSlug, {
      title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
      content: {},
      meta_title: '',
      meta_description: '',
      is_published: true,
    });
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/admin/pages" className="hover:text-gray-700">Pages</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{page.title}</span>
          <span className="font-mono text-xs text-gray-400 ml-1">({page.slug})</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Edit: {page.title}
        </h1>

        <PageEditorForm page={page} />
      </div>
    </div>
  );
}

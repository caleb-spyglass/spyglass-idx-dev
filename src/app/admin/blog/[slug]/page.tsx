import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPost } from '@/lib/admin-db';
import { BlogEditorForm } from '../_components/BlogEditorForm';

interface BlogEditorProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogEditorProps) {
  const { slug } = await params;
  return { title: `Edit: ${slug} | CMS Admin` };
}

export default async function BlogEditor({ params }: BlogEditorProps) {
  const { slug } = await params;
  const postRaw = await getBlogPost(slug);

  if (!postRaw) notFound();

  // post is non-null after notFound() above (notFound throws)
  const post = postRaw!;

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/admin/blog" className="hover:text-gray-700">Blog Posts</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{post.title}</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Post</h1>

        <BlogEditorForm post={post} />
      </div>
    </div>
  );
}

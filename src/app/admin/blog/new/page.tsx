import Link from 'next/link';
import { BlogEditorForm } from '../_components/BlogEditorForm';

export const metadata = {
  title: 'New Blog Post | CMS Admin',
};

export default function NewBlogPost() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/admin/blog" className="hover:text-gray-700">Blog Posts</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">New Post</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">New Blog Post</h1>

        <BlogEditorForm isNew />
      </div>
    </div>
  );
}

import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface CommunityBreadcrumbsProps {
  communityName: string;
  communitySlug: string;
}

export default function CommunityBreadcrumbs({
  communityName,
  communitySlug,
}: CommunityBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-gray-900 transition-colors"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <ChevronRightIcon className="w-3 h-3 text-gray-400" />
          </li>
          <li>
            <Link
              href="/communities"
              className="hover:text-gray-900 transition-colors"
            >
              Communities
            </Link>
          </li>
          <li>
            <ChevronRightIcon className="w-3 h-3 text-gray-400" />
          </li>
          <li>
            <span className="text-gray-900 font-medium" aria-current="page">
              {communityName}
            </span>
          </li>
        </ol>
      </div>
    </nav>
  );
}

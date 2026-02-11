import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface ZipCodeBreadcrumbsProps {
  zipCode: string;
  zipName: string;
}

export default function ZipCodeBreadcrumbs({ zipCode, zipName }: ZipCodeBreadcrumbsProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link 
            href="/" 
            className="flex items-center gap-1 hover:text-spyglass-orange transition-colors"
          >
            <HomeIcon className="w-4 h-4" />
            Home
          </Link>
          
          <ChevronRightIcon className="w-4 h-4" />
          
          <Link 
            href="/zip-codes" 
            className="hover:text-spyglass-orange transition-colors"
          >
            Zip Codes
          </Link>
          
          <ChevronRightIcon className="w-4 h-4" />
          
          <span className="text-gray-900 font-medium">
            {zipCode} - {zipName}
          </span>
        </nav>
      </div>
    </div>
  );
}
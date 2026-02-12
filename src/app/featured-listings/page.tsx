'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FeaturedListingsPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to main search page which shows all listings
    router.replace('/');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Redirecting to listings...</p>
    </div>
  );
}

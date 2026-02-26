import type { ReactNode } from 'react';
import { AdminSidebar } from './_components/AdminSidebar';

export const metadata = {
  title: 'CMS Admin | Spyglass Realty',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

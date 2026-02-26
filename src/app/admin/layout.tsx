import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminSidebar } from './_components/AdminSidebar';

export const metadata = {
  title: 'CMS Admin | Spyglass Realty',
  robots: { index: false, follow: false },
};

export async function checkAdminAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  const password = process.env.ADMIN_PASSWORD ?? 'spyglass2026';
  const expectedToken = btoa(`${password}:spyglass-cms`);
  return session?.value === expectedToken;
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

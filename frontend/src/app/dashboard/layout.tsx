'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { SkeletonLoader } from '@/components/SkeletonLoader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex">
        <div className="hidden lg:flex w-64 bg-gray-50 border-r border-border">
          <div className="w-full p-6 space-y-4">
            <SkeletonLoader count={1} type="card" />
            <SkeletonLoader count={5} type="text" />
          </div>
        </div>
        <div className="flex-1">
          <div className="h-16 bg-gray-50 border-b border-border" />
          <div className="p-6">
            <SkeletonLoader count={3} />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <div className="ml-0 lg:ml-64">{children}</div>
        </main>
      </div>
    </div>
  );
}

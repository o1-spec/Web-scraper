'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Tag,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { addToast } = useToast();

  // Hide sidebar on auth pages
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password';
  if (isAuthPage) return null;

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Jobs',
      href: '/jobs',
      icon: Briefcase,
    },
    {
      name: 'Companies',
      href: '/companies',
      icon: Building2,
    },
    {
      name: 'Keywords',
      href: '/keywords',
      icon: Tag,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'success');
    router.push('/login');
  };

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border lg:bg-white">
      {/* Logo Section */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm">
            JS
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">JobScout</h1>
            <p className="text-xs text-muted-foreground">Job Monitoring</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-foreground hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-3 py-6">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-gray-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}

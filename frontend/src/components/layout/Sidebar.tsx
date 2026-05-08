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
import { motion } from 'framer-motion';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { addToast } = useToast();

  // Hide sidebar on auth pages
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password';
  if (isAuthPage) return null;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Companies', href: '/companies', icon: Building2 },
    { name: 'Keywords', href: '/keywords', icon: Tag },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'success');
    router.push('/login');
  };

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col lg:bg-zinc-950 lg:border-r lg:border-white/10 z-50">
      {/* Subtle background noise for Sidebar */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>

      {/* Logo Section */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-white/5 relative z-10">
        <Link href="/" className="flex items-center gap-3 group w-full">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
            JS
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">JobScout</h1>
            <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase mt-0.5">Intelligence</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto relative z-10">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                isActive
                  ? 'text-white bg-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={`h-4 w-4 flex-shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/5 p-4 relative z-10">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <LogOut className="h-4 w-4 text-zinc-500 group-hover:text-red-400 transition-colors" />
          <span className="group-hover:text-red-400 transition-colors">Logout</span>
        </button>
      </div>
    </div>
  );
}

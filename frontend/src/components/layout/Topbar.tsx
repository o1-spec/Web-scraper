'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Menu, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';

export function Topbar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'success');
    router.push('/login');
  };

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : 'JD';

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-white">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Button */}
        <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Menu className="h-6 w-6" />
        </button>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5 text-foreground" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                {initials}
              </div>
              <span className="hidden sm:inline text-sm font-medium text-foreground">
                {user ? `${user.firstName} ${user.lastName}` : 'User'}
              </span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-foreground">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    router.push('/settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-200"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

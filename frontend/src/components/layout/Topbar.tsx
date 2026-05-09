'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Menu, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';
import { motion, AnimatePresence } from 'framer-motion';

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
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
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-4 h-16 sm:px-6 lg:px-8">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Right Section */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Notifications */}
          <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors group">
            <Bell className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-blue-500 rounded-full border-2 border-background" />
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-2 pr-1 py-1 hover:bg-accent rounded-full transition-all border border-transparent hover:border-border"
            >
              <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                {initials}
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground mr-1" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-xl shadow-2xl overflow-hidden"
                >
                  <div className="px-4 py-3 bg-muted/50 border-b border-border">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => {
                        router.push('/settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md flex items-center gap-2 transition-colors"
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      Preferences
                    </button>
                    <div className="h-px bg-border my-1 mx-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-md flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

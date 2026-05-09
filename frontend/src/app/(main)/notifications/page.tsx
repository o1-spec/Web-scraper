'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Briefcase, AlertCircle, CheckCircle2, Clock, Trash2, CheckSquare } from 'lucide-react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { getRelativeTime, formatDateTime } from '@/lib/utils';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { useToast } from '@/providers/ToastProvider';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export default function NotificationsPage() {
  const { data: notifications, mutate, isLoading } = useSWR<Notification[]>('/api/notifications', fetcher);
  const { addToast } = useToast();

  const handleMarkRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      mutate();
    } catch (err) {
      addToast('Failed to mark as read', 'error');
    }
  };

  const handleReadAll = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
      addToast('All notifications marked as read', 'success');
      mutate();
    } catch (err) {
      addToast('Failed to update notifications', 'error');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Clear all notification history?')) return;
    try {
      await fetch('/api/notifications', { method: 'DELETE' });
      addToast('Notification history cleared', 'success');
      mutate([]);
    } catch (err) {
      addToast('Failed to clear notifications', 'error');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'JOB_FOUND': return { icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' };
      case 'SCRAPE_SUCCESS': return { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
      case 'SCRAPE_ERROR': return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' };
      default: return { icon: Bell, color: 'text-zinc-500', bg: 'bg-zinc-500/10' };
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Notifications</h1>
          <p className="mt-2 text-muted-foreground">
            Stay updated on new jobs and background system activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {notifications && notifications.some(n => !n.isRead) && (
            <button
              onClick={handleReadAll}
              className="p-2.5 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all flex items-center gap-2 text-sm font-medium"
            >
              <CheckSquare className="h-4 w-4" />
              <span>Mark all read</span>
            </button>
          )}
          <button
            onClick={handleClearAll}
            className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all flex items-center gap-2 text-sm font-medium"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear all</span>
          </button>
        </div>
      </motion.div>

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading ? (
          <SkeletonLoader count={5} type="table-row" />
        ) : notifications && notifications.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {notifications.map((notif, index) => {
              const { icon: Icon, color, bg } = getIcon(notif.type);
              return (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group relative border rounded-2xl p-4 transition-all overflow-hidden ${notif.isRead
                      ? 'bg-card/50 border-border opacity-75'
                      : 'bg-card border-primary/20 shadow-md ring-1 ring-primary/5'
                    }`}
                >
                  <div className="flex gap-4 items-start">
                    <div className={`p-2.5 rounded-xl ${bg} ${color} flex-shrink-0 transition-transform group-hover:scale-110`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0" onClick={() => !notif.isRead && handleMarkRead(notif.id)}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-sm font-bold ${notif.isRead ? 'text-muted-foreground' : 'text-foreground'} leading-none`}>
                            {notif.title}
                          </h3>
                          {!notif.isRead && (
                            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                          )}
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {getRelativeTime(notif.createdAt)}
                        </span>
                      </div>
                      <p className={`mt-1.5 text-sm ${notif.isRead ? 'text-muted-foreground/70' : 'text-muted-foreground'} line-clamp-2 leading-relaxed`}>
                        {notif.message}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">
                          {formatDateTime(notif.createdAt)}
                        </p>
                        {notif.link && (
                          <a
                            href={notif.link}
                            className="text-[10px] font-bold text-blue-500 hover:underline uppercase tracking-widest"
                          >
                            View Details
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkRead(notif.id)}
                      className="absolute right-4 top-4 p-1 rounded-md hover:bg-muted text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Mark as read"
                    >
                      <CheckSquare className="h-4 w-4" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-16 text-center"
          >
            <div className="mb-4 flex justify-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Bell className="h-8 w-8 text-muted-foreground/50" />
              </div>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">You&apos;re all caught up</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Your notification inbox is empty. We&apos;ll alert you here when new jobs match your profile.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

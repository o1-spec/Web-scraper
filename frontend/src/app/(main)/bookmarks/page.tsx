'use client';

import { useState } from 'react';
import { JobCard } from '@/components/jobs/JobCard';
import { motion, AnimatePresence } from 'framer-motion';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { useToast } from '@/providers/ToastProvider';
import { Bookmark, Search, Briefcase } from 'lucide-react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export default function BookmarksPage() {
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch only saved jobs
  const { data: jobs, mutate, isLoading } = useSWR('/api/jobs?savedOnly=true', fetcher);

  const handleToggleSave = async (jobId: string) => {
    try {
      await fetch(`/api/jobs/${jobId}/save`, { method: 'POST' });
      addToast('Bookmark updated', 'success');
      mutate();
    } catch(err) {
      addToast('Failed to update bookmark', 'error');
    }
  };

  const filteredJobs = jobs?.filter((job: any) => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-4"
      >
        <div className="w-full">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Bookmarks</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your saved job opportunities and prepare for applications.
          </p>
        </div>
        <div className="text-sm font-medium px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 whitespace-nowrap">
          {isLoading ? '...' : filteredJobs?.length || 0} Saved Roles
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative max-w-md group"
      >
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground group-focus-within:text-blue-500 transition-colors">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          placeholder="Search your bookmarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
        />
      </motion.div>

      {/* Jobs Grid */}
      <div className="pt-2">
        {isLoading ? (
          <SkeletonLoader count={3} />
        ) : filteredJobs && filteredJobs.length > 0 ? (
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job: any, index: number) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSaveToggle={handleToggleSave}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-16 text-center"
          >
            <div className="mb-4 flex justify-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Bookmark className="h-8 w-8 text-muted-foreground/50" />
              </div>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">
              {searchQuery ? 'No bookmarks match' : 'No saved jobs yet'}
            </h3>
            <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
              {searchQuery 
                ? 'Try searching for something else or clear the search bar.' 
                : 'Jobs you bookmark from the discovery page will appear here for easy access.'}
            </p>
            {!searchQuery && (
              <a
                href="/jobs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
              >
                <Briefcase className="h-4 w-4" />
                Browse Jobs
              </a>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

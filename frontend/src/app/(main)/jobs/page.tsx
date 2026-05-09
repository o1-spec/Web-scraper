'use client';

import { useState } from 'react';
import { JobFilters as FiltersComponent } from '@/components/jobs/JobFilters';
import { JobCard } from '@/components/jobs/JobCard';
import { JobFiltersState as JobFilters } from '@/components/jobs/JobFilters';
import { motion, AnimatePresence } from 'framer-motion';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export default function JobsPage() {
  const [filters, setFilters] = useState<JobFilters>({
    keyword: '',
    company: 'all',
    locationType: 'all',
    jobType: 'all',
    savedOnly: false,
    newOnly: false,
  });

  const queryParams = new URLSearchParams();
  if (filters.keyword) queryParams.append('keyword', filters.keyword);
  if (filters.company !== 'all') queryParams.append('company', filters.company);
  if (filters.locationType !== 'all') queryParams.append('locationType', filters.locationType);
  if (filters.jobType !== 'all') queryParams.append('jobType', filters.jobType);
  if (filters.savedOnly) queryParams.append('savedOnly', 'true');
  if (filters.newOnly) queryParams.append('newOnly', 'true');

  const { data: jobs, mutate, isLoading } = useSWR(`/api/jobs?${queryParams.toString()}`, fetcher);

  const handleFiltersChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
  };

  const handleReset = () => {
    setFilters({
      keyword: '',
      company: 'all',
      locationType: 'all',
      jobType: 'all',
      savedOnly: false,
      newOnly: false,
    });
  };

  const handleToggleSave = async (jobId: string) => {
    try {
      await fetch(`/api/jobs/${jobId}/save`, { method: 'POST' });
      mutate();
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Discovered Jobs</h1>
          <p className="mt-2 text-muted-foreground">
            Browse and manage your filtered job opportunities.
          </p>
        </div>
        <div className="text-sm font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          {isLoading ? '...' : jobs?.length || 0} {jobs?.length === 1 ? 'Match' : 'Matches'} Found
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <FiltersComponent onFiltersChange={handleFiltersChange} onReset={handleReset} />
      </motion.div>

      {/* Jobs Grid */}
      <div className="pt-2">
        {isLoading ? (
          <SkeletonLoader count={4} />
        ) : jobs && jobs.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <AnimatePresence mode="popLayout">
              {jobs.map((job: any, index: number) => (
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
            className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center"
          >
            <div className="mb-4 flex justify-center">
              <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-foreground mb-1">No matches found</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              We couldn&apos;t find any jobs matching your current filter criteria. Try broadening your search.
            </p>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm text-sm"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

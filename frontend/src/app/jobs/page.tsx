'use client';

import { useState, useMemo } from 'react';
import { JobFilters, JobFiltersState } from '@/components/jobs/JobFilters';
import { JobCard } from '@/components/jobs/JobCard';
import { mockJobs } from '@/lib/mockData';
import { Job } from '@/types';
import { motion } from 'framer-motion';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [filters, setFilters] = useState<JobFiltersState>({
    keyword: '',
    company: '',
    location: '',
    locationType: 'all',
    jobType: 'all',
    source: 'all',
    savedOnly: false,
    newOnly: false,
  });

  const filteredJobs = useMemo(() => {
    let filtered = jobs;

    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(keyword) ||
          job.description?.toLowerCase().includes(keyword) ||
          job.tags.some((tag) => tag.toLowerCase().includes(keyword))
      );
    }
    if (filters.company) {
      const company = filters.company.toLowerCase();
      filtered = filtered.filter((job) =>
        job.company.toLowerCase().includes(company)
      );
    }
    if (filters.location) {
      const location = filters.location.toLowerCase();
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(location)
      );
    }
    if (filters.locationType !== 'all') {
      filtered = filtered.filter((job) => job.locationType === filters.locationType);
    }
    if (filters.jobType !== 'all') {
      filtered = filtered.filter((job) => job.jobType === filters.jobType);
    }
    if (filters.source !== 'all') {
      filtered = filtered.filter((job) => job.source === filters.source);
    }
    if (filters.savedOnly) {
      filtered = filtered.filter((job) => job.isSaved);
    }
    if (filters.newOnly) {
      const today = new Date();
      filtered = filtered.filter(
        (job) => job.dateFound.toDateString() === today.toDateString()
      );
    }

    return filtered;
  }, [jobs, filters]);

  const handleFiltersChange = (newFilters: JobFiltersState) => {
    setFilters(newFilters);
  };

  const handleReset = () => {
    setFilters({
      keyword: '',
      company: '',
      location: '',
      locationType: 'all',
      jobType: 'all',
      source: 'all',
      savedOnly: false,
      newOnly: false,
    });
  };

  const handleSaveToggle = (jobId: string) => {
    setJobs(
      jobs.map((job) =>
        job.id === jobId ? { ...job, isSaved: !job.isSaved } : job
      )
    );
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
          {filteredJobs.length} {filteredJobs.length === 1 ? 'Match' : 'Matches'} Found
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <JobFilters onFiltersChange={handleFiltersChange} onReset={handleReset} />
      </motion.div>

      {/* Jobs Grid */}
      <div className="pt-2">
        {filteredJobs.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            {filteredJobs.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                onSaveToggle={handleSaveToggle}
                index={index}
              />
            ))}
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

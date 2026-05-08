'use client';

import { useState, useMemo } from 'react';
import { JobFilters, JobFiltersState } from '@/components/jobs/JobFilters';
import { JobCard } from '@/components/jobs/JobCard';
import { mockJobs } from '@/lib/mockData';
import { Job } from '@/types';

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

    // Keyword search
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(keyword) ||
          job.description?.toLowerCase().includes(keyword) ||
          job.tags.some((tag) => tag.toLowerCase().includes(keyword))
      );
    }

    // Company filter
    if (filters.company) {
      const company = filters.company.toLowerCase();
      filtered = filtered.filter((job) =>
        job.company.toLowerCase().includes(company)
      );
    }

    // Location filter
    if (filters.location) {
      const location = filters.location.toLowerCase();
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(location)
      );
    }

    // Location type filter
    if (filters.locationType !== 'all') {
      filtered = filtered.filter((job) => job.locationType === filters.locationType);
    }

    // Job type filter
    if (filters.jobType !== 'all') {
      filtered = filtered.filter((job) => job.jobType === filters.jobType);
    }

    // Source filter
    if (filters.source !== 'all') {
      filtered = filtered.filter((job) => job.source === filters.source);
    }

    // Saved only filter
    if (filters.savedOnly) {
      filtered = filtered.filter((job) => job.isSaved);
    }

    // New only filter
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">Jobs</h1>
        <p className="mt-2 text-muted-foreground">
          Browse and manage {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} across all your monitored sources.
        </p>
      </div>

      {/* Filters */}
      <JobFilters onFiltersChange={handleFiltersChange} onReset={handleReset} />

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredJobs.length} of {jobs.length} jobs
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-white p-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-gray-400"
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
          <h3 className="text-lg font-semibold text-foreground mb-1">No jobs found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters to find more jobs
          </p>
        </div>
      )}
    </div>
  );
}

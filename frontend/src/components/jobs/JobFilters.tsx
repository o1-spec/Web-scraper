'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';

export interface JobFiltersState {
  keyword: string;
  company: string;
  location: string;
  locationType: string; // 'all' | 'remote' | 'on-site' | 'hybrid'
  jobType: string; // 'all' | 'full-time' | 'part-time' | 'contract' | 'internship'
  source: string; // 'all' | 'greenhouse' | 'lever' | 'ashby' | 'custom'
  savedOnly: boolean;
  newOnly: boolean;
}

interface JobFiltersProps {
  onFiltersChange: (filters: JobFiltersState) => void;
  onReset: () => void;
}

export function JobFilters({ onFiltersChange, onReset }: JobFiltersProps) {
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

  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (key: keyof JobFiltersState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const emptyFilters: JobFiltersState = {
      keyword: '',
      company: '',
      location: '',
      locationType: 'all',
      jobType: 'all',
      source: 'all',
      savedOnly: false,
      newOnly: false,
    };
    setFilters(emptyFilters);
    onReset();
  };

  const activeFilters = Object.values(filters).filter(
    (v) => (typeof v === 'string' && v !== '' && v !== 'all') || (typeof v === 'boolean' && v)
  ).length;

  return (
    <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
      {/* Main Search Bar */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search jobs by title..."
            value={filters.keyword}
            onChange={(e) => handleChange('keyword', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {activeFilters > 0 && (
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-foreground flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 rounded-lg border border-border hover:bg-gray-50 transition-colors text-sm font-medium text-foreground"
        >
          {isExpanded ? 'Hide' : 'Filters'} {activeFilters > 0 && `(${activeFilters})`}
        </button>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="pt-4 border-t border-border space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Company
              </label>
              <input
                type="text"
                placeholder="e.g., Stripe"
                value={filters.company}
                onChange={(e) => handleChange('company', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g., San Francisco"
                value={filters.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Work Type
              </label>
              <select
                value={filters.locationType}
                onChange={(e) => handleChange('locationType', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="remote">Remote</option>
                <option value="on-site">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Job Type
              </label>
              <select
                value={filters.jobType}
                onChange={(e) => handleChange('jobType', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Source
              </label>
              <select
                value={filters.source}
                onChange={(e) => handleChange('source', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="greenhouse">Greenhouse</option>
                <option value="lever">Lever</option>
                <option value="ashby">Ashby</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.savedOnly}
                  onChange={(e) => handleChange('savedOnly', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm font-medium text-foreground">Saved only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.newOnly}
                  onChange={(e) => handleChange('newOnly', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm font-medium text-foreground">New today</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

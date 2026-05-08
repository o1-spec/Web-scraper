'use client';

import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface JobFiltersState {
  keyword: string;
  company: string;
  location: string;
  locationType: string;
  jobType: string;
  source: string;
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
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden transition-all duration-300">
      {/* Main Search Bar */}
      <div className="p-3 bg-muted/20">
        <div className="flex gap-2">
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search jobs by title, skill, or keyword..."
              value={filters.keyword}
              onChange={(e) => handleChange('keyword', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium flex items-center gap-2 shadow-sm ${
              isExpanded 
                ? 'bg-secondary border-border text-foreground' 
                : 'bg-background border-border hover:bg-accent text-foreground'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilters > 0 && (
              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                {activeFilters}
              </span>
            )}
          </button>
          {activeFilters > 0 && (
            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-lg border border-border bg-background hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all text-sm font-medium flex items-center gap-2 shadow-sm"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="border-t border-border overflow-hidden"
          >
            <div className="p-5 space-y-5 bg-background">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Stripe"
                    value={filters.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., San Francisco"
                    value={filters.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Work Type
                  </label>
                  <select
                    value={filters.locationType}
                    onChange={(e) => handleChange('locationType', e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="all">All Types</option>
                    <option value="remote">Remote</option>
                    <option value="on-site">On-site</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Job Type
                  </label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => handleChange('jobType', e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="all">All Roles</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-4 border-t border-border/50">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Source
                  </label>
                  <select
                    value={filters.source}
                    onChange={(e) => handleChange('source', e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="all">All Sources</option>
                    <option value="greenhouse">Greenhouse</option>
                    <option value="lever">Lever</option>
                    <option value="ashby">Ashby</option>
                    <option value="custom">Custom Tracker</option>
                  </select>
                </div>

                {/* Toggles */}
                <div className="lg:col-span-3 flex items-end gap-6 pb-1">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.savedOnly}
                        onChange={(e) => handleChange('savedOnly', e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-10 h-5 bg-muted rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary transition-colors"></div>
                    </div>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Saved only</span>
                  </label>
                  
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.newOnly}
                        onChange={(e) => handleChange('newOnly', e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-10 h-5 bg-muted rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary transition-colors"></div>
                    </div>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">New today</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

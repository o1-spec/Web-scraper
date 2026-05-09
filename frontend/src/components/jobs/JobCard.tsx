'use client';

import { Job } from '@/types';
import { Bookmark, ExternalLink, MapPin, Briefcase as BriefcaseIcon, Building2 } from 'lucide-react';
import { getRelativeTime, getSourceBadgeColor, getLocationTypeLabel } from '@/lib/utils';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface JobCardProps {
  job: Job;
  onSaveToggle: (jobId: string) => void;
  index?: number;
}

export function JobCard({ job, onSaveToggle, index = 0 }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(job.isSaved);

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSaveToggle(job.id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="group relative rounded-xl border border-border bg-card p-5 sm:p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row items-start justify-between gap-5">
        
        <div className="flex-1 min-w-0 flex gap-4 w-full">
          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 border border-border">
            <span className="text-lg font-bold text-muted-foreground">{job.company.charAt(0)}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <div>
                <h3 className="font-bold text-foreground text-lg leading-tight group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 text-sm text-muted-foreground">
                  <span className="font-medium">{job.company}</span>
                  <span className="text-border">•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {job.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3 mb-4">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${getSourceBadgeColor(job.source)}`}>
                {job.source}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted/50 text-xs font-medium text-muted-foreground">
                <Building2 className="h-3 w-3" />
                {getLocationTypeLabel(job.locationType)}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted/50 text-xs font-medium text-muted-foreground capitalize">
                <BriefcaseIcon className="h-3 w-3" />
                {job.jobType}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {job.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary/5 text-primary border border-primary/10"
                >
                  {tag}
                </span>
              ))}
              {job.tags.length > 5 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground">
                  +{job.tags.length - 5}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 sm:gap-0 h-full sm:min-h-[120px]">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="p-2 hover:bg-accent rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
              title={isSaved ? 'Remove from saved' : 'Save job'}
            >
              <Bookmark className={`h-5 w-5 transition-colors ${isSaved ? 'text-blue-500 fill-blue-500' : 'text-muted-foreground hover:text-foreground'}`} />
            </button>
            <a
              href={job.jobLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 flex items-center justify-center"
              title="Open Job"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground font-mono">{job.matchScore}%</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Match</span>
            </div>
            <div className="w-24 sm:w-32 bg-secondary rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  job.matchScore >= 80 ? 'bg-emerald-500' : job.matchScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${job.matchScore}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Found {getRelativeTime(job.dateFound)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

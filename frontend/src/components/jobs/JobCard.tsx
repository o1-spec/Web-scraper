'use client';

import { Job } from '@/types';
import { Bookmark, ExternalLink } from 'lucide-react';
import { getRelativeTime, getSourceBadgeColor, getLocationTypeLabel } from '@/lib/utils';
import { useState } from 'react';

interface JobCardProps {
  job: Job;
  onSaveToggle: (jobId: string) => void;
}

export function JobCard({ job, onSaveToggle }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(job.isSaved);

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSaveToggle(job.id);
  };

  return (
    <div className="rounded-lg border border-border bg-white p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title and Company */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-base leading-tight">
                {job.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{job.company}</p>
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap ${getSourceBadgeColor(
                job.source
              )}`}
            >
              {job.source === 'greenhouse' && 'Greenhouse'}
              {job.source === 'lever' && 'Lever'}
              {job.source === 'ashby' && 'Ashby'}
              {job.source === 'custom' && 'Custom'}
            </span>
          </div>

          {/* Location, Type, Match */}
          <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
            <span className="text-muted-foreground">{job.location}</span>
            <span className="text-gray-300">•</span>
            <span className="text-muted-foreground">{getLocationTypeLabel(job.locationType)}</span>
            <span className="text-gray-300">•</span>
            <span className="text-muted-foreground capitalize">{job.jobType}</span>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${job.matchScore}%` }}
                />
              </div>
              <span className="font-medium text-foreground">{job.matchScore}%</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Date Found */}
          <p className="text-xs text-muted-foreground">
            Found {getRelativeTime(job.dateFound)}
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          title={isSaved ? 'Remove from saved' : 'Save job'}
        >
          {isSaved ? (
            <Bookmark className="h-5 w-5 text-blue-600 fill-blue-600" />
          ) : (
            <Bookmark className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>

      {/* Actions Footer */}
      <div className="mt-4 pt-4 border-t border-border flex gap-2">
        <a
          href={job.jobLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Open Job
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

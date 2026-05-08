'use client';

import { StatCard } from '@/components/dashboard/StatCard';
import {
  Briefcase,
  TrendingUp,
  Building2,
  Bookmark,
  Clock,
} from 'lucide-react';
import { mockDashboardStats, mockJobs } from '@/lib/mockData';
import { formatDateTime, getRelativeTime } from '@/lib/utils';

export default function DashboardPage() {
  const stats = mockDashboardStats;
  const recentJobs = mockJobs.slice(0, 5);

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome to JobScout. Here&apos;s an overview of your job tracking.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Total Jobs"
          value={stats.totalJobs}
          icon={Briefcase}
          trend={{ value: 12, isPositive: true }}
          description="Across all sources"
        />
        <StatCard
          label="New Today"
          value={stats.newJobsToday}
          icon={TrendingUp}
          description="Jobs posted today"
        />
        <StatCard
          label="Companies"
          value={stats.companiesTracked}
          icon={Building2}
          description="Being monitored"
        />
        <StatCard
          label="Saved Jobs"
          value={stats.savedJobs}
          icon={Bookmark}
          trend={{ value: 3, isPositive: true }}
          description="Bookmarked"
        />
        <StatCard
          label="Last Scrape"
          value={getRelativeTime(stats.lastScrapeTime)}
          icon={Clock}
          description={formatDateTime(stats.lastScrapeTime)}
        />
      </div>

      {/* Recent Jobs Section */}
      <div className="rounded-lg border border-border bg-white shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Jobs</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Match
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Date Found
                </th>
              </tr>
            </thead>
            <tbody>
              {recentJobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-border hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{job.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${job.matchScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {job.matchScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">
                      {getRelativeTime(job.dateFound)}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border px-6 py-4">
          <a
            href="/jobs"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all jobs →
          </a>
        </div>
      </div>
    </div>
  );
}

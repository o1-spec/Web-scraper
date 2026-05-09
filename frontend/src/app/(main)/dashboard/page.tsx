'use client';

import { StatCard } from '@/components/dashboard/StatCard';
import {
  Briefcase,
  Building2,
  ArrowRight,

  Bookmark,

  Clock,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { formatDateTime, getRelativeTime } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: stats } = useSWR('/api/dashboard/stats', fetcher);
  const { data: recentJobs } = useSWR('/api/dashboard/recent-jobs', fetcher);

  const mockStats = stats || {
    totalJobs: 0,
    newJobsToday: 0,
    companiesTracked: 0,
    savedJobs: 0,
    lastScrapeTime: new Date()
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back. Here&apos;s a high-level overview of your job intelligence tracking.
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Total Jobs"
          value={mockStats.totalJobs}
          icon={Briefcase}
          trend={{ value: 12, isPositive: true }}
          description="Across all sources"
          delay={0.1}
        />
        <StatCard
          label="New Today"
          value={mockStats.newJobsToday}
          icon={TrendingUp}
          description="Jobs posted today"
          delay={0.15}
        />
        <StatCard
          label="Companies"
          value={mockStats.companiesTracked}
          icon={Building2}
          description="Being monitored"
          delay={0.2}
        />
        <StatCard
          label="Saved Jobs"
          value={mockStats.savedJobs}
          icon={Bookmark}
          trend={{ value: 3, isPositive: true }}
          description="Bookmarked"
          delay={0.25}
        />
        <StatCard
          label="Last Scrape"
          value={getRelativeTime(mockStats.lastScrapeTime)}
          icon={Clock}
          description={formatDateTime(mockStats.lastScrapeTime)}
          delay={0.3}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
      >
        <div className="border-b border-border px-6 py-5 flex items-center justify-between bg-muted/20">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Recent Discoveries</h2>
          <Link href="/jobs" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 group transition-colors">
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium">Match Score</th>
                <th className="px-6 py-4 font-medium">Found</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentJobs ? recentJobs.map((job: any, index: number) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  key={job.id}
                  className="bg-card hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{job.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                        {job.company.charAt(0)}
                      </div>
                      <span className="font-medium text-muted-foreground">{job.company}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-secondary rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${job.matchScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-foreground font-mono">
                        {job.matchScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-muted-foreground">
                      {getRelativeTime(job.dateFound)}
                    </p>
                  </td>
                </motion.tr>
              )) : <tr><td colSpan={4} className="px-6 py-4 text-center">Loading...</td></tr>}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

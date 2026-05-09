'use client';

import { motion } from 'framer-motion';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { getRelativeTime } from '@/lib/utils';
import { Activity, Clock, AlertCircle, CheckCircle2, RefreshCw, Database, Server } from 'lucide-react';
import { SkeletonLoader } from '@/components/SkeletonLoader';

interface ScrapeRun {
  id: string;
  status: string;
  jobsFound: number;
  error?: string;
  startedAt: string;
  completedAt?: string;
  company: {
    name: string;
  };
}

export default function StatusPage() {
  const { data: runs, mutate, isLoading } = useSWR<ScrapeRun[]>('/api/status/scrapes', fetcher);

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">System Status</h1>
          <p className="mt-2 text-muted-foreground">
            Monitor real-time scraping workers, queue health, and background logs.
          </p>
        </div>
        <button
          onClick={() => mutate()}
          className="p-2 text-muted-foreground hover:text-primary transition-colors"
          title="Refresh Status"
        >
          <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </motion.div>

      {/* System Health Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl border border-border bg-card shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Server className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold">Web Server</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">Online</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl border border-border bg-card shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold">BullMQ Workers</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">Active</span>
            <span className="text-xs text-muted-foreground">1 Running</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl border border-border bg-card shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Database className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold">Redis Queue</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">Healthy</span>
            <span className="text-xs text-muted-foreground">0 Waiting</span>
          </div>
        </motion.div>
      </div>

      {/* Scrape Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-border bg-muted/20">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Background Logs</h2>
          <p className="text-sm text-muted-foreground mt-1">Real-time status of the last 50 scraping operations.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Operation</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Result</th>
                <th className="px-6 py-4 font-medium">Duration</th>
                <th className="px-6 py-4 font-medium text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-6">
                    <SkeletonLoader count={5} type="table-row" />
                  </td>
                </tr>
              ) : runs && runs.length > 0 ? (
                runs.map((run) => (
                  <tr key={run.id} className="bg-card hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">Scrape: {run.company.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                        run.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                        run.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {run.status === 'completed' && <CheckCircle2 className="h-3 w-3" />}
                        {run.status === 'failed' && <AlertCircle className="h-3 w-3" />}
                        {run.status === 'running' && <RefreshCw className="h-3 w-3 animate-spin" />}
                        {run.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {run.status === 'completed' ? (
                        <span className="text-muted-foreground">{run.jobsFound} jobs discovered</span>
                      ) : run.status === 'failed' ? (
                        <span className="text-red-400 text-xs truncate max-w-[200px] block">{run.error}</span>
                      ) : (
                        <span className="text-muted-foreground italic text-xs tracking-wide">Processing...</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {run.completedAt ? (
                          `${Math.round((new Date(run.completedAt).getTime() - new Date(run.startedAt).getTime()) / 1000)}s`
                        ) : '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground whitespace-nowrap">
                      {getRelativeTime(run.startedAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">
                    No background operations found in history.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

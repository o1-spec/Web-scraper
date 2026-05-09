'use client';

import { useState } from 'react';
import { Plus, X, Tag, Info } from 'lucide-react';
import { Keyword } from '@/types';
import { formatDate } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { useToast } from '@/providers/ToastProvider';

export default function KeywordsPage() {
  const { data: keywords, mutate, isLoading } = useSWR<Keyword[]>('/api/keywords', fetcher, { fallbackData: [] });
  const { addToast } = useToast();
  const [inputValue, setInputValue] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      try {
        await fetch('/api/keywords', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword: inputValue.trim() }),
        });
        addToast('Keyword added', 'success');
        mutate();
        setInputValue('');
      } catch (err) {
        addToast('Failed to add keyword', 'error');
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/keywords/${id}`, { method: 'DELETE' });
      addToast('Keyword removed', 'success');
      mutate();
    } catch (err) {
      addToast('Failed to delete keyword', 'error');
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Target Keywords</h1>
          <p className="mt-2 text-muted-foreground">
            Define specific roles, technologies, and seniority levels to match against job descriptions.
          </p>
        </div>
        <div className="text-sm font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-2">
          <Tag className="h-4 w-4" />
          {keywords ? keywords.length : 0} Active
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Add Keyword Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold tracking-tight text-foreground mb-4">Add Targeting Rule</h2>
            <form onSubmit={handleAdd} className="flex gap-3">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Tag className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="e.g., React, Senior, Staff Engineer, Remote..."
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                />
              </div>
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </form>
          </motion.div>

          {/* Keywords List */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-xl border border-border bg-card shadow-sm overflow-hidden min-h-[400px] flex flex-col"
          >
            <div className="border-b border-border px-6 py-4 bg-muted/20">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Active Keywords
              </h2>
            </div>

            {isLoading ? (
              <div className="p-6">
                <SkeletonLoader count={5} type="table-row" />
              </div>
            ) : keywords && keywords.length > 0 ? (
              <div className="divide-y divide-border flex-1 overflow-y-auto">
                <AnimatePresence initial={false}>
                  {keywords.map((keyword) => (
                    <motion.div
                      key={keyword.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Tag className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">{keyword.keyword}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Added {formatDate(keyword.createdAt)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(keyword.id)}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove Keyword"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="p-12 text-center flex-1 flex flex-col justify-center items-center">
                <div className="mb-4 flex justify-center">
                  <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                    <Tag className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground mb-1">
                  No keywords added
                </h3>
                <p className="text-sm text-muted-foreground">
                  Start adding keywords above to improve your job match score.
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Info / Guide Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="space-y-6"
        >
          <div className="rounded-xl border border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4">
              <Info className="h-5 w-5" />
              <h3 className="font-semibold tracking-tight">How it works</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Keywords are used to generate your <strong>Match Score</strong> for each job. The more matched keywords found in a job&apos;s title and description, the higher the score.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase mb-4">Common Examples</h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Next.js', 'TypeScript', 'Node.js', 'Python'].map((tech) => (
                    <button
                      key={tech}
                      onClick={() => setInputValue(tech)}
                      className="inline-block px-3 py-1.5 rounded-md text-xs font-medium bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-colors border border-transparent hover:border-primary/20 shadow-sm"
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Seniority Levels</h4>
                <div className="flex flex-wrap gap-2">
                  {['Junior', 'Entry Level', 'Senior', 'Lead', 'Staff', 'Principal'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setInputValue(level)}
                      className="inline-block px-3 py-1.5 rounded-md text-xs font-medium bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-colors border border-transparent hover:border-primary/20 shadow-sm"
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

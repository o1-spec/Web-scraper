'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bookmark, 
  Send, 
  Users, 
  CheckCircle, 
  XCircle,
  Building2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/providers/ToastProvider';

const COLUMNS = [
  { id: 'SAVED', title: 'Saved', icon: Bookmark, color: 'text-zinc-400', bg: 'bg-zinc-400/10' },
  { id: 'APPLIED', title: 'Applied', icon: Send, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'INTERVIEWING', title: 'Interviewing', icon: Users, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 'OFFER', title: 'Offer', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'REJECTED', title: 'Rejected', icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
];

export default function PipelinePage() {
  const { data: savedJobs, mutate } = useSWR('/api/jobs/saved', fetcher);
  const { addToast } = useToast();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (savedJobId: string, newStatus: string) => {
    setUpdatingId(savedJobId);
    try {
      const res = await fetch(`/api/jobs/saved/${savedJobId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error();
      
      addToast(`Status updated to ${newStatus.toLowerCase()}`, 'success');
      mutate();
    } catch (err) {
      addToast('Failed to update status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const getJobsByStatus = (status: string) => {
    return savedJobs?.filter((sj: any) => sj.status === status) || [];
  };

  return (
    <div className="h-full flex flex-col space-y-6 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Career Pipeline</h1>
        <p className="mt-2 text-muted-foreground">
          Track your application progress and manage your journey to your next role.
        </p>
      </motion.div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex-shrink-0 w-80 flex flex-col bg-muted/30 rounded-2xl border border-border/50">
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${col.bg} ${col.color}`}>
                  <col.icon className="h-4 w-4" />
                </div>
                <h2 className="font-bold text-sm tracking-tight">{col.title}</h2>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-background border border-border text-muted-foreground">
                {getJobsByStatus(col.id).length}
              </span>
            </div>

            <div className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[500px]">
              <AnimatePresence mode="popLayout">
                {getJobsByStatus(col.id).map((sj: any, index: number) => (
                  <motion.div
                    key={sj.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="group bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-default relative"
                  >
                    <div className="flex flex-col gap-3">
                      <div>
                        <h3 className="font-bold text-sm text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                          {sj.job.title}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                          <Building2 className="h-3 w-3" />
                          <span className="font-medium">{sj.job.company.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-1">
                        <div className="flex items-center gap-2">
                          <a 
                            href={sj.job.jobLink} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-all"
                            title="View Posting"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                        
                        <div className="flex items-center gap-1">
                           {COLUMNS.filter(c => c.id !== col.id).map(c => (
                             <button
                               key={c.id}
                               onClick={() => handleStatusChange(sj.id, c.id)}
                               disabled={updatingId === sj.id}
                               className={`p-1.5 rounded-md hover:${c.bg} hover:${c.color} text-muted-foreground/30 transition-all`}
                               title={`Move to ${c.title}`}
                             >
                               <ChevronRight className="h-3.5 w-3.5" />
                             </button>
                           ))}
                        </div>
                      </div>
                    </div>
                    
                    {updatingId === sj.id && (
                      <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
                        <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {getJobsByStatus(col.id).length === 0 && (
                <div className="h-32 border-2 border-dashed border-border/50 rounded-xl flex items-center justify-center p-4 text-center">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/40">Empty</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

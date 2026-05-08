import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  delay?: number;
}

export function StatCard({ label, value, icon: Icon, trend, description, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm group hover:shadow-md transition-all duration-300"
    >
      {/* Subtle hover gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold tracking-tight text-foreground font-mono">{value}</p>
            {trend && (
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-semibold ${
                  trend.isPositive 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-red-500/10 text-red-600 dark:text-red-400'
                }`}
              >
                {trend.isPositive ? '+' : '-'}{trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="rounded-xl bg-blue-50 dark:bg-blue-500/10 p-3 ring-1 ring-inset ring-blue-500/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-colors">
          <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </motion.div>
  );
}

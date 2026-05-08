'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Database, Zap } from 'lucide-react';

export default function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex min-h-screen bg-background w-full">
      {/* Left side - Visuals & Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-[55%] relative flex-col justify-between overflow-hidden border-r border-border bg-zinc-950">
        {/* Subtle Background Effects */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Top Branding */}
        <div className="p-12 relative z-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
              JS
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              JobScout
            </span>
          </Link>
        </div>

        {/* Center Content / Mockup */}
        <div className="flex-1 px-12 flex flex-col justify-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-md"
          >
            <h1 className="text-4xl font-semibold tracking-tight text-white mb-4 leading-tight">
              {title}
            </h1>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
              {subtitle}
            </p>

            {/* Fake Dashboard/Metrics Snippet */}
            <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl relative">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-medium text-emerald-400">System Active</span>
                </div>
                <span className="text-xs font-medium text-zinc-500 font-mono">v1.0.4-beta</span>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Jobs Monitored Today', value: '14,205', icon: Database, color: 'text-blue-400' },
                  { label: 'Companies Tracked', value: '842', icon: Activity, color: 'text-indigo-400' },
                  { label: 'Matches Found', value: '128', icon: Zap, color: 'text-emerald-400' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className="flex items-center justify-between bg-black/20 rounded-lg p-3 border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md bg-white/5 ${stat.color}`}>
                        <stat.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-zinc-300">{stat.label}</span>
                    </div>
                    <span className="font-mono text-sm font-medium text-white">{stat.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Footer */}
        <div className="p-12 relative z-10 flex items-center justify-between">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} JobScout Inc.
          </p>
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <Link href="#" className="hover:text-zinc-300 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">Terms</Link>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-24 xl:px-32 relative bg-background">
        {/* Mobile Header */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-sm">
              JS
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              JobScout
            </span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm mx-auto"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

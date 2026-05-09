'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/providers/AuthProvider';
import { 
  Search, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  Zap
} from 'lucide-react';

export default function LandingPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const features = [
    {
      title: 'Automated Scraping',
      description: 'Native support for Greenhouse, Lever, and Ashby job boards.',
      icon: Search,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Intelligent Matching',
      description: 'AI-driven scores based on your custom targeting keywords.',
      icon: Zap,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      title: 'Real-time Monitoring',
      description: 'Full transparency with background worker logs and status.',
      icon: Activity,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Noise & Gradients */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none z-0"></div>
      <div className="fixed top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse z-0"></div>
      <div className="fixed bottom-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse z-0"></div>

      {/* Navbar */}
      <nav className="relative z-50 border-b border-white/5 bg-zinc-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                JS
              </div>
              <span className="text-xl font-bold tracking-tight">JobScout</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">How it works</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              {isLoading ? (
                <div className="h-10 w-24 bg-white/5 rounded-lg animate-pulse" />
              ) : isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <span className="hidden sm:inline text-sm text-zinc-400">
                    Welcome back, <span className="text-white font-semibold">{user?.firstName}</span>
                  </span>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-zinc-200 transition-all active:scale-95"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-zinc-200 transition-all active:scale-95"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-zinc-400 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 bg-zinc-950 px-4 py-6 space-y-4"
            >
              <a href="#features" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-zinc-400 hover:text-white">Features</a>
              <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-zinc-400 hover:text-white">How it works</a>
              <div className="pt-4 border-t border-white/5 flex flex-col gap-4">
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-black rounded-full text-sm font-bold"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/5 border border-white/10 text-white rounded-full text-sm font-bold"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full text-sm font-bold"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
              <Zap className="h-3.5 w-3.5" />
              Intelligence Driven Discovery
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8">
              Automate your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">career growth.</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              JobScout monitors company career pages 24/7, scrapes new openings, and matches them against your skills with intelligent scoring.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0">
              <Link
                href={isAuthenticated ? "/dashboard" : "/signup"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]"
              >
                {isAuthenticated ? "Launch Dashboard" : "Start Discovering Now"}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full text-lg font-bold hover:bg-white/10 transition-all active:scale-[0.98]"
              >
                View Features
              </a>
            </div>
          </motion.div>
        </div>

        {/* Floating UI Elements (Visual Mockup) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-24 relative max-w-6xl mx-auto"
        >
          <div className="relative rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm p-4 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent rounded-3xl pointer-events-none"></div>
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className="h-3 w-3 rounded-full bg-red-500/50" />
              <div className="h-3 w-3 rounded-full bg-amber-500/50" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/50" />
            </div>
            <div className="aspect-[16/9] rounded-xl bg-zinc-950 border border-white/5 overflow-hidden flex items-center justify-center relative">
               {/* Just a stylized placeholder representing the dashboard */}
               <div className="grid grid-cols-12 gap-4 w-full h-full p-8 opacity-40">
                  <div className="col-span-3 space-y-4">
                    <div className="h-8 bg-white/10 rounded-lg w-full" />
                    <div className="h-32 bg-white/5 rounded-lg w-full" />
                    <div className="h-32 bg-white/5 rounded-lg w-full" />
                  </div>
                  <div className="col-span-9 space-y-4">
                    <div className="h-16 bg-white/10 rounded-lg w-full" />
                    <div className="grid grid-cols-3 gap-4">
                       <div className="h-24 bg-blue-500/20 rounded-lg border border-blue-500/20" />
                       <div className="h-24 bg-white/5 rounded-lg" />
                       <div className="h-24 bg-white/5 rounded-lg" />
                    </div>
                    <div className="h-64 bg-white/5 rounded-lg w-full" />
                  </div>
               </div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="px-6 py-4 rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl text-center">
                    <CheckCircle2 className="h-10 w-10 text-blue-500 mx-auto mb-3" />
                    <p className="text-xl font-bold">98% Match Found</p>
                    <p className="text-sm text-zinc-500">Senior React Developer at Vercel</p>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Built for Elite Engineering</h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto">Everything you need to outpace the job market with automated intelligence.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-3xl border border-white/5 bg-zinc-900/50 hover:bg-zinc-900 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className={`p-3 rounded-2xl ${feature.bg} ${feature.color} w-fit mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* How it Works */}
      <section id="how-it-works" className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12">How JobScout works</h2>
              <div className="space-y-12">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center font-bold text-blue-500">1</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Configure Your Targets</h3>
                    <p className="text-zinc-500">Add the career page URLs of companies you want to track and define your expertise with keywords like "React", "Node.js", or "Senior".</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-purple-600/20 border border-purple-500/20 flex items-center justify-center font-bold text-purple-500">2</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Automated Discovery</h3>
                    <p className="text-zinc-500">Our high-speed workers monitor those pages 24/7. When a new opening appears, we scrape the details and calculate an intelligent match score.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-500">3</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Apply with Confidence</h3>
                    <p className="text-zinc-500">Review your matched roles on the dashboard or get daily email digests. Apply to the highest-scoring jobs before the competition.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full"></div>
              <div className="relative rounded-3xl border border-white/10 bg-zinc-900/50 p-8 shadow-2xl">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold">V</div>
                          <div>
                            <p className="font-bold text-sm">Vercel</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Greenhouse</p>
                          </div>
                       </div>
                       <span className="text-xs font-bold text-emerald-500">Scanning...</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/10 border border-blue-500/30">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">S</div>
                          <div>
                            <p className="font-bold text-sm">Stripe</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Lever</p>
                          </div>
                       </div>
                       <span className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-500 text-[10px] font-bold">98% MATCH</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 opacity-50">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-500 font-bold">F</div>
                          <div>
                            <p className="font-bold text-sm">Figma</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Ashby</p>
                          </div>
                       </div>
                       <span className="text-xs font-bold text-zinc-500">Queued</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Logos */}
      <section className="relative z-10 py-20 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600 mb-10">Native ATS Integrations</p>
          <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-40">
            <span className="text-2xl font-black italic">Greenhouse</span>
            <span className="text-2xl font-black italic">Lever</span>
            <span className="text-2xl font-black italic">Ashby</span>
            <span className="text-2xl font-black italic">Workday</span>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="relative z-10 py-32 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Ready to find your next role?</h2>
          <Link
            href={isAuthenticated ? "/dashboard" : "/signup"}
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black rounded-full text-xl font-bold hover:bg-zinc-200 transition-all active:scale-95 shadow-2xl shadow-white/10"
          >
            Get Started for Free
            <ArrowRight className="h-6 w-6" />
          </Link>
          <div className="mt-20 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-12">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">JS</div>
              <span className="font-bold">JobScout</span>
            </div>
            <div className="flex gap-8 text-sm text-zinc-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Github</a>
            </div>
            <p className="text-sm text-zinc-500">© 2026 JobScout Intelligence. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

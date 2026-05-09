'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Building2, Globe, ExternalLink, Sparkles, Loader2, Check } from 'lucide-react';
import { useToast } from '@/providers/ToastProvider';

interface SuggestedCompany {
  name: string;
  url: string;
  sourceType: 'greenhouse' | 'lever' | 'ashby' | 'breezy' | 'workable';
  industry: string;
  isAdded?: boolean;
}

export default function DiscoveryPage() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SuggestedCompany[]>([]);
  const { addToast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setResults([]);

    try {
      const response = await fetch('/api/discovery/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      addToast('Discovery search failed', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddCompany = async (company: SuggestedCompany) => {
    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: company.name,
          careerPageUrl: company.url,
          sourceType: company.sourceType,
        }),
      });

      if (response.ok) {
        addToast(`${company.name} added to tracking!`, 'success');
        setResults(prev => prev.map(r => r.url === company.url ? { ...r, isAdded: true } : r));
      } else {
        const error = await response.json();
        addToast(error.message || 'Failed to add company', 'error');
      }
    } catch (err) {
      addToast('Network error while adding company', 'error');
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Discovery Mode</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Find hidden job boards and companies you haven&apos;t tracked yet. Search by industry, location, or technology.
        </p>
      </motion.div>

      {/* Discovery Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative group"
      >
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground group-focus-within:text-blue-500 transition-colors">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Fintech startups in Lagos, AI companies remote, Web3 Greenhouse boards..."
              className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-xl"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Discover'}
          </button>
        </form>
      </motion.div>

      {/* Results Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          {results.length > 0 ? 'Discovery Results' : isSearching ? 'Hunting for boards...' : 'Suggested Discoveries'}
        </h2>

        {results.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {results.map((result, index) => (
                <motion.div
                  key={result.url}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card border border-border rounded-2xl p-5 hover:shadow-xl hover:border-blue-500/20 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div className="px-2 py-1 bg-muted rounded text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {result.sourceType}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{result.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-1 flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {result.industry}
                  </p>
                  
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleAddCompany(result)}
                      disabled={result.isAdded}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                        result.isAdded 
                          ? 'bg-emerald-500/10 text-emerald-500 cursor-default' 
                          : 'bg-foreground text-background hover:bg-foreground/90 active:scale-95'
                      }`}
                    >
                      {result.isAdded ? (
                        <>
                          <Check className="h-4 w-4" />
                          Tracking
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Track Board
                        </>
                      )}
                    </button>
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-muted text-muted-foreground rounded-xl hover:bg-muted/80 hover:text-foreground transition-all"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : !isSearching && (
          <div className="rounded-3xl border-2 border-dashed border-border bg-card/30 p-20 text-center">
            <div className="mb-6 flex justify-center">
              <div className="h-20 w-20 rounded-full bg-blue-500/5 flex items-center justify-center">
                <Search className="h-10 w-10 text-blue-500/20" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Ready to expand your hunt?</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Enter keywords above to find new Greenhouse and Lever boards automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

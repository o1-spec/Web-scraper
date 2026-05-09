'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, RotateCcw, Building2, Search, X } from 'lucide-react';
import { Company, SourceType } from '@/types';
import { formatDateTime, getRelativeTime, getStatusBadgeColor, getSourceTypeLabel } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

interface FormData {
  name: string;
  careerPageUrl: string;
  sourceType: SourceType;
}

export default function CompaniesPage() {
  const { data: companies, mutate } = useSWR<Company[]>('/api/companies', fetcher, { fallbackData: [] });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    careerPageUrl: '',
    sourceType: 'custom',
  });

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({ name: '', careerPageUrl: '', sourceType: 'custom' });
    setShowModal(true);
  };

  const handleEditClick = (company: Company) => {
    setEditingId(company.id);
    setFormData({
      name: company.name,
      careerPageUrl: company.careerPageUrl,
      sourceType: company.sourceType,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.careerPageUrl) {
      alert('Please fill in all fields');
      return;
    }

    try {
      if (editingId) {
        await fetch(`/api/companies/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch('/api/companies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      mutate();
      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert('Failed to save company');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this company?')) {
      await fetch(`/api/companies/${id}`, { method: 'DELETE' });
      mutate();
    }
  };

  const handleRefresh = async (id: string) => {
    try {
      await fetch(`/api/companies/${id}/refresh`, { method: 'POST' });
      alert('Scraping job queued!');
      mutate();
    } catch (e) {
      alert('Failed to refresh');
    }
  };

  const filteredCompanies = companies ? companies.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())) : [];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tracked Companies</h1>
          <p className="mt-2 text-muted-foreground">
            Manage the career pages and sources you are currently monitoring.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium shadow-sm hover:shadow active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Add Company
        </button>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex gap-2"
      >
        <div className="relative flex-1 max-w-sm group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
      >
        {filteredCompanies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Company</th>
                  <th className="px-6 py-4 font-medium">Source Type</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Jobs Found</th>
                  <th className="px-6 py-4 font-medium">Last Checked</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCompanies.map((company, index) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    key={company.id}
                    className="bg-card hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 border border-border flex items-center justify-center font-bold text-muted-foreground text-xs shadow-sm">
                          {company.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{company.name}</p>
                          <a href={company.careerPageUrl} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px] block hover:underline hover:text-primary transition-colors">
                            {company.careerPageUrl.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        {getSourceTypeLabel(company.sourceType)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${getStatusBadgeColor(
                          company.status
                        )}`}
                      >
                        {company.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-foreground">{company.jobsFound}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {getRelativeTime(company.lastChecked)}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                          {formatDateTime(company.lastChecked).split(',')[1]}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleRefresh(company.id)}
                          className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-md transition-colors"
                          title="Force Refresh"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditClick(company)}
                          className="p-2 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 rounded-md transition-colors"
                          title="Edit Settings"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(company.id)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                          title="Delete Tracker"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center border-2 border-dashed border-border rounded-xl m-6">
            <div className="mb-4 flex justify-center">
              <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-foreground mb-1">
              {searchQuery ? 'No companies found' : 'No companies added yet'}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              {searchQuery ? 'Try adjusting your search query.' : 'Start tracking job sources by adding your first company careers page.'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAddClick}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Add First Company
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Glassmorphic Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, type: "spring", bounce: 0 }}
              className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {editingId ? 'Edit Tracker' : 'New Company Tracker'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Stripe"
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Careers Page URL
                  </label>
                  <input
                    type="url"
                    value={formData.careerPageUrl}
                    onChange={(e) => setFormData({ ...formData, careerPageUrl: e.target.value })}
                    placeholder="https://company.com/careers"
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Source Integration
                  </label>
                  <select
                    value={formData.sourceType}
                    onChange={(e) => setFormData({ ...formData, sourceType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="greenhouse">Greenhouse ATS</option>
                    <option value="lever">Lever ATS</option>
                    <option value="ashby">Ashby ATS</option>
                    <option value="custom">Custom Web Scraper</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 px-6 py-4 bg-muted/20 border-t border-border">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-input bg-background rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors font-medium text-sm shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm shadow-sm"
                >
                  {editingId ? 'Save Changes' : 'Create Tracker'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

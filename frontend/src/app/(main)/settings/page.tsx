'use client';

import { useState } from 'react';
import { Bell, Mail, Clock, Shield, Key, Webhook, Check } from 'lucide-react';
import { DigestSettings } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export default function SettingsPage() {
  const { data: serverSettings, mutate } = useSWR<DigestSettings>('/api/settings', fetcher);
  const [settings, setSettings] = useState<DigestSettings | null>(null);
  const [saved, setSaved] = useState(false);

  // Sync server data to local state when it loads
  if (serverSettings && !settings) {
    setSettings(serverSettings);
  }

  const handleChange = (key: keyof DigestSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  const handleSave = async () => {
    if (!settings) return;
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      mutate();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Failed to save settings');
    }
  };

  if (!settings) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-end justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Preferences</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account settings, notifications, and integrations.
          </p>
        </div>
      </motion.div>

      {/* Settings Grid */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column: Navigation/Sections (Placeholder for future routing, currently visual) */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="hidden md:block space-y-1"
        >
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-primary/10 text-primary transition-colors">
            <Bell className="h-4 w-4" />
            Email Digest
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Shield className="h-4 w-4" />
            Account Security
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Key className="h-4 w-4" />
            API Keys
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Webhook className="h-4 w-4" />
            Webhooks
          </button>
        </motion.div>

        {/* Right Column: Settings Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="md:col-span-2 space-y-6"
        >
          {/* Email Digest Card */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-border bg-muted/20">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Email Notifications</h2>
              <p className="text-sm text-muted-foreground mt-1">Configure how and when you receive job updates.</p>
            </div>

            <div className="p-6 space-y-8">
              {/* Enable Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-foreground">Daily Summary</label>
                  <p className="text-sm text-muted-foreground mt-1">Receive a digest of new matching roles.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={settings.enabled}
                    onChange={(e) => handleChange('enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary transition-colors"></div>
                </label>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Delivery Address</label>
                <div className="relative group max-w-md">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={settings.emailAddress}
                    onChange={(e) => handleChange('emailAddress', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm disabled:opacity-50"
                    disabled={!settings.enabled}
                  />
                </div>
              </div>

              {/* Grid Settings */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Frequency</label>
                  <select
                    value={settings.frequency}
                    onChange={(e) => handleChange('frequency', e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm appearance-none cursor-pointer disabled:opacity-50"
                    disabled={!settings.enabled}
                  >
                    <option value="daily">Daily</option>
                    <option value="every-2-days">Every 2 Days</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Preferred Time</label>
                  <div className="relative group max-w-md">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Clock className="h-4 w-4" />
                    </div>
                    <input
                      type="time"
                      value={settings.preferredTime}
                      onChange={(e) => handleChange('preferredTime', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm disabled:opacity-50"
                      disabled={!settings.enabled}
                    />
                  </div>
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">Minimum Match Threshold</label>
                  <span className="text-sm font-mono font-medium text-primary px-2 py-0.5 rounded-md bg-primary/10">
                    {settings.minimumMatchScore}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={settings.minimumMatchScore}
                  onChange={(e) => handleChange('minimumMatchScore', parseInt(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  disabled={!settings.enabled}
                />
                <p className="text-xs text-muted-foreground">
                  Only notify me about jobs that match my profile by at least {settings.minimumMatchScore}%.
                </p>
              </div>
            </div>

            {/* Footer / Actions */}
            <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between">
              <AnimatePresence>
                {saved && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium"
                  >
                    <Check className="h-4 w-4" />
                    Saved
                  </motion.div>
                )}
                {!saved && <div />}
              </AnimatePresence>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium shadow-sm text-sm"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

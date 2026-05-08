'use client';

import { useState } from 'react';
import { Bell, Mail, Clock } from 'lucide-react';
import { mockDigestSettings } from '@/lib/mockData';
import { DigestSettings } from '@/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<DigestSettings>(mockDigestSettings);
  const [saved, setSaved] = useState(false);

  const handleChange = (key: keyof DigestSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Configure your email digest and notification preferences.
        </p>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">
            ✓ Settings saved successfully
          </p>
        </div>
      )}

      {/* Email Digest Section */}
      <div className="rounded-lg border border-border bg-white p-6 shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-foreground">Email Digest</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Get regular summaries of new job postings matching your preferences.
          </p>
        </div>

        {/* Enable Digest Toggle */}
        <div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-foreground">
                Enable Daily Digest
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Receive email summaries of new matching jobs
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => handleChange('enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              value={settings.emailAddress}
              onChange={(e) => handleChange('emailAddress', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Digest Frequency
          </label>
          <select
            value={settings.frequency}
            onChange={(e) => handleChange('frequency', e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="every-2-days">Every 2 Days</option>
            <option value="weekly">Weekly</option>
          </select>
          <p className="text-xs text-muted-foreground mt-2">
            How often you&apos;d like to receive job summaries
          </p>
        </div>

        {/* Preferred Time */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Preferred Send Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="time"
              value={settings.preferredTime}
              onChange={(e) => handleChange('preferredTime', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            What time should we send your digest? (24-hour format)
          </p>
        </div>

        {/* Minimum Match Score */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Minimum Match Score
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={settings.minimumMatchScore}
              onChange={(e) => handleChange('minimumMatchScore', parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-medium text-foreground w-12 text-right">
              {settings.minimumMatchScore}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Only include jobs matching {settings.minimumMatchScore}% or higher
          </p>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-border">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save Settings
          </button>
        </div>
      </div>

      {/* Additional Settings Section */}
      <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Other Settings</h3>

        <div className="space-y-4">
          <div className="flex items-start justify-between pb-4 border-b border-border">
            <div>
              <p className="font-medium text-foreground">Account</p>
              <p className="text-sm text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>
            <button className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-gray-50 transition-colors">
              Edit
            </button>
          </div>

          <div className="flex items-start justify-between pb-4 border-b border-border">
            <div>
              <p className="font-medium text-foreground">Notifications</p>
              <p className="text-sm text-muted-foreground">
                Configure browser and push notifications
              </p>
            </div>
            <button className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-gray-50 transition-colors">
              Edit
            </button>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-foreground">API Keys</p>
              <p className="text-sm text-muted-foreground">
                Manage API keys for integrations
              </p>
            </div>
            <button className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-gray-50 transition-colors">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { mockKeywords } from '@/lib/mockData';
import { Keyword } from '@/types';
import { formatDate } from '@/lib/utils';

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>(mockKeywords);
  const [inputValue, setInputValue] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newKeyword: Keyword = {
        id: Date.now().toString(),
        keyword: inputValue.trim(),
        createdAt: new Date(),
      };
      setKeywords([newKeyword, ...keywords]);
      setInputValue('');
    }
  };

  const handleDelete = (id: string) => {
    setKeywords(keywords.filter((k) => k.id !== id));
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Keywords</h1>
        <p className="mt-2 text-muted-foreground">
          Manage keywords to track specific roles, technologies, and seniority levels.
        </p>
      </div>

      {/* Add Keyword Form */}
      <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">Add New Keyword</h2>
        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g., React, senior, remote..."
            className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">
          Keywords will help JobScout match relevant job postings to your interests.
        </p>
      </div>

      {/* Keywords List */}
      <div className="rounded-lg border border-border bg-white shadow-sm overflow-hidden">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">
            Tracked Keywords ({keywords.length})
          </h2>
        </div>

        {keywords.length > 0 ? (
          <div className="divide-y divide-border">
            {keywords.map((keyword) => (
              <div
                key={keyword.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{keyword.keyword}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Added on {formatDate(keyword.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(keyword.id)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Delete"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.972 1.972 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No keywords yet
            </h3>
            <p className="text-muted-foreground">
              Add keywords above to start matching relevant jobs.
            </p>
          </div>
        )}
      </div>

      {/* Examples Section */}
      <div className="rounded-lg border border-border bg-blue-50 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Keyword Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {['React', 'Next.js', 'TypeScript', 'Node.js', 'Python'].map((tech) => (
                <span
                  key={tech}
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white text-blue-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Seniority Levels</h4>
            <div className="flex flex-wrap gap-2">
              {['Junior', 'Entry Level', 'Senior', 'Lead', 'Intern', 'Graduate'].map((level) => (
                <span
                  key={level}
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white text-blue-700"
                >
                  {level}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

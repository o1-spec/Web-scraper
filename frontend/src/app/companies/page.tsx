'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, RotateCcw } from 'lucide-react';
import { mockCompanies } from '@/lib/mockData';
import { Company, SourceType } from '@/types';
import { formatDateTime, getRelativeTime, getStatusBadgeColor, getSourceTypeLabel } from '@/lib/utils';

interface FormData {
  name: string;
  careerPageUrl: string;
  sourceType: SourceType;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const handleSave = () => {
    if (!formData.name || !formData.careerPageUrl) {
      alert('Please fill in all fields');
      return;
    }

    if (editingId) {
      setCompanies(
        companies.map((c) =>
          c.id === editingId
            ? {
                ...c,
                name: formData.name,
                careerPageUrl: formData.careerPageUrl,
                sourceType: formData.sourceType,
              }
            : c
        )
      );
    } else {
      const newCompany: Company = {
        id: Date.now().toString(),
        name: formData.name,
        careerPageUrl: formData.careerPageUrl,
        sourceType: formData.sourceType,
        lastChecked: new Date(),
        jobsFound: 0,
        status: 'pending',
      };
      setCompanies([...companies, newCompany]);
    }

    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this company?')) {
      setCompanies(companies.filter((c) => c.id !== id));
    }
  };

  const handleRefresh = (id: string) => {
    setCompanies(
      companies.map((c) =>
        c.id === id
          ? { ...c, status: 'pending' as const, lastChecked: new Date() }
          : c
      )
    );
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Companies</h1>
          <p className="mt-2 text-muted-foreground">
            Manage career pages and job sources you&apos;re monitoring.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Company
        </button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-white shadow-sm overflow-hidden">
        {companies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Source Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Jobs Found
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Last Checked
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr
                    key={company.id}
                    className="border-b border-border hover:bg-gray-50 transition-colors last:border-b-0"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{company.name}</p>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {company.careerPageUrl}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-foreground">
                        {getSourceTypeLabel(company.sourceType)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                          company.status
                        )}`}
                      >
                        {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-foreground">
                        {company.jobsFound}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-foreground">
                          {getRelativeTime(company.lastChecked)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(company.lastChecked)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRefresh(company.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Refresh"
                        >
                          <RotateCcw className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleEditClick(company)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(company.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                    d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No companies added yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start tracking job sources by adding your first company.
            </p>
            <button
              onClick={handleAddClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="h-4 w-4" />
              Add First Company
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {editingId ? 'Edit Company' : 'Add Company'}
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Stripe"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Career Page URL
                </label>
                <input
                  type="url"
                  value={formData.careerPageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, careerPageUrl: e.target.value })
                  }
                  placeholder="https://company.com/careers"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Source Type
                </label>
                <select
                  value={formData.sourceType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sourceType: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="greenhouse">Greenhouse</option>
                  <option value="lever">Lever</option>
                  <option value="ashby">Ashby</option>
                  <option value="custom">Custom Page</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors font-medium text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

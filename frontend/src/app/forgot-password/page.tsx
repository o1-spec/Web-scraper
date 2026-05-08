'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Loader, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { resetPassword, isLoading } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return;
    }

    try {
      await resetPassword(email);
      setSubmitted(true);
      addToast('Check your email for password reset instructions', 'success');
    } catch (err) {
      addToast((err as Error).message || 'Failed to send reset email', 'error');
      setError((err as Error).message || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">JobScout</h1>
          <p className="text-gray-600">Reset your password</p>
        </div>

        {/* Reset Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {!submitted ? (
            <>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Forgot your password?</h2>
                <p className="text-gray-600 text-sm mt-1">
                  No worries. Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        error ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader className="h-5 w-5 animate-spin" /> : null}
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
                <p className="text-gray-600 text-sm mt-2">
                  We&apos;ve sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-gray-600 text-sm mt-4">
                  The link will expire in 24 hours. If you don&apos;t see the email, check your spam folder.
                </p>
              </div>

              <button
                onClick={() => router.push('/login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
              >
                Back to Login
              </button>
            </>
          )}

          {/* Back to Login Link */}
          <Link href="/login" className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Loader2, ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';
import AuthLayout from '@/components/layout/AuthLayout';
import { motion } from 'framer-motion';

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
      addToast('Check your email for instructions', 'success');
    } catch (err) {
      addToast((err as Error).message || 'Failed to send reset email', 'error');
      setError((err as Error).message || 'Failed to send reset email');
    }
  };

  return (
    <AuthLayout
      title="Secure your account access."
      subtitle="We'll help you get back on track so you can continue monitoring the best career opportunities."
    >
      <div className="space-y-6">
        {!submitted ? (
          <>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Reset password
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your email and we&apos;ll send you a reset link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow ${
                      error ? 'border-destructive focus-visible:ring-destructive' : 'border-input hover:border-border/80'
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {error && <p className="text-[0.8rem] font-medium text-destructive mt-1">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center w-full rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-2 group shadow-sm"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {isLoading ? 'Sending link...' : 'Send reset link'}
                {!isLoading && <Send className="ml-2 h-4 w-4 opacity-70 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />}
              </button>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4 py-4"
          >
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/10 mb-2">
              <Mail className="h-8 w-8 text-emerald-600 dark:text-emerald-500" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Check your email
            </h2>
            <p className="text-sm text-muted-foreground">
              We&apos;ve sent a password reset link to <span className="font-medium text-foreground">{email}</span>
            </p>
            <p className="text-xs text-muted-foreground pt-2">
              The link will expire in 24 hours. If you don&apos;t see it, check your spam folder.
            </p>

            <button
              onClick={() => router.push('/login')}
              className="inline-flex items-center justify-center w-full rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-4 shadow-sm"
            >
              Return to sign in
            </button>
          </motion.div>
        )}

        <div className="flex justify-center pt-2">
          <Link href="/login" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

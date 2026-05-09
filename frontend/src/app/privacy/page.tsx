'use client';

import AuthLayout from '@/components/layout/AuthLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Eye, Server, Cookie, ArrowLeft } from 'lucide-react';

const sections = [
  {
    title: "1. Data Collection",
    content: "We collect information essential for your job tracking experience, including your name, email, and tracking preferences. We do not sell your personal data to third parties.",
    icon: Eye,
    color: "text-blue-500"
  },
  {
    title: "2. Data Usage",
    content: "Your data is used solely to provide personalized job matching, send tracking alerts, and improve our scraping accuracy for the companies you monitor.",
    icon: Server,
    color: "text-emerald-500"
  },
  {
    title: "3. Information Security",
    content: "We utilize advanced encryption and secure hashing algorithms (Bcrypt) to protect your passwords and sensitive information. Your tokens are stored securely using HTTP-only cookies.",
    icon: Lock,
    color: "text-indigo-500"
  },
  {
    title: "4. Cookie Policy",
    content: "We use essential cookies to maintain your session and security. You can control cookie preferences through your browser settings, though some features may be limited.",
    icon: Cookie,
    color: "text-amber-500"
  }
];

export default function PrivacyPage() {
  return (
    <AuthLayout
      title="Privacy Policy"
      subtitle="Your privacy is our priority. Discover how we protect and manage your data at JobScout."
    >
      <div className="space-y-8 pb-12">
        <Link href="/signup" className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors mb-2">
          <ArrowLeft className="w-3 h-3" />
          Back to Registration
        </Link>

        <div className="space-y-6">
          {sections.map((section, idx) => (
            <motion.section
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div className="flex gap-4 p-4 rounded-xl border border-border bg-card/50 hover:bg-card hover:shadow-sm transition-all duration-300">
                <div className={`mt-1 p-2 rounded-lg bg-muted flex-shrink-0 ${section.color}`}>
                  <section.icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-sm font-bold text-foreground tracking-tight">
                    {section.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Data Concerns? <span className="text-foreground font-medium">privacy@jobscout.app</span>
          </p>
          <Link href="/login" className="text-xs font-semibold text-primary hover:underline">
            Manage your account
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

'use client';

import AuthLayout from '@/components/layout/AuthLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, FileText, UserCheck, AlertCircle, ArrowLeft } from 'lucide-react';

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing or using JobScout, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you are prohibited from using the service. We reserve the right to update these terms at any time.",
    icon: UserCheck,
    color: "text-blue-500"
  },
  {
    title: "2. Service Description",
    content: "JobScout provides automated monitoring of career pages and job boards. While we strive for 100% accuracy, the nature of web scraping means we cannot guarantee that every job listing is perfectly synchronized with the source at all times.",
    icon: FileText,
    color: "text-emerald-500"
  },
  {
    title: "3. User Responsibilities",
    content: "You are responsible for safeguarding your account credentials. Any activity performed under your account is your sole responsibility. You agree not to use JobScout for any illegal or unauthorized purposes.",
    icon: Shield,
    color: "text-indigo-500"
  },
  {
    title: "4. Limitations of Liability",
    content: "JobScout is provided 'as is'. We shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.",
    icon: AlertCircle,
    color: "text-amber-500"
  }
];

export default function TermsPage() {
  return (
    <AuthLayout
      title="Terms of Service"
      subtitle="Please read our terms carefully. They govern your use of the JobScout platform and services."
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
            Questions? Contact <span className="text-foreground font-medium">legal@jobscout.app</span>
          </p>
          <Link href="/login" className="text-xs font-semibold text-primary hover:underline">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

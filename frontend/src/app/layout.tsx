import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { AuthProvider } from '@/providers/AuthProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { ToastContainer } from '@/components/Toast';
import { ThemeProvider } from '@/providers/ThemeProvider';
import './globals.css';

const outfit = Outfit({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'JobScout - Personal Job Monitoring Dashboard',
  description:
    'Track jobs from company career pages, Greenhouse, Lever, Ashby, and more.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect fill="%232563eb" width="32" height="32" rx="4"/><text x="50%" y="50%" font-size="14" font-weight="bold" fill="white" text-anchor="middle" dy=".3em">JS</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={outfit.variable}>
      <body className={`${outfit.className} bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
          <ToastProvider>
            {children}
            <ToastContainer />
          </ToastProvider>
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

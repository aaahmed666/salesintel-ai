import type { ReactNode } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { AppShell } from '@/features/shell';
import { AuthGuard } from '@/features/auth/components/auth-guard';

interface DashboardLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

/**
 * The (dashboard) segment wraps all authenticated business screens in the
 * persistent application shell (sidebar + header + breadcrumbs), behind a
 * client-side auth guard that redirects unauthenticated users to login.
 */
export default async function DashboardGroupLayout({ children, params }: DashboardLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}

'use client';

import { useEffect } from 'react';
import { canAccessPath, ROUTES } from '@salesintel/config';
import { Icon } from './icon';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useCurrentUser } from '../hooks';

/**
 * Route-level RBAC. The sidebar already hides links a role may not use, but
 * that only protects discovery — a user can still deep-link a restricted URL.
 * This guard resolves the role requirement for the current path from the nav
 * config and, when the signed-in role is not permitted, shows an accessible
 * "access denied" state and redirects to the dashboard. Paths without a role
 * restriction render their children untouched.
 */
export function RoleGuard({ children }: { children: React.ReactNode }) {
  const t = useTranslations('shell');
  const user = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();
  const allowed = canAccessPath(pathname, user.role);

  useEffect(() => {
    if (!allowed) {
      const id = window.setTimeout(() => router.replace(ROUTES.dashboard.root), 1200);
      return () => window.clearTimeout(id);
    }
  }, [allowed, router]);

  if (!allowed) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="flex min-h-[60vh] flex-col items-center justify-center gap-md px-lg text-center"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-error-container text-on-error-container">
          <Icon name="lock" size={32} />
        </span>
        <h1 className="font-display text-headline-md text-on-surface">{t('accessDenied.title')}</h1>
        <p className="max-w-sm text-body-md text-on-surface-variant">
          {t('accessDenied.description')}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { usePathname } from '@/i18n/navigation';

export interface Crumb {
  label: string;
  href: string;
}

/** Known segment → i18n label key. Unknown segments are title-cased. */
const SEGMENT_LABELS: Record<string, string> = {
  dashboard: 'nav.intelligence',
  leads: 'nav.leads',
  pipelines: 'nav.pipelines',
  activity: 'nav.activity',
  analytics: 'nav.analytics',
  settings: 'nav.settings',
  upload: 'meetings.upload.title',
  meetings: 'meetings.directory.title',
};

/**
 * Derive breadcrumbs from the locale-agnostic pathname. The locale prefix is
 * stripped by next-intl's usePathname, so segments map cleanly to labels.
 */
export function useBreadcrumbs(): Crumb[] {
  const pathname = usePathname();
  const t = useTranslations();

  return useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const crumbs: Crumb[] = [{ label: t('shell.breadcrumbs.home'), href: '/dashboard' }];

    let href = '';
    for (const segment of segments) {
      href += `/${segment}`;
      const key = SEGMENT_LABELS[segment];
      const label = key
        ? t(key as never)
        : segment.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      crumbs.push({ label, href });
    }
    return crumbs;
  }, [pathname, t]);
}

'use client';

import { Fragment } from 'react';
import { cn } from '@salesintel/ui';
import { Link } from '@/i18n/navigation';
import { useBreadcrumbs } from '../hooks';
import { Icon } from './icon';

/** Locale-aware breadcrumb trail derived from the current pathname. */
export function Breadcrumbs({ className }: { className?: string }) {
  const crumbs = useBreadcrumbs();

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1', className)}>
      <ol className="flex items-center gap-1 text-body-sm">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <Fragment key={crumb.href}>
              {i > 0 && (
                <li aria-hidden className="text-on-surface-variant/60">
                  <Icon name="chevron_right" size={18} className="rtl:rotate-180" />
                </li>
              )}
              <li>
                {isLast ? (
                  <span aria-current="page" className="font-medium text-on-surface">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

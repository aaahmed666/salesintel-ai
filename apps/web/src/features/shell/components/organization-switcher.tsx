'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { Organization } from '@salesintel/types';
import {
  Avatar,
  AvatarFallback,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Skeleton,
} from '@salesintel/ui';
import { useOrganizations } from '../queries';
import { Icon } from './icon';

/**
 * Organization switcher. Selection is local UI state here (the mock has no
 * "active org" concept yet); swapping to a real mutation later is a one-liner.
 */
export function OrganizationSwitcher({ className }: { className?: string }) {
  const t = useTranslations('shell.org');
  const tPlan = useTranslations('shell.org.plan');
  const { data: orgs, isPending } = useOrganizations();
  const [activeId, setActiveId] = useState<string | null>(null);

  if (isPending || !orgs) {
    return <Skeleton className={cn('h-10 w-44 rounded-lg', className)} />;
  }

  const active: Organization = orgs.find((o) => o.id === activeId) ?? orgs[0]!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t('switch')}
          className={cn(
            'flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-2.5 py-1.5 transition-colors hover:bg-surface-container-low',
            className,
          )}
        >
          <Avatar className="h-7 w-7 rounded-md">
            <AvatarFallback className="rounded-md text-label-sm">{active.initials}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[10rem] truncate text-body-sm font-semibold text-on-surface sm:inline">
            {active.name}
          </span>
          <Icon name="unfold_more" size={18} className="text-on-surface-variant" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[16rem]">
        <DropdownMenuLabel>{t('current')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {orgs.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onSelect={() => setActiveId(org.id)}
            className="justify-between"
          >
            <span className="flex items-center gap-2">
              <Avatar className="h-7 w-7 rounded-md">
                <AvatarFallback className="rounded-md text-label-sm">{org.initials}</AvatarFallback>
              </Avatar>
              <span className="flex flex-col">
                <span className="text-body-sm font-medium text-on-surface">{org.name}</span>
                <span className="text-label-sm text-on-surface-variant">{tPlan(org.plan)}</span>
              </span>
            </span>
            {org.id === active.id && (
              <Icon name="check" size={18} className="text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

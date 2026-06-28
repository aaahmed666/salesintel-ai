'use client';

import { useTranslations } from 'next-intl';
import { DIRECTORY_STATUS_FILTERS } from '@salesintel/config';
import type { MeetingStatus } from '@salesintel/types';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@salesintel/ui';
import { Icon } from '@/features/shell';

interface DirectoryToolbarProps {
  status: MeetingStatus | 'all';
  onStatusChange: (status: MeetingStatus | 'all') => void;
}

/**
 * Header row for the directory card: title plus the Filter / Export / Create
 * Lead actions from the design. The filter is a status dropdown driving the
 * server query.
 */
export function DirectoryToolbar({ status, onStatusChange }: DirectoryToolbarProps) {
  const t = useTranslations('meetings.directory');
  const tStatus = useTranslations('meetings.status');

  return (
    <div className="gap-md flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <h2 className="font-display text-headline-md text-on-surface">{t('title')}</h2>

      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="secondary" size="sm" className="gap-2">
              <Icon name="filter_list" size={18} />
              {status === 'all' ? t('filter') : tStatus(status)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[12rem]">
            {DIRECTORY_STATUS_FILTERS.map((option) => (
              <DropdownMenuItem
                key={option}
                onSelect={() => onStatusChange(option)}
                className="justify-between"
              >
                {option === 'all' ? t('allStatuses') : tStatus(option)}
                {status === option ? (
                  <Icon name="check" size={16} className="text-primary" />
                ) : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button type="button" variant="secondary" size="sm" className="gap-2">
          <Icon name="download" size={18} />
          {t('export')}
        </Button>

        <Button type="button" variant="primary" size="sm" className="gap-2">
          <Icon name="add" size={18} />
          {t('createLead')}
        </Button>
      </div>
    </div>
  );
}

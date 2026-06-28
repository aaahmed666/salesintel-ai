'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@salesintel/ui';

interface DirectoryPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** "Showing N of M meetings" summary with Previous / Next controls. */
export function DirectoryPagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
}: DirectoryPaginationProps) {
  const t = useTranslations('meetings.directory');
  const shown = Math.min(pageSize, total - (page - 1) * pageSize);

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-body-sm text-on-surface-variant">
        {t('showing', { count: Math.max(0, shown), total })}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          {t('previous')}
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          {t('next')}
        </Button>
      </div>
    </div>
  );
}

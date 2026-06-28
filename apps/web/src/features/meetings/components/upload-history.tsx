'use client';

import { useLocale, useTranslations } from 'next-intl';
import type { Meeting } from '@salesintel/types';
import { Button, Card, Skeleton } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import { formatBytes, formatRelative } from '../hooks';
import { MeetingStatusBadge } from './meeting-status-badge';

interface UploadHistoryProps {
  meetings: Meeting[] | undefined;
  isLoading: boolean;
  onRetry: (id: string) => void;
  retryingId?: string;
}

/**
 * Tabular history of all uploads. Failed rows expose a retry action; the table
 * collapses to stacked cards on small screens for responsiveness.
 */
export function UploadHistory({ meetings, isLoading, onRetry, retryingId }: UploadHistoryProps) {
  const t = useTranslations('meetings.history');
  const tQueue = useTranslations('meetings.queue');
  const locale = useLocale();

  return (
    <Card className="p-lg">
      <h2 className="font-display text-headline-md text-on-surface">{t('title')}</h2>

      {isLoading ? (
        <div className="mt-md space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !meetings || meetings.length === 0 ? (
        <p className="py-xl text-body-sm text-on-surface-variant text-center">{t('empty')}</p>
      ) : (
        <div className="mt-md overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse">
            <thead>
              <tr className="border-outline-variant text-label-sm text-on-surface-variant border-b text-start uppercase">
                <th className="px-2 py-2.5 text-start font-semibold">{t('columnName')}</th>
                <th className="px-2 py-2.5 text-start font-semibold">{t('columnSize')}</th>
                <th className="px-2 py-2.5 text-start font-semibold">{t('columnStatus')}</th>
                <th className="px-2 py-2.5 text-start font-semibold">{t('columnDate')}</th>
                <th className="px-2 py-2.5 text-end font-semibold">{t('columnScore')}</th>
              </tr>
            </thead>
            <tbody className="divide-outline-variant divide-y">
              {meetings.map((m) => (
                <tr key={m.id} className="text-body-sm">
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-on-surface font-medium">{m.title}</span>
                      {m.status === 'failed' && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          loading={retryingId === m.id}
                          onClick={() => onRetry(m.id)}
                          className="text-primary h-7 gap-1 px-2"
                        >
                          <Icon name="refresh" size={16} />
                          {tQueue('retry')}
                        </Button>
                      )}
                    </div>
                  </td>
                  <td className="text-on-surface-variant px-2 py-3">
                    {formatBytes(m.size, locale)}
                  </td>
                  <td className="px-2 py-3">
                    <MeetingStatusBadge status={m.status} animated={false} />
                  </td>
                  <td className="text-on-surface-variant px-2 py-3">
                    {formatRelative(m.uploadedAt, locale)}
                  </td>
                  <td className="text-on-surface px-2 py-3 text-end font-semibold">
                    {m.score !== undefined ? `${m.score}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

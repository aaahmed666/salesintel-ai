'use client';

import { useLocale, useTranslations } from 'next-intl';
import type { Meeting, UploadItem } from '@salesintel/types';
import { Badge, Card, cn, Progress, Skeleton } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import { formatBytes, formatRelative } from '../hooks';
import { MeetingStatusBadge } from './meeting-status-badge';
import { UploadQueueItem } from './upload-queue-item';

const EXT_ICON: Record<string, string> = {
  mp4: 'movie',
  webm: 'movie',
  mp3: 'mic',
  wav: 'mic',
  m4a: 'mic',
};

function fileIcon(fileName: string): string {
  const ext = /\.([^.]+)$/.exec(fileName.toLowerCase())?.[1] ?? '';
  return EXT_ICON[ext] ?? 'description';
}

/** A server-side meeting row in the processing queue. */
function MeetingRow({ meeting }: { meeting: Meeting }) {
  const t = useTranslations('meetings.queue');
  const locale = useLocale();
  const isActive = meeting.status !== 'completed' && meeting.status !== 'failed';

  return (
    <div className="border-outline-variant py-md border-t first:border-t-0">
      <div className="flex items-start gap-3">
        <span className="bg-surface-container-high text-on-surface-variant flex h-11 w-11 shrink-0 items-center justify-center rounded-lg">
          <Icon name={fileIcon(meeting.fileName)} size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-body-sm text-on-surface font-semibold">{meeting.title}</p>
            {isActive && meeting.estimatedMinutesLeft !== undefined && (
              <span className="text-label-md text-on-surface-variant shrink-0 font-medium">
                {t('estLeft', { minutes: meeting.estimatedMinutesLeft })}
              </span>
            )}
          </div>
          <p className="text-label-md text-on-surface-variant">
            {meeting.status === 'completed'
              ? t('processedAgo', { time: formatRelative(meeting.uploadedAt, locale) })
              : `${formatBytes(meeting.size, locale)} · ${formatRelative(meeting.uploadedAt, locale)}`}
          </p>

          {isActive && <Progress value={meeting.progress} className="mt-2.5" />}

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <MeetingStatusBadge status={meeting.status} />
            {meeting.status === 'completed' && meeting.score !== undefined && (
              <Badge tone="success">{meeting.score}% Positive</Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProcessingQueueProps {
  meetings: Meeting[] | undefined;
  isLoading: boolean;
  uploads: UploadItem[];
  onRetry: (id: string) => void;
  onRemove: (id: string) => void;
  onCancel: (id: string) => void;
}

/** Right-hand column: live client uploads on top, server meetings below. */
export function ProcessingQueue({
  meetings,
  isLoading,
  uploads,
  onRetry,
  onRemove,
  onCancel,
}: ProcessingQueueProps) {
  const t = useTranslations('meetings.queue');
  const activeServer = meetings?.filter(
    (m) => m.status !== 'completed' && m.status !== 'failed',
  ).length;
  const activeTotal =
    (activeServer ?? 0) +
    uploads.filter((u) => u.state === 'uploading' || u.state === 'queued').length;

  const liveUploads = uploads.filter((u) => u.state !== 'success');

  return (
    <Card className="p-lg flex h-full flex-col">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-headline-md text-on-surface">{t('title')}</h2>
        <Badge tone="info">{t('active', { count: activeTotal })}</Badge>
      </div>

      <div className="mt-md flex-1 overflow-y-auto">
        {liveUploads.length > 0 && (
          <div className="divide-outline-variant border-outline-variant pb-sm divide-y border-b">
            {liveUploads.map((item) => (
              <UploadQueueItem
                key={item.id}
                item={item}
                onRetry={onRetry}
                onRemove={onRemove}
                onCancel={onCancel}
              />
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="pt-md space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : meetings && meetings.length > 0 ? (
          <div className={cn(liveUploads.length > 0 && 'pt-sm')}>
            {meetings.map((m) => (
              <MeetingRow key={m.id} meeting={m} />
            ))}
          </div>
        ) : liveUploads.length === 0 ? (
          <p className="py-xl text-body-sm text-on-surface-variant text-center">{t('empty')}</p>
        ) : null}
      </div>

      <div className="mt-md border-outline-variant pt-md border-t">
        <div className="text-label-md text-on-surface-variant flex items-center justify-between font-medium">
          <span>{t('tokens')}</span>
          <span className="text-on-surface font-semibold">1,450 / 2,000</span>
        </div>
        <Progress value={72} className="mt-2" />
      </div>
    </Card>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import type { UploadItem } from '@salesintel/types';
import { Button, cn, Progress } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import { formatBytes } from '../hooks';

const EXT_ICON: Record<string, string> = {
  mp4: 'movie',
  webm: 'movie',
  mp3: 'graphic_eq',
  wav: 'graphic_eq',
  m4a: 'graphic_eq',
};

interface UploadQueueItemProps {
  item: UploadItem;
  onRetry: (id: string) => void;
  onRemove: (id: string) => void;
  onCancel: (id: string) => void;
}

/** A single in-flight/queued client upload with live progress and controls. */
export function UploadQueueItem({ item, onRetry, onRemove, onCancel }: UploadQueueItemProps) {
  const t = useTranslations('meetings.queue');
  const tErr = useTranslations();
  const locale = useLocale();

  const isError = item.state === 'error';
  const isUploading = item.state === 'uploading' || item.state === 'queued';
  const isDone = item.state === 'success';

  return (
    <div className="py-sm flex items-start gap-3">
      <span
        className={cn(
          'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
          isError
            ? 'bg-error-container text-on-error-container'
            : 'bg-surface-container-high text-on-surface-variant',
        )}
      >
        <Icon name={isError ? 'error' : (EXT_ICON[item.extension] ?? 'description')} size={22} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-body-sm text-on-surface truncate font-semibold">{item.fileName}</p>
          <span className="text-label-md text-on-surface-variant shrink-0">
            {Math.round(item.progress)}%
          </span>
        </div>
        <p className="text-label-md text-on-surface-variant">{formatBytes(item.size, locale)}</p>

        {isError ? (
          <p className="text-label-md text-error mt-1">{tErr(item.errorKey as never)}</p>
        ) : (
          <Progress value={item.progress} tone={isDone ? 'success' : 'gradient'} className="mt-2" />
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {isError && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t('retry')}
            onClick={() => onRetry(item.id)}
            className="text-primary h-8 w-8"
          >
            <Icon name="refresh" size={18} />
          </Button>
        )}
        {isUploading && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t('cancel')}
            onClick={() => onCancel(item.id)}
            className="text-on-surface-variant h-8 w-8"
          >
            <Icon name="close" size={18} />
          </Button>
        )}
        {(isError || isDone || item.state === 'canceled') && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t('remove')}
            onClick={() => onRemove(item.id)}
            className="text-on-surface-variant h-8 w-8"
          >
            <Icon name="delete" size={18} />
          </Button>
        )}
      </div>
    </div>
  );
}

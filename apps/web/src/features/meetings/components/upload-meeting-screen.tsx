'use client';

import { useTranslations } from 'next-intl';
import { Button, Card } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import { useFileUpload } from '../hooks';
import { useMeetings, useRetryUpload } from '../queries';
import { IntegrationCards } from './integration-cards';
import { ProcessingQueue } from './processing-queue';
import { UploadDropzone } from './upload-dropzone';
import { UploadHistory } from './upload-history';

/**
 * Upload Meeting Processing screen. Two-column layout (drop area + processing
 * queue) over a feature banner, integration tiles, and full upload history —
 * matching the source design. Collapses to a single column on tablet/mobile.
 */
export function UploadMeetingScreen() {
  const t = useTranslations('meetings.upload');
  const upload = useFileUpload();
  const { data: meetings, isPending } = useMeetings();
  const retry = useRetryUpload();

  return (
    <div className="space-y-lg p-md lg:p-lg mx-auto w-full max-w-[88rem]">
      {/* Title + calendar link actions */}
      <div className="gap-md flex flex-col lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="font-display text-headline-lg text-on-surface">{t('title')}</h1>
          <p className="text-body-md text-on-surface-variant mt-1">{t('subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm">
            <Icon name="calendar_month" size={18} className="text-on-surface-variant" />
            {t('linkGoogle')}
          </Button>
          <Button variant="secondary" size="sm">
            <Icon name="mail" size={18} className="text-on-surface-variant" />
            {t('linkOutlook')}
          </Button>
        </div>
      </div>

      {/* Two-column: dropzone + feature banner | processing queue */}
      <div className="gap-lg grid grid-cols-1 lg:grid-cols-2">
        <div className="space-y-lg">
          <UploadDropzone onFiles={upload.addFiles} />

          <Card className="bg-primary-container/[0.06] flex items-start gap-3">
            <span className="bg-primary-container/15 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-lg">
              <Icon name="auto_awesome" size={24} />
            </span>
            <div>
              <p className="text-body-sm text-on-surface font-semibold">{t('newFeature')}</p>
              <p className="text-body-sm text-on-surface-variant mt-0.5">{t('newFeatureDesc')}</p>
            </div>
          </Card>
        </div>

        <ProcessingQueue
          meetings={meetings}
          isLoading={isPending}
          uploads={upload.items}
          onRetry={upload.retry}
          onRemove={upload.remove}
          onCancel={upload.cancel}
        />
      </div>

      <IntegrationCards />

      <UploadHistory
        meetings={meetings}
        isLoading={isPending}
        onRetry={(id) => retry.mutate(id)}
        retryingId={retry.isPending ? (retry.variables as string) : undefined}
      />
    </div>
  );
}

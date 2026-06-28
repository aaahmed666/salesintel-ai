'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@salesintel/ui';
import { StageBadge } from '@/features/pipeline/components/stage-badge';
import type { DealProfile } from '@salesintel/types';

interface DealProfileHeaderProps {
  deal: DealProfile;
}

export function DealProfileHeader({ deal }: DealProfileHeaderProps) {
  const t = useTranslations('dealProfile.overview');

  return (
    <div className="mb-xl flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-base flex items-center gap-xs">
          <span className="rounded-full bg-secondary-container/10 px-sm py-xs font-label-sm text-label-sm text-secondary">
            {deal.tier}
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            • ID: {deal.id}
          </span>
        </div>
        <h2 className="font-headline-xl text-headline-xl text-on-background">
          {deal.title}
        </h2>
        <div className="mt-sm flex items-center gap-md">
          <div className="flex items-center gap-xs">
            <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
            <span className="font-body-md text-body-md font-semibold">
              <StageBadge stage={deal.stage} />
            </span>
          </div>
          <span className="text-outline">|</span>
          <span className="text-on-surface-variant">
            {t('lastActivity', { time: '2 hours ago' })}
          </span>
        </div>
      </div>
      <div className="flex gap-sm">
        <Button
          variant="secondary"
          className="glass-panel rounded-xl font-label-md text-label-md hover:bg-surface-container transition-colors"
        >
          {t('editDeal')}
        </Button>
        <Button
          variant="primary"
          className="rounded-xl font-label-md text-label-md shadow-lg shadow-primary/20"
        >
          {t('closeDeal')}
        </Button>
      </div>
    </div>
  );
}

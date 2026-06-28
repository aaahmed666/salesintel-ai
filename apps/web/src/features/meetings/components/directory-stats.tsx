'use client';

import { useTranslations } from 'next-intl';
import { Card } from '@salesintel/ui';
import { Icon } from '@/features/shell';

/** Top KPI cards from the directory design (static summary figures). */
export function DirectoryStats() {
  const t = useTranslations('meetings.directory.stats');

  return (
    <div className="gap-md grid grid-cols-1 md:grid-cols-3">
      <Card className="flex items-start justify-between">
        <div>
          <p className="text-label-sm text-on-surface-variant uppercase tracking-wide">
            {t('volume')}
          </p>
          <p className="font-display text-headline-lg text-on-surface mt-1">1,284</p>
          <p className="text-body-sm text-primary mt-2 inline-flex items-center gap-1 font-medium">
            <Icon name="trending_up" size={16} />
            {t('volumeDelta')}
          </p>
        </div>
        <div className="bg-primary-container/15 text-primary flex h-11 w-11 items-center justify-center rounded-full">
          <Icon name="call" size={22} />
        </div>
      </Card>

      <Card className="flex items-start justify-between">
        <div className="w-full">
          <p className="text-label-sm text-on-surface-variant uppercase tracking-wide">
            {t('sentiment')}
          </p>
          <p className="font-display text-headline-lg text-on-surface mt-1">84/100</p>
          <div className="bg-surface-container-high mt-3 h-1.5 w-full overflow-hidden rounded-full">
            <div className="bg-primary h-full w-[84%] rounded-full" />
          </div>
        </div>
        <div className="bg-success-container text-on-success-container ms-3 flex h-11 w-11 items-center justify-center rounded-full">
          <Icon name="sentiment_satisfied" size={22} />
        </div>
      </Card>

      <Card className="flex items-start justify-between">
        <div>
          <p className="text-label-sm text-on-surface-variant uppercase tracking-wide">
            {t('competitor')}
          </p>
          <p className="font-display text-headline-md text-on-surface mt-1">AcmeCorp</p>
          <p className="text-body-sm text-error mt-2">{t('competitorMeta')}</p>
        </div>
        <div className="bg-error-container/60 text-error flex h-11 w-11 items-center justify-center rounded-full">
          <Icon name="swap_horiz" size={22} />
        </div>
      </Card>
    </div>
  );
}

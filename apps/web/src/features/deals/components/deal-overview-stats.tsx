'use client';

import { useTranslations } from 'next-intl';
import type { DealProfile } from '@salesintel/types';

interface DealOverviewStatsProps {
  deal: DealProfile;
}

export function DealOverviewStats({ deal }: DealOverviewStatsProps) {
  const t = useTranslations('dealProfile.overview');

  // Format deal value in USD
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(deal.value);

  // Health score colors mapping
  const healthColors = {
    good: { text: 'text-primary', bg: 'bg-primary-container/10', label: 'good' },
    fair: { text: 'text-secondary', bg: 'bg-secondary-container/10', label: 'fair' },
    risk: { text: 'text-error', bg: 'bg-error-container/15', label: 'risk' },
  };
  const healthStyle = healthColors[deal.healthScoreStatus] || healthColors.fair;

  return (
    <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-4">
      {/* Deal Value */}
      <div className="bento-card bg-surface-container-lowest p-lg">
        <p className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-base">
          {t('dealValue')}
        </p>
        <h3 className="font-headline-lg text-headline-lg text-primary">{formattedValue}</h3>
        <p className="text-body-sm text-on-surface-variant mt-xs">+12% vs. initial quote</p>
      </div>

      {/* Close Date */}
      <div className="bento-card bg-surface-container-lowest p-lg">
        <p className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-base">
          {t('closeDate')}
        </p>
        <h3 className="font-headline-lg text-headline-lg">
          {new Date(deal.closeDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </h3>
        <p className="text-tertiary text-body-sm mt-xs">22 days remaining</p>
      </div>

      {/* Win Probability */}
      <div className="bento-card bg-surface-container-lowest p-lg">
        <p className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-base">
          {t('winProbability')}
        </p>
        <h3 className="font-headline-lg text-headline-lg">{deal.probability}%</h3>
        <div className="mt-sm h-1.5 w-full rounded-full bg-surface-container">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${deal.probability}%` }}
          ></div>
        </div>
      </div>

      {/* Deal Health Score */}
      <div className="bento-card bg-surface-container-lowest p-lg">
        <p className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-base">
          {t('healthScore')}
        </p>
        <div className="flex items-baseline gap-sm">
          <h3 className="font-headline-lg text-headline-lg">{deal.healthScore}</h3>
          <span
            className={`rounded-full px-sm py-xs font-label-sm text-label-sm font-bold uppercase tracking-wider ${healthStyle.bg} ${healthStyle.text}`}
          >
            {t(`healthScoreStatus.${healthStyle.label}` as never)}
          </span>
        </div>
        <p className="text-body-sm text-on-surface-variant mt-xs">Up 3 points this week</p>
      </div>
    </div>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import type { CoachingRecommendation } from '@salesintel/types';

type Priority = CoachingRecommendation['priority'];

const PRIORITY_STYLES: Record<Priority, { bg: string; text: string; border: string; icon: string }> = {
  high: {
    bg: 'bg-error/10',
    text: 'text-error',
    border: 'border-error/30',
    icon: 'priority_high',
  },
  medium: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-600',
    border: 'border-amber-500/30',
    icon: 'drag_handle',
  },
  low: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600',
    border: 'border-emerald-500/30',
    icon: 'check',
  },
};

const PRIORITY_BAR_COLOR: Record<Priority, string> = {
  high: 'bg-gradient-to-b from-error to-error/60',
  medium: 'bg-gradient-to-b from-amber-500 to-amber-500/60',
  low: 'bg-gradient-to-b from-emerald-500 to-emerald-500/60',
};

interface CoachingCardProps {
  recommendation: CoachingRecommendation;
  className?: string;
}

/** Coaching recommendation card with priority badge, action steps, and impact estimate. */
export function CoachingCard({ recommendation, className }: CoachingCardProps) {
  const t = useTranslations('meetings.scoring');
  const tMetrics = useTranslations('meetings.scoring.metrics');
  const pStyle = PRIORITY_STYLES[recommendation.priority];

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-sm',
        'transition-all duration-300 hover:shadow-lg hover:shadow-primary/5',
        className,
      )}
    >
      {/* Priority bar */}
      <span
        className={cn(
          'absolute inset-y-0 start-0 w-1 rounded-e-full',
          PRIORITY_BAR_COLOR[recommendation.priority],
        )}
        aria-hidden
      />

      {/* Header */}
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2 ps-3">
        <div className="flex-1">
          <h3 className="text-body-md text-on-surface font-semibold">{recommendation.title}</h3>
          <p className="text-body-sm text-on-surface-variant mt-1">{recommendation.detail}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
              pStyle.bg,
              pStyle.text,
            )}
          >
            <Icon name={pStyle.icon} size={12} />
            {t(`coaching.${recommendation.priority}` as never)}
          </span>
        </div>
      </div>

      {/* Target metric */}
      <div className="mb-3 ps-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary uppercase">
          <Icon name="flag" size={12} />
          {t('coaching.targetMetric')}: {tMetrics(recommendation.metricKey as never)}
        </span>
      </div>

      {/* Steps */}
      <div className="mb-4 ps-3">
        <h4 className="text-label-sm text-on-surface-variant mb-2 font-semibold uppercase tracking-wide">
          {t('coaching.steps')}
        </h4>
        <ol className="space-y-1.5">
          {recommendation.steps.map((step, i) => (
            <li key={i} className="text-body-sm text-on-surface-variant flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Impact */}
      <div className="ps-3">
        <div className="flex items-center gap-2 rounded-xl bg-surface-container-low p-3">
          <Icon name="trending_up" size={18} className="text-emerald-600" />
          <div>
            <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wide">
              {t('coaching.estimatedImpact')}
            </span>
            <p className="text-body-sm text-on-surface font-medium">
              {recommendation.estimatedImpact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

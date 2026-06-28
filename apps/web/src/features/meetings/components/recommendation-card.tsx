'use client';

import { cn, Button } from '@salesintel/ui';
import type { DeepDiveRecommendation } from '@salesintel/types';
import { Icon } from '@/features/shell';

const TONE_BAR: Record<DeepDiveRecommendation['tone'], string> = {
  positive: 'bg-tertiary',
  neutral: 'bg-primary',
  risk: 'bg-error',
};

interface RecommendationCardProps {
  recommendation: DeepDiveRecommendation;
}

/** A single AI recommendation / next-best-action with a CTA. */
export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <div className="bg-surface-container-lowest border-outline-variant relative overflow-hidden rounded-xl border p-4">
      <span
        className={cn('absolute inset-y-0 start-0 w-1', TONE_BAR[recommendation.tone])}
        aria-hidden
      />
      <h3 className="text-body-md text-on-surface ps-2 font-semibold">{recommendation.title}</h3>
      <p className="text-body-sm text-on-surface-variant ps-2 mt-1">{recommendation.detail}</p>
      <Button variant="ghost" size="sm" className="ms-1 mt-2 gap-1 px-1">
        {recommendation.actionLabel}
        <Icon name="arrow_forward" size={16} className="rtl:rotate-180" />
      </Button>
    </div>
  );
}

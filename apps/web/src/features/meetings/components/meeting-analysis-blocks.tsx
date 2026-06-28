'use client';

import { useTranslations } from 'next-intl';
import type { AnalysisHighlight, CompetitorMention } from '@salesintel/types';
import { cn } from '@salesintel/ui';
import { Icon } from '@/features/shell';

/** Competitor mentions surfaced by the AI, with favorable/unfavorable framing. */
export function CompetitorIntelligence({ competitors }: { competitors: CompetitorMention[] }) {
  const t = useTranslations('meetings.details');

  return (
    <div>
      <h3 className="text-body-lg text-on-surface mb-3 font-semibold">{t('competitorIntel')}</h3>
      <div className="gap-md grid grid-cols-1 sm:grid-cols-2">
        {competitors.map((c) => (
          <div
            key={c.id}
            className={cn(
              'p-md rounded-lg border',
              c.favorable
                ? 'border-error-container bg-error-container/20'
                : 'border-secondary-container/40 bg-secondary-container/10',
            )}
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="bg-surface-container-lowest text-label-sm text-on-surface flex h-7 w-7 items-center justify-center rounded font-bold">
                {c.name.slice(0, 2).toUpperCase()}
              </span>
              <span className="text-body-md text-error font-semibold">{c.name}</span>
            </div>
            <p className="text-body-sm text-on-surface-variant">{c.context}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const TONE_STYLES: Record<AnalysisHighlight['tone'], { icon: string; cls: string }> = {
  positive: { icon: 'check_circle', cls: 'text-primary' },
  neutral: { icon: 'info', cls: 'text-on-surface-variant' },
  risk: { icon: 'warning', cls: 'text-error' },
};

/** Key analysis highlights (opportunities + risks) for the Analysis tab. */
export function AnalysisHighlights({ highlights }: { highlights: AnalysisHighlight[] }) {
  const t = useTranslations('meetings.details');

  return (
    <div>
      <h3 className="text-body-lg text-on-surface mb-3 font-semibold">{t('keyHighlights')}</h3>
      <ul className="space-y-3">
        {highlights.map((h) => {
          const tone = TONE_STYLES[h.tone];
          return (
            <li
              key={h.id}
              className="border-outline-variant/60 p-md flex items-start gap-3 rounded-lg border"
            >
              <Icon name={tone.icon} size={20} className={tone.cls} />
              <div>
                <p className="text-body-md text-on-surface font-medium">{h.label}</p>
                <p className="text-body-sm text-on-surface-variant mt-0.5">{h.detail}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

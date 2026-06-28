'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@salesintel/ui';
import type { TranscriptInsights, TranscriptCompetitor } from '@salesintel/types';
import { Icon } from '@/features/shell';

function competitorInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

const THREAT_BADGE: Record<TranscriptCompetitor['threatLevel'], string> = {
  threat: 'bg-error-container/60 text-on-error-container',
  neutral: 'bg-surface-container-high text-on-surface-variant',
  favorable: 'bg-tertiary-container/20 text-tertiary',
};

interface AiHighlightsPanelProps {
  insights: TranscriptInsights;
}

/** Right-hand intelligence rail for the Transcript & AI Highlights screen. */
export function AiHighlightsPanel({ insights }: AiHighlightsPanelProps) {
  const t = useTranslations('meetings.transcript.panel');
  const { buyingIntent, competitors, keywords, aiConfidence } = insights;

  return (
    <div className="space-y-lg">
      {/* Buying Intent */}
      <section className="bg-surface-container-lowest border-outline-variant rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-body-md text-on-surface font-semibold">{t('buyingIntent')}</h3>
          <span className="text-body-md text-primary font-bold tabular-nums">
            {buyingIntent.score}%
          </span>
        </div>
        <div className="bg-surface-container my-3 h-2 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full"
            style={{ width: `${buyingIntent.score}%` }}
          />
        </div>
        <ul className="space-y-2">
          {buyingIntent.signals.map((signal) => (
            <li key={signal.id} className="text-body-sm flex items-center gap-2">
              <Icon
                name={signal.met ? 'check_circle' : 'radio_button_unchecked'}
                size={18}
                filled={signal.met}
                className={signal.met ? 'text-tertiary' : 'text-outline'}
              />
              <span className={signal.met ? 'text-on-surface-variant' : 'text-outline'}>
                {signal.label}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Competitors Mentioned */}
      <section>
        <h3 className="text-body-md text-on-surface mb-3 flex items-center gap-2 font-semibold">
          <Icon name="swords" size={18} className="text-on-surface-variant" />
          {t('competitors')}
        </h3>
        <ul className="space-y-2">
          {competitors.map((c) => (
            <li
              key={c.id}
              className="bg-surface-container-low border-outline-variant flex items-center justify-between rounded-xl border p-3"
            >
              <div className="flex items-center gap-3">
                <span className="bg-surface-container-high text-on-surface text-label-sm flex h-8 w-8 items-center justify-center rounded-md font-bold">
                  {competitorInitials(c.name)}
                </span>
                <span className="text-body-sm text-on-surface font-medium">{c.name}</span>
              </div>
              <span
                className={cn(
                  'text-label-sm rounded-full px-2 py-0.5 font-semibold uppercase tracking-wide',
                  THREAT_BADGE[c.threatLevel],
                )}
              >
                {t(c.threatLevel)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Keyword Analysis */}
      <section>
        <h3 className="text-body-md text-on-surface mb-3 flex items-center gap-2 font-semibold">
          <Icon name="cloud" size={18} className="text-on-surface-variant" />
          {t('keywordAnalysis')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw) => (
            <span
              key={kw.id}
              className={cn(
                'text-body-sm rounded-md px-3 py-1.5 font-medium',
                kw.emphasis
                  ? 'bg-primary-fixed text-primary'
                  : 'bg-surface-container-high text-on-surface-variant',
              )}
            >
              {kw.label}
            </span>
          ))}
        </div>
      </section>

      {/* AI Confidence */}
      <section className="from-primary to-secondary text-on-primary relative overflow-hidden rounded-xl bg-gradient-to-br p-4">
        <p className="text-label-sm font-semibold uppercase tracking-wide opacity-80">
          {t('aiConfidence')}
        </p>
        <p className="text-headline-md mt-1 font-bold">
          {aiConfidence}% <span className="text-body-md font-medium opacity-90">{t('reliable')}</span>
        </p>
        <Icon
          name="verified"
          size={72}
          filled
          className="pointer-events-none absolute -bottom-3 end-2 opacity-15"
        />
      </section>
    </div>
  );
}

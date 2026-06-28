'use client';

import { useTranslations } from 'next-intl';

/** Circular AI score gauge matching the details design (e.g. "82 / SCORE"). */
export function ScoreRing({ score, propensityLabel }: { score: number; propensityLabel: string }) {
  const t = useTranslations('meetings.details');
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            strokeWidth="10"
            className="stroke-surface-container-high"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="stroke-primary transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-headline-lg text-on-surface">{clamped}</span>
          <span className="text-label-sm text-on-surface-variant uppercase tracking-wide">
            {t('score')}
          </span>
        </div>
      </div>
      <p className="text-body-md text-on-surface mt-3 font-semibold">{propensityLabel}</p>
      <p className="text-body-sm text-on-surface-variant mt-1">{t('momentum')}</p>
    </div>
  );
}

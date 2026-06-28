'use client';

import { useTranslations } from 'next-intl';

interface RiskKpiRadialProps {
  criticalCount: number;
  highCount: number;
  normalCount: number;
}

export function RiskKpiRadial({ criticalCount, highCount, normalCount }: RiskKpiRadialProps) {
  const t = useTranslations('risks');

  // Static score calculation representing average risk exposure
  const exposureScore = 72;

  return (
    <div className="glass-card rounded-xl p-lg overflow-hidden relative">
      <div className="relative z-10">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-xl tracking-widest">
          {t('aggregateStatus')}
        </h3>
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* SVG Circle Progress Ring for 72% */}
            <svg className="w-full h-full transform -rotate-95" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-surface-container"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * exposureScore) / 100}
                className="text-error transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute text-center">
              <p className="font-headline-xl text-headline-xl text-error font-extrabold leading-none">
                {exposureScore}%
              </p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">
                {t('exposure')}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-xl space-y-md">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-xs font-label-sm text-label-sm">
              <span className="w-2 h-2 rounded-full bg-error"></span> {t('severities.critical')}
            </span>
            <span className="font-label-sm text-label-sm font-bold">{criticalCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-xs font-label-sm text-label-sm">
              <span className="w-2 h-2 rounded-full bg-secondary-container"></span> {t('severities.high')}
            </span>
            <span className="font-label-sm text-label-sm font-bold">{highCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-xs font-label-sm text-label-sm">
              <span className="w-2 h-2 rounded-full bg-outline-variant"></span> {t('severities.medium')}
            </span>
            <span className="font-label-sm text-label-sm font-bold">{normalCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

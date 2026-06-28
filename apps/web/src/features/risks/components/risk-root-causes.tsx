'use client';

import { useTranslations } from 'next-intl';

export function RiskRootCauses() {
  const t = useTranslations('risks');

  const causes = [
    { key: 'sentiment_drift', percentage: 42, color: 'bg-primary' },
    { key: 'stagnancy', percentage: 28, color: 'bg-secondary' },
    { key: 'budget_reprioritization', percentage: 18, color: 'bg-tertiary' },
    { key: 'competitor_mentioned', percentage: 12, color: 'bg-outline' },
  ];

  return (
    <div className="glass-card rounded-xl p-lg">
      <h3 className="font-headline-md text-headline-md text-on-surface mb-lg font-bold">
        {t('rootCauses')}
      </h3>
      <div className="space-y-xl">
        {causes.map((item) => (
          <div key={item.key}>
            <div className="flex justify-between mb-xs">
              <span className="font-label-sm text-label-sm text-on-surface">
                {t(`causes.${item.key}` as never)}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                {item.percentage}%
              </span>
            </div>
            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
              <div
                className={`${item.color} h-full rounded-full transition-all duration-500`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

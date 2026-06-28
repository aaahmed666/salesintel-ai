'use client';

import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import type { DealRisk, RiskSeverity } from '@salesintel/types';

interface RiskCardProps {
  risk: DealRisk;
  active: boolean;
  onClick: () => void;
}

export function RiskCard({ risk, active, onClick }: RiskCardProps) {
  const t = useTranslations('risks');
  const locale = useLocale();

  const formattedValue = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(risk.dealValue);

  const severityBadgeClasses: Record<RiskSeverity, string> = {
    critical: 'bg-error-container text-on-error-container text-error border border-error/20',
    high: 'bg-secondary-container/10 text-secondary border border-secondary/20',
    medium: 'bg-surface-container-high text-on-surface-variant border border-outline-variant/30',
    low: 'bg-surface-container text-on-surface-variant/70',
  };

  const causeIcons = {
    sentiment_drift: { icon: 'rocket_launch', color: 'text-primary' },
    stagnancy: { icon: 'apartment', color: 'text-secondary' },
    budget_reprioritization: { icon: 'cloud', color: 'text-tertiary' },
    competitor_mentioned: { icon: 'security', color: 'text-outline' },
  };

  const config = causeIcons[risk.rootCause as keyof typeof causeIcons] || causeIcons.sentiment_drift;


  return (
    <div
      onClick={onClick}
      className={cn(
        'p-md rounded-lg border border-outline-variant bg-surface hover:bg-surface-container-low transition-all cursor-pointer transition-all duration-200',
        active ? 'border-primary shadow-sm bg-surface-container-low' : '',
      )}
    >
      <div className="flex items-start justify-between flex-wrap sm:flex-nowrap gap-sm">
        <div className="flex gap-md">
          <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
            <Icon name={config.icon} className={config.color} size={28} />
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-on-surface font-bold group-hover:text-primary">
              {risk.company}
            </h4>
            <div className="flex items-center gap-md mt-xs flex-wrap">
              <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                {formattedValue} • {risk.stage}
              </span>
              <span className={`px-xs py-[2px] text-[10px] rounded uppercase font-bold tracking-wider ${severityBadgeClasses[risk.severity]}`}>
                {t(`severities.${risk.severity}` as never)}
              </span>
            </div>
          </div>
        </div>
        <div className="text-start sm:text-end shrink-0">
          <p className={cn(
            'font-label-sm text-label-sm font-bold mb-xs',
            risk.severity === 'critical' ? 'text-error' : risk.severity === 'high' ? 'text-secondary' : 'text-on-surface-variant'
          )}>
            {t(`causes.${risk.rootCause}` as never)}
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant italic line-clamp-1 max-w-[15rem]">
            {risk.description}
          </p>
        </div>
      </div>
    </div>
  );
}

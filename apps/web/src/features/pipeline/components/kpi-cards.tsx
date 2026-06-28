'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Icon } from '@/features/shell';
import type { PipelineKPIs } from '@salesintel/types';

interface KPICardsProps {
  kpis: PipelineKPIs;
}

function formatCompact(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

const KPI_CONFIG = [
  { key: 'totalDeals', icon: 'handshake', format: 'number' },
  { key: 'pipelineValue', icon: 'payments', format: 'currency' },
  { key: 'avgDealSize', icon: 'trending_up', format: 'currency' },
  { key: 'winRate', icon: 'emoji_events', format: 'percent' },
  { key: 'avgCycle', icon: 'schedule', format: 'days' },
  { key: 'weightedPipeline', icon: 'balance', format: 'currency' },
] as const;

/** Row of 6 KPI cards showing pipeline summary metrics. */
export function KPICards({ kpis }: KPICardsProps) {
  const t = useTranslations('pipeline.kpis');
  const locale = useLocale();

  function formatValue(key: string, format: string): string {
    const val = kpis[key as keyof PipelineKPIs] as number;
    switch (format) {
      case 'currency': return formatCompact(val, locale);
      case 'percent': return `${val}%`;
      case 'days': return `${val} ${t('days')}`;
      default: return String(val);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {KPI_CONFIG.map(({ key, icon, format }) => (
        <div
          key={key}
          className="group rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-primary/5"
        >
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
              <Icon name={icon} size={18} className="text-primary" />
            </div>
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
            {t(key as never)}
          </p>
          <p className="mt-1 font-headline-md text-headline-md font-bold text-on-surface tabular-nums">
            {formatValue(key, format)}
          </p>
        </div>
      ))}
    </div>
  );
}

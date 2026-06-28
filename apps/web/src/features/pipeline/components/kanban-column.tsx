'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { cn } from '@salesintel/ui';
import { STAGE_STYLES } from './stage-badge';
import { DealCard } from './deal-card';
import type { Deal, PipelineStage, StageMetric } from '@salesintel/types';

interface KanbanColumnProps {
  stage: PipelineStage;
  metric: StageMetric;
  deals: Deal[];
}

function formatCompact(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * A single kanban column with stage header, deal cards, and optional "+ Add Deal" button.
 * Won/Lost columns reduce opacity (matching design).
 */
export function KanbanColumn({ stage, metric, deals }: KanbanColumnProps) {
  const t = useTranslations('pipeline');
  const tStage = useTranslations('pipeline.stages');
  const locale = useLocale();
  const styles = STAGE_STYLES[stage];

  const isWon = stage === 'won';
  const isLost = stage === 'lost';

  return (
    <div
      className={cn(
        'flex min-w-[280px] max-w-[320px] shrink-0 flex-col',
        isWon && 'opacity-70 transition-opacity hover:opacity-100',
        isLost && 'opacity-40 transition-opacity hover:opacity-100',
      )}
    >
      {/* Column header */}
      <div className="mb-3 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className={cn('h-2 w-2 rounded-full', styles.dot)} />
          <h3 className="font-label-md text-label-md font-semibold uppercase tracking-wider text-on-surface">
            {tStage(stage as never)}
          </h3>
          <span className={cn(
            'rounded-full px-2 py-0.5 text-[10px] font-bold',
            isWon ? 'bg-green-100 text-green-700' :
            isLost ? 'bg-error-container text-on-error-container' :
            'bg-surface-container-high text-on-surface-variant',
          )}>
            {metric.dealCount}
          </span>
        </div>
        {metric.totalValue > 0 && (
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {formatCompact(metric.totalValue, locale)}
          </span>
        )}
      </div>

      {/* Cards */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto pe-1 no-scrollbar">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}

        {/* Add deal button (only for active stages) */}
        {!isWon && !isLost && (
          <button
            type="button"
            className="flex items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/60 py-3 text-label-md font-medium text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary"
          >
            {t('deal.addDeal')}
          </button>
        )}
      </div>
    </div>
  );
}

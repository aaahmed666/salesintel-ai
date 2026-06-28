'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { cn } from '@salesintel/ui';
import { Link } from '@/i18n/navigation';
import { ROUTES } from '@salesintel/config';
import { Icon } from '@/features/shell';
import { TemperatureBadge } from './temperature-badge';
import { STAGE_STYLES } from './stage-badge';
import type { Deal, PipelineStage } from '@salesintel/types';


const STAGE_BORDER: Record<PipelineStage, string> = {
  lead:        'border-s-outline-variant',
  qualified:   'border-s-tertiary',
  proposal:    'border-s-secondary',
  negotiation: 'border-s-primary',
  won:         'border-s-green-500',
  lost:        'border-s-error',
};

interface DealCardProps {
  deal: Deal;
  className?: string;
}

function formatCurrency(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Kanban deal card matching the design:
 * Glass-morphism card with colored left border, company name, deal value,
 * temperature badge, activity indicator, and rep avatar.
 */
export function DealCard({ deal, className }: DealCardProps) {
  const locale = useLocale();

  const isWon = deal.stage === 'won';
  const isLost = deal.stage === 'lost';

  if (isWon) {
    return (
      <Link
        href={ROUTES.pipelines.detail(deal.id)}
        className={cn('block rounded-xl border border-green-200/50 bg-green-50/30 p-4 group hover:shadow-md transition-shadow', className)}
      >
        <h4 className="font-label-md text-label-md font-semibold text-green-800 mb-1">{deal.company}</h4>
        <div className="flex items-center justify-between">
          <span className="font-headline-md text-[16px] font-bold text-green-900">
            {formatCurrency(deal.value, locale)}
          </span>
          <Icon name="check_circle" size={20} filled className="text-green-600" />
        </div>
      </Link>
    );
  }

  if (isLost) {
    return (
      <Link
        href={ROUTES.pipelines.detail(deal.id)}
        className={cn('block rounded-xl border border-outline-variant bg-surface-container-low p-4 grayscale hover:shadow-md transition-shadow', className)}
      >
        <h4 className="font-label-md text-label-md font-semibold text-on-surface-variant mb-1">{deal.company}</h4>
        <div className="flex items-center justify-between">
          <span className="font-headline-md text-[16px] font-bold text-on-surface-variant">
            {formatCurrency(deal.value, locale)}
          </span>
          <span className="text-[10px] font-bold uppercase text-error">{deal.lastActivity}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={ROUTES.pipelines.detail(deal.id)}
      className={cn(
        'group relative block cursor-pointer rounded-xl border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm',
        'border-s-4 transition-all duration-200 hover:shadow-md',
        STAGE_BORDER[deal.stage],
        className,
      )}
    >
      {/* Header */}
      <div className="mb-1 flex items-start justify-between">
        <h4 className="font-label-md text-label-md font-semibold text-on-surface transition-colors group-hover:text-primary">
          {deal.company}
        </h4>
        <Icon
          name="more_vert"
          size={18}
          className="text-outline-variant opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>

      {/* Value + temperature */}
      <div className="mb-3 flex items-center justify-between">
        <span className="font-headline-md text-[18px] font-bold text-on-surface">
          {formatCurrency(deal.value, locale)}
        </span>
        <TemperatureBadge temperature={deal.temperature} />
      </div>

      {/* Activity + rep */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon name={deal.lastActivityIcon} size={14} className="text-on-surface-variant" />
          <span className="text-[11px] font-medium text-on-surface-variant">{deal.lastActivity}</span>
        </div>
        {deal.rep.avatarUrl ? (
          <img
            className="h-5 w-5 rounded-full ring-2 ring-white"
            src={deal.rep.avatarUrl}
            alt={deal.rep.name}
          />
        ) : (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[8px] font-bold text-white">
            {deal.rep.initials}
          </div>
        )}
      </div>
    </Link>
  );
}


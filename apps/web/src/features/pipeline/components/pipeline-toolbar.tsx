'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@salesintel/ui';
import { Link } from '@/i18n/navigation';
import { ROUTES } from '@salesintel/config';
import { Icon } from '@/features/shell';


type ViewMode = 'table' | 'board';

interface PipelineToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  pipelineName: string;
  totalDeals: number;
  onToggleFilters: () => void;
  hasActiveFilters: boolean;
}

/**
 * Filter bar matching the design:
 * Rep avatar stack, "Filter by Rep" button, pipeline name, view toggle, export button.
 */
export function PipelineToolbar({
  viewMode,
  onViewModeChange,
  pipelineName,
  totalDeals,
  onToggleFilters,
  hasActiveFilters,
}: PipelineToolbarProps) {
  const t = useTranslations('pipeline');
  const tToolbar = useTranslations('pipeline.toolbar');

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Left side */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Rep avatars stack */}
        <div className="flex items-center -space-x-2 rtl:space-x-reverse">
          {['AJ', 'SC', 'MW'].map((initials, i) => (
            <div
              key={initials}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-surface-container-highest text-[10px] font-bold text-primary"
              style={{ zIndex: 3 - i }}
            >
              {initials}
            </div>
          ))}
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-surface-container-highest text-[10px] font-bold text-primary">
            +12
          </div>
        </div>

        {/* Filter by Rep */}
        <button
          type="button"
          onClick={onToggleFilters}
          className={cn(
            'flex items-center gap-2 rounded-lg border px-3 py-1.5 font-label-md text-label-md transition-all',
            hasActiveFilters
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low',
          )}
        >
          <Icon name="filter_list" size={18} />
          {tToolbar('filters')}
          {hasActiveFilters && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-on-primary">
              ✓
            </span>
          )}
        </button>

        {/* Pipeline name */}
        <div className="hidden items-center gap-2 sm:flex">
          <div className="h-6 w-px bg-outline-variant" />
          <span className="font-label-md text-label-md text-on-surface-variant">
            {t('pipelineLabel')}: <strong className="text-on-surface">{pipelineName}</strong>
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* View toggle */}
        <div className="flex rounded-lg border border-outline-variant/60 p-0.5">
          <button
            type="button"
            onClick={() => onViewModeChange('board')}
            className={cn(
              'rounded-md p-2 transition-all',
              viewMode === 'board'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface',
            )}
            title={tToolbar('viewKanban')}
          >
            <Icon name="view_kanban" size={20} />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            className={cn(
              'rounded-md p-2 transition-all',
              viewMode === 'table'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface',
            )}
            title={tToolbar('viewTable')}
          >
            <Icon name="list" size={20} />
          </button>
        </div>

        {/* Export button */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-1.5 font-label-md text-label-md text-on-surface-variant transition-all hover:bg-surface-container-low"
        >
          <Icon name="ios_share" size={18} />
          {tToolbar('export')}
        </button>

        {/* Risks Control Button */}
        <Link
          href={ROUTES.pipelines.escalations}
          className="flex items-center gap-2 rounded-lg border border-error bg-error-container/10 px-3 py-1.5 font-label-md text-label-md text-error transition-all hover:bg-error-container/20 font-bold"
        >
          <Icon name="auto_fix_high" size={18} />
          Risks Control
        </Link>
      </div>
    </div>
  );
}


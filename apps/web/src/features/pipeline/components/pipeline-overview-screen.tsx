'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import { usePipeline } from '../queries/use-pipeline';
import { usePipelineFilters } from '../hooks/use-pipeline-filters';
import { KPICards } from './kpi-cards';
import { PipelineToolbar } from './pipeline-toolbar';
import { PipelineSearch } from './pipeline-search';
import { PipelineFiltersPanel } from './pipeline-filters-panel';
import { PipelineTable } from './pipeline-table';
import { KanbanBoard } from './kanban-board';

type ViewMode = 'table' | 'board';

interface PipelineOverviewScreenProps {
  /** Initial view: "table" or "board". Board page defaults to board. */
  defaultView?: ViewMode;
}

/**
 * Sales Pipeline main screen.
 * Combines KPI cards, toolbar, search, filters, and conditional table/kanban views.
 */
export function PipelineOverviewScreen({ defaultView = 'table' }: PipelineOverviewScreenProps) {
  const t = useTranslations('pipeline');
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const {
    filters,
    search,
    setSearch,
    stages,
    toggleStage,
    temperatures,
    toggleTemperature,
    minValue,
    setMinValue,
    maxValue,
    setMaxValue,
    clearAll,
    hasActiveFilters,
  } = usePipelineFilters();

  const { data, isLoading, isError, refetch } = usePipeline(filters);

  if (isLoading) return <PipelineSkeleton />;

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <Icon name="error" size={40} className="text-error" />
        <p className="text-body-md max-w-sm text-on-surface-variant">{t('error')}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-body-sm font-semibold text-primary hover:underline"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-headline-md font-semibold text-on-surface">
          {viewMode === 'board' ? t('boardTitle') : t('pageTitle')}
        </h1>
        <p className="text-body-sm mt-1 text-on-surface-variant">{t('subtitle')}</p>
      </div>

      {/* KPI cards */}
      <KPICards kpis={data.kpis} />

      {/* Toolbar + search row */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PipelineToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            pipelineName={data.pipelineName}
            totalDeals={data.totalDeals}
            onToggleFilters={() => setFiltersOpen((v: boolean) => !v)}
            hasActiveFilters={hasActiveFilters}
          />
          <PipelineSearch value={search} onChange={setSearch} />
        </div>

        {/* Filter panel */}
        <PipelineFiltersPanel
          open={filtersOpen}
          stages={stages}
          temperatures={temperatures}
          minValue={minValue}
          maxValue={maxValue}
          onToggleStage={toggleStage}
          onToggleTemp={toggleTemperature}
          onSetMinValue={setMinValue}
          onSetMaxValue={setMaxValue}
          onClearAll={clearAll}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Content area */}
      <div className="flex-1">
        {viewMode === 'table' ? (
          <PipelineTable
            deals={data.deals}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            globalFilter={search}
          />
        ) : (
          <KanbanBoard deals={data.deals} stageMetrics={data.stageMetrics} />
        )}
      </div>

      {/* Floating Action Button */}
      <button
        type="button"
        className="fixed bottom-8 end-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-2xl transition-all hover:scale-110 active:scale-95 group"
      >
        <Icon name="add" size={28} />
        <div className="pointer-events-none absolute end-full me-4 whitespace-nowrap rounded-xl bg-inverse-surface px-4 py-2 text-label-md text-inverse-on-surface opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          {t('deal.addDeal')}
        </div>
      </button>
    </div>
  );
}

/* ─── Skeleton ─── */

function PipelineSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Header skeleton */}
      <div>
        <Skeleton className="mb-2 h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      {/* KPI skeletons */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-96" />
        <Skeleton className="h-9 w-48" />
      </div>
      {/* Table skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}

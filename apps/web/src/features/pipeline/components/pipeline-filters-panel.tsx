'use client';

import { type ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import type { PipelineStage, DealTemperature } from '@salesintel/types';

const ALL_STAGES: PipelineStage[] = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
const ALL_TEMPS: DealTemperature[] = ['hot', 'warm', 'cold'];

interface PipelineFiltersPanelProps {
  open: boolean;
  stages: PipelineStage[];
  temperatures: DealTemperature[];
  minValue?: number;
  maxValue?: number;
  onToggleStage: (stage: PipelineStage) => void;
  onToggleTemp: (temp: DealTemperature) => void;
  onSetMinValue: (val?: number) => void;
  onSetMaxValue: (val?: number) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

/** Expandable filter panel with stage, temperature, and value range filters. */
export function PipelineFiltersPanel({
  open,
  stages,
  temperatures,
  minValue,
  maxValue,
  onToggleStage,
  onToggleTemp,
  onSetMinValue,
  onSetMaxValue,
  onClearAll,
  hasActiveFilters,
}: PipelineFiltersPanelProps) {
  const t = useTranslations('pipeline.filters');
  const tStages = useTranslations('pipeline.stages');
  const tTemps = useTranslations('pipeline.temperature');

  if (!open) return null;

  return (
    <div className="animate-[slideDown_0.2s_ease-out] rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-body-md font-semibold text-on-surface">{t('title')}</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-label-sm font-semibold text-primary hover:underline"
          >
            {t('clearAll')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Stage filter */}
        <div>
          <p className="text-label-sm mb-2 font-semibold uppercase tracking-wide text-on-surface-variant">
            {t('stage')}
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_STAGES.map((stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => onToggleStage(stage)}
                className={cn(
                  'rounded-full px-3 py-1 text-label-sm font-medium transition-all',
                  stages.includes(stage)
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high',
                )}
              >
                {tStages(stage as never)}
              </button>
            ))}
          </div>
        </div>

        {/* Temperature filter */}
        <div>
          <p className="text-label-sm mb-2 font-semibold uppercase tracking-wide text-on-surface-variant">
            {t('temperature')}
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_TEMPS.map((temp) => (
              <button
                key={temp}
                type="button"
                onClick={() => onToggleTemp(temp)}
                className={cn(
                  'rounded-full px-3 py-1 text-label-sm font-medium transition-all',
                  temperatures.includes(temp)
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high',
                )}
              >
                {tTemps(temp as never)}
              </button>
            ))}
          </div>
        </div>

        {/* Value range */}
        <div>
          <p className="text-label-sm mb-2 font-semibold uppercase tracking-wide text-on-surface-variant">
            {t('valueRange')}
          </p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={minValue ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onSetMinValue(e.target.value ? Number(e.target.value) : undefined)}
              placeholder={t('minValue')}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 text-body-sm text-on-surface placeholder:text-on-surface-variant/60"
            />
            <span className="text-on-surface-variant">–</span>
            <input
              type="number"
              value={maxValue ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onSetMaxValue(e.target.value ? Number(e.target.value) : undefined)}
              placeholder={t('maxValue')}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 text-body-sm text-on-surface placeholder:text-on-surface-variant/60"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

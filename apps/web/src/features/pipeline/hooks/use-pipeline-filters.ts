'use client';

import { useCallback, useMemo, useState } from 'react';
import type { PipelineFilters, PipelineStage, DealTemperature } from '@salesintel/types';

/** Manages pipeline filter state including search, stages, temps, and value range. */
export function usePipelineFilters() {
  const [search, setSearch] = useState('');
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [temperatures, setTemperatures] = useState<DealTemperature[]>([]);
  const [minValue, setMinValue] = useState<number | undefined>(undefined);
  const [maxValue, setMaxValue] = useState<number | undefined>(undefined);

  const filters: PipelineFilters = useMemo(
    () => ({
      search: search || undefined,
      stages: stages.length > 0 ? stages : undefined,
      temperatures: temperatures.length > 0 ? temperatures : undefined,
      minValue,
      maxValue,
    }),
    [search, stages, temperatures, minValue, maxValue],
  );

  const toggleStage = useCallback((stage: PipelineStage) => {
    setStages((prev) =>
      prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage],
    );
  }, []);

  const toggleTemperature = useCallback((temp: DealTemperature) => {
    setTemperatures((prev) =>
      prev.includes(temp) ? prev.filter((t) => t !== temp) : [...prev, temp],
    );
  }, []);

  const clearAll = useCallback(() => {
    setSearch('');
    setStages([]);
    setTemperatures([]);
    setMinValue(undefined);
    setMaxValue(undefined);
  }, []);

  const hasActiveFilters = stages.length > 0 || temperatures.length > 0 || minValue !== undefined || maxValue !== undefined;

  return {
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
  };
}

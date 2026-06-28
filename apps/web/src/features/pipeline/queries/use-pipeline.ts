'use client';

import { useQuery } from '@tanstack/react-query';
import { pipelineService, queryKeys } from '@salesintel/api';
import type { ApiError, PipelineData, PipelineFilters } from '@salesintel/types';

/** Pipeline data with optional filter parameters. */
export function usePipeline(filters: PipelineFilters = {}) {
  return useQuery<PipelineData, ApiError>({
    queryKey: queryKeys.pipeline.list(filters),
    queryFn: () => pipelineService.getPipeline(filters),
  });
}

import type { PipelineData, PipelineFilters } from '@salesintel/types';
import { delay } from './db';
import { buildPipelineData } from './pipeline.data';

export const mockPipelineApi = {
  /** Fetch the pipeline with optional filters. */
  async getPipeline(filters: PipelineFilters = {}): Promise<PipelineData> {
    await delay(400);
    return buildPipelineData(filters);
  },
};

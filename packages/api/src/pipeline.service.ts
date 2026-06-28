import { mocksEnabled } from '@salesintel/config';
import type { PipelineData, PipelineFilters } from '@salesintel/types';
import { apiClient, normalizeError } from './client';
import { mockPipelineApi } from './mock';

export interface PipelineService {
  getPipeline(filters?: PipelineFilters): Promise<PipelineData>;
}

async function request<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  try {
    const { data } = await apiClient.get<{ data: T }>(url, { params });
    return data.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

const httpPipelineApi: PipelineService = {
  getPipeline: (filters) => request('/pipeline', filters as Record<string, unknown>),
};

export const pipelineService: PipelineService = mocksEnabled ? mockPipelineApi : httpPipelineApi;

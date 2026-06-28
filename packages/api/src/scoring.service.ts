import { mocksEnabled } from '@salesintel/config';
import type { SalesScore } from '@salesintel/types';
import { apiClient, normalizeError } from './client';
import { mockScoringApi } from './mock';

export interface ScoringService {
  getSalesScore(meetingId: string): Promise<SalesScore>;
}

async function request<T>(url: string): Promise<T> {
  try {
    const { data } = await apiClient.get<{ data: T }>(url);
    return data.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

const httpScoringApi: ScoringService = {
  getSalesScore: (meetingId) => request(`/meetings/${meetingId}/scoring`),
};

export const scoringService: ScoringService = mocksEnabled ? mockScoringApi : httpScoringApi;

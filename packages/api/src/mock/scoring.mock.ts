import type { SalesScore } from '@salesintel/types';
import { delay } from './db';
import { buildSalesScore } from './scoring.data';

export const mockScoringApi = {
  /** Sales scoring payload for a single meeting. */
  async getSalesScore(meetingId: string): Promise<SalesScore> {
    await delay(500);
    return buildSalesScore(meetingId);
  },
};

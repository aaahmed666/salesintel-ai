'use client';

import { useQuery } from '@tanstack/react-query';
import { scoringService, queryKeys } from '@salesintel/api';
import type { ApiError, SalesScore } from '@salesintel/types';

/** Sales scoring payload for a single meeting. */
export function useSalesScore(meetingId: string) {
  return useQuery<SalesScore, ApiError>({
    queryKey: queryKeys.scoring.detail(meetingId),
    queryFn: () => scoringService.getSalesScore(meetingId),
    enabled: Boolean(meetingId),
  });
}

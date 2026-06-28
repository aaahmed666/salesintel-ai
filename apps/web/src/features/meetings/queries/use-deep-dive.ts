'use client';

import { useQuery } from '@tanstack/react-query';
import { meetingService, queryKeys } from '@salesintel/api';
import type { ApiError, MeetingDeepDive } from '@salesintel/types';

/** AI Analysis Deep Dive payload for a single meeting. */
export function useDeepDive(id: string) {
  return useQuery<MeetingDeepDive, ApiError>({
    queryKey: queryKeys.meetings.deepDive(id),
    queryFn: () => meetingService.getDeepDive(id),
    enabled: Boolean(id),
  });
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { meetingService, queryKeys } from '@salesintel/api';
import type { ApiError, MeetingDetail } from '@salesintel/types';

/** Full meeting detail payload (summary, timeline, transcript, etc.). */
export function useMeetingDetail(id: string) {
  return useQuery<MeetingDetail, ApiError>({
    queryKey: queryKeys.meetings.detail(id),
    queryFn: () => meetingService.getAnalysis(id),
    enabled: Boolean(id),
  });
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { meetingService, queryKeys } from '@salesintel/api';
import type { ApiError, Meeting } from '@salesintel/types';

/**
 * Meeting list / processing queue. Polls while any meeting is still processing
 * so the UI advances through the pipeline (mirrors a websocket in production).
 */
export function useMeetings() {
  return useQuery<Meeting[], ApiError>({
    queryKey: queryKeys.meetings.list(),
    queryFn: () => meetingService.listMeetings(),
    refetchInterval: (query) => {
      const data = query.state.data;
      const active = data?.some((m) => m.status !== 'completed' && m.status !== 'failed');
      return active ? 2500 : false;
    },
  });
}

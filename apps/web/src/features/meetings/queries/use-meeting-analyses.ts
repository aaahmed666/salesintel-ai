'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { meetingService, queryKeys } from '@salesintel/api';
import type { ApiError, MeetingAnalysis, MeetingListParams, Paginated } from '@salesintel/types';

/**
 * Server-driven directory listing. Keeps the previous page visible while the
 * next query resolves so pagination/sort/filter changes don't flash an empty
 * table.
 */
export function useMeetingAnalyses(params: MeetingListParams) {
  return useQuery<Paginated<MeetingAnalysis>, ApiError>({
    queryKey: queryKeys.meetings.directory(params),
    queryFn: () => meetingService.listAnalyses(params),
    placeholderData: keepPreviousData,
  });
}

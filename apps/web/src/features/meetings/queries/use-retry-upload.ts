'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { meetingService, mutationKeys, queryKeys } from '@salesintel/api';
import type { ApiError, Meeting } from '@salesintel/types';

export function useRetryUpload() {
  const qc = useQueryClient();
  return useMutation<Meeting, ApiError, string>({
    mutationKey: mutationKeys.meetings.retry,
    mutationFn: (meetingId) => meetingService.retryUpload(meetingId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.meetings.list() });
    },
  });
}

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { meetingService, mutationKeys, queryKeys } from '@salesintel/api';
import type { ApiError, CreateUploadInput, CreateUploadResult } from '@salesintel/types';

type CreateUploadVars = CreateUploadInput & { fileId?: string; fileUrl?: string };

/**
 * Registers an accepted upload with the backend AFTER the binary has been
 * stored via meetingService.uploadFile. Records the resulting meeting row.
 */
export function useCreateUpload() {
  const qc = useQueryClient();
  return useMutation<CreateUploadResult, ApiError, CreateUploadVars>({
    mutationKey: mutationKeys.meetings.createUpload,
    mutationFn: (input) => meetingService.createUpload(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.meetings.list() });
    },
  });
}

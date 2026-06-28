'use client';

import { useQuery } from '@tanstack/react-query';
import { adminSettingsService, queryKeys } from '@salesintel/api';
import type { ApiError, SecurityEvent } from '@salesintel/types';

export function useSecurityEvents() {
  return useQuery<SecurityEvent[], ApiError>({
    queryKey: queryKeys.auditLogs.list(),
    queryFn: () => adminSettingsService.getSecurityEvents(),
  });
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys, shellService } from '@salesintel/api';
import type { ApiError, Organization } from '@salesintel/types';

export function useOrganizations() {
  return useQuery<Organization[], ApiError>({
    queryKey: queryKeys.shell.organizations(),
    queryFn: () => shellService.listOrganizations(),
  });
}

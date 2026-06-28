'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyService, queryKeys, mutationKeys } from '@salesintel/api';
import type { ApiError, Company } from '@salesintel/types';

export function useCompanies() {
  return useQuery<Company[], ApiError>({
    queryKey: queryKeys.companies.list(),
    queryFn: () => companyService.getCompanies(),
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation<Company, ApiError, Omit<Company, 'id' | 'createdAt'>>({
    mutationKey: mutationKeys.companies.create,
    mutationFn: (input) => companyService.createCompany(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.list() });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useMutation<Company, ApiError, { id: string; input: Partial<Omit<Company, 'id' | 'createdAt'>> }>({
    mutationKey: mutationKeys.companies.update,
    mutationFn: ({ id, input }) => companyService.updateCompany(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.list() });
    },
  });
}

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSettingsService, queryKeys, mutationKeys } from '@salesintel/api';
import type { ApiError, AppUser } from '@salesintel/types';

export function useUsers() {
  return useQuery<AppUser[], ApiError>({
    queryKey: queryKeys.users.list(),
    queryFn: () => adminSettingsService.getUsers(),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation<AppUser, ApiError, Omit<AppUser, 'id' | 'status'>>({
    mutationKey: mutationKeys.users.create,
    mutationFn: (input) => adminSettingsService.createUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list() });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation<AppUser, ApiError, { id: string; input: Partial<Omit<AppUser, 'id'>> }>({
    mutationKey: mutationKeys.users.update,
    mutationFn: ({ id, input }) => adminSettingsService.updateUser(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list() });
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  return useMutation<AppUser, ApiError, string>({
    mutationKey: mutationKeys.users.deactivate,
    mutationFn: (id) => adminSettingsService.deactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list() });
    },
  });
}

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dealProfileService, queryKeys, mutationKeys } from '@salesintel/api';
import type { ApiError, DealProfile, Task, Note } from '@salesintel/types';

export function useDealProfile(id: string) {
  return useQuery<DealProfile, ApiError>({
    queryKey: queryKeys.deals.detail(id),
    queryFn: () => dealProfileService.getDealProfile(id),
  });
}

export function useUpdateTaskStatus(dealId: string) {
  const queryClient = useQueryClient();
  return useMutation<Task, ApiError, { taskId: string; completed: boolean }>({
    mutationKey: mutationKeys.deals.updateTask,
    mutationFn: ({ taskId, completed }) =>
      dealProfileService.updateTaskStatus(dealId, taskId, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.detail(dealId) });
    },
  });
}

export function useAddTask(dealId: string) {
  const queryClient = useQueryClient();
  return useMutation<
    Task,
    ApiError,
    { title: string; dueDate: string; priority: 'high' | 'medium' | 'low' }
  >({
    mutationKey: mutationKeys.deals.addTask,
    mutationFn: (task) => dealProfileService.addTask(dealId, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.detail(dealId) });
    },
  });
}

export function useAddNote(dealId: string) {
  const queryClient = useQueryClient();
  return useMutation<Note, ApiError, { content: string; author: string }>({
    mutationKey: mutationKeys.deals.addNote,
    mutationFn: (note) => dealProfileService.addNote(dealId, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.detail(dealId) });
    },
  });
}

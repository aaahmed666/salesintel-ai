'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowService, queryKeys, mutationKeys } from '@salesintel/api';
import type { ApiError, Workflow } from '@salesintel/types';

export function useWorkflows() {
  return useQuery<Workflow[], ApiError>({
    queryKey: queryKeys.workflows.list(),
    queryFn: () => workflowService.getWorkflows(),
  });
}

export function useUpdateWorkflow() {
  const queryClient = useQueryClient();
  return useMutation<Workflow, ApiError, { id: string; workflow: Partial<Workflow> }>({
    mutationKey: mutationKeys.workflows.update,
    mutationFn: ({ id, workflow }) => workflowService.updateWorkflow(id, workflow),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workflows.list() });
    },
  });
}

export function useCreateWorkflow() {
  const queryClient = useQueryClient();
  return useMutation<Workflow, ApiError, Omit<Workflow, 'id' | 'createdAt'>>({
    mutationKey: mutationKeys.workflows.create,
    mutationFn: (workflow) => workflowService.createWorkflow(workflow),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workflows.list() });
    },
  });
}

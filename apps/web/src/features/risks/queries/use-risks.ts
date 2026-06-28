'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { riskService, queryKeys, mutationKeys } from '@salesintel/api';
import type { ApiError, DealRisk, RiskRule, RiskStatus, RiskFilters } from '@salesintel/types';

export function useRisks(filters: RiskFilters = {}) {
  return useQuery<DealRisk[], ApiError>({
    queryKey: queryKeys.risks.list(filters),
    queryFn: () => riskService.getRisks(filters),
  });
}

export function useRiskRules() {
  return useQuery<RiskRule[], ApiError>({
    queryKey: queryKeys.risks.rules(),
    queryFn: () => riskService.getRiskRules(),
  });
}

export function useUpdateRiskStatus() {
  const queryClient = useQueryClient();
  return useMutation<
    DealRisk,
    ApiError,
    { id: string; status: RiskStatus; comment?: string }
  >({
    mutationKey: mutationKeys.risks.updateStatus,
    mutationFn: ({ id, status, comment }) => riskService.updateRiskStatus(id, status, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.risks.all });
    },
  });
}

export function useToggleRiskRule() {
  const queryClient = useQueryClient();
  return useMutation<RiskRule, ApiError, { id: string; enabled: boolean }>({
    mutationKey: mutationKeys.risks.toggleRule,
    mutationFn: ({ id, enabled }) => riskService.toggleRiskRule(id, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.risks.rules() });
    },
  });
}

export function useCreateRiskRule() {
  const queryClient = useQueryClient();
  return useMutation<RiskRule, ApiError, Omit<RiskRule, 'id'>>({
    mutationKey: mutationKeys.risks.createRule,
    mutationFn: (rule) => riskService.createRiskRule(rule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.risks.rules() });
    },
  });
}

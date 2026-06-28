'use client';

import { useQuery } from '@tanstack/react-query';
import { adminSettingsService, queryKeys } from '@salesintel/api';
import type { ApiError, BillingInvoice, BillingMetrics } from '@salesintel/types';

export function useBillingInvoices() {
  return useQuery<BillingInvoice[], ApiError>({
    queryKey: queryKeys.billing.invoices(),
    queryFn: () => adminSettingsService.getBillingInvoices(),
  });
}

export function useBillingMetrics() {
  return useQuery<BillingMetrics, ApiError>({
    queryKey: queryKeys.billing.metrics(),
    queryFn: () => adminSettingsService.getBillingMetrics(),
  });
}

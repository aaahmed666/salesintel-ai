import { mocksEnabled } from '@salesintel/config';
import type { DealRisk, RiskRule, RiskStatus, RiskFilters } from '@salesintel/types';
import { apiClient, normalizeError } from './client';
import { mockRiskApi } from './mock';

export interface RiskService {
  getRisks(filters?: RiskFilters): Promise<DealRisk[]>;
  updateRiskStatus(id: string, status: RiskStatus, comment?: string): Promise<DealRisk>;
  getRiskRules(): Promise<RiskRule[]>;
  toggleRiskRule(id: string, enabled: boolean): Promise<RiskRule>;
  createRiskRule(rule: Omit<RiskRule, 'id'>): Promise<RiskRule>;
}

async function getRequest<T>(url: string, params?: unknown): Promise<T> {
  try {
    const { data } = await apiClient.get<{ data: T }>(url, { params });
    return data.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

async function postRequest<T>(url: string, payload: unknown): Promise<T> {
  try {
    const { data } = await apiClient.post<{ data: T }>(url, payload);
    return data.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

async function putRequest<T>(url: string, payload: unknown): Promise<T> {
  try {
    const { data } = await apiClient.put<{ data: T }>(url, payload);
    return data.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

const httpRiskApi: RiskService = {
  getRisks: (filters) => getRequest('/risks', filters),
  updateRiskStatus: (id, status, comment) => putRequest(`/risks/${id}/status`, { status, comment }),
  getRiskRules: () => getRequest('/risks/rules'),
  toggleRiskRule: (id, enabled) => putRequest(`/risks/rules/${id}`, { enabled }),
  createRiskRule: (rule) => postRequest('/risks/rules', rule),
};

export const riskService: RiskService = mocksEnabled ? mockRiskApi : httpRiskApi;

import { mocksEnabled } from '@salesintel/config';
import type { Workflow } from '@salesintel/types';
import { apiClient, normalizeError } from './client';
import { mockWorkflowApi } from './mock';

export interface WorkflowService {
  getWorkflows(): Promise<Workflow[]>;
  updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow>;
  createWorkflow(workflow: Omit<Workflow, 'id' | 'createdAt'>): Promise<Workflow>;
}

async function getRequest<T>(url: string): Promise<T> {
  try {
    const { data } = await apiClient.get<{ data: T }>(url);
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

const httpWorkflowApi: WorkflowService = {
  getWorkflows: () => getRequest('/workflows'),
  updateWorkflow: (id, workflow) => putRequest(`/workflows/${id}`, workflow),
  createWorkflow: (workflow) => postRequest('/workflows', workflow),
};

export const workflowService: WorkflowService = mocksEnabled ? mockWorkflowApi : httpWorkflowApi;

import { mocksEnabled } from '@salesintel/config';
import type { DealProfile, Task, Note } from '@salesintel/types';
import { apiClient, normalizeError } from './client';
import { mockDealProfileApi } from './mock';

export interface DealProfileService {
  getDealProfile(id: string): Promise<DealProfile>;
  updateTaskStatus(dealId: string, taskId: string, completed: boolean): Promise<Task>;
  addTask(dealId: string, task: { title: string; dueDate: string; priority: 'high' | 'medium' | 'low' }): Promise<Task>;
  addNote(dealId: string, note: { content: string; author: string }): Promise<Note>;
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

const httpDealProfileApi: DealProfileService = {
  getDealProfile: (id) => getRequest(`/deals/${id}`),
  updateTaskStatus: (dealId, taskId, completed) => putRequest(`/deals/${dealId}/tasks/${taskId}`, { completed }),
  addTask: (dealId, task) => postRequest(`/deals/${dealId}/tasks`, task),
  addNote: (dealId, note) => postRequest(`/deals/${dealId}/notes`, note),
};

export const dealProfileService: DealProfileService = mocksEnabled ? mockDealProfileApi : httpDealProfileApi;

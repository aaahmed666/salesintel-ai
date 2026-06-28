import { mocksEnabled } from '@salesintel/config';
import type { AppNotification, Organization } from '@salesintel/types';
import { apiClient, normalizeError } from './client';
import { mockShellApi } from './mock';

export interface ShellService {
  listOrganizations(): Promise<Organization[]>;
  listNotifications(): Promise<AppNotification[]>;
  markNotificationRead(id: string): Promise<AppNotification[]>;
  markAllNotificationsRead(): Promise<AppNotification[]>;
}

async function get<T>(url: string): Promise<T> {
  try {
    const { data } = await apiClient.get<{ data: T }>(url);
    return data.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

async function patch<T>(url: string, body: unknown = {}): Promise<T> {
  try {
    const { data } = await apiClient.patch<{ data: T }>(url, body);
    return data.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

const httpShellApi: ShellService = {
  listOrganizations: () => get('/organizations'),
  listNotifications: () => get('/notifications'),
  markNotificationRead: (id) => patch(`/notifications/${id}/read`),
  markAllNotificationsRead: () => patch('/notifications/read-all'),
};

export const shellService: ShellService = mocksEnabled ? mockShellApi : httpShellApi;

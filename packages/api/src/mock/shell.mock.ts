import type { AppNotification, Organization } from '@salesintel/types';
import { delay } from './db';
import { mockNotifications, mockOrganizations } from './shell.data';

/** In-memory copy so "mark as read" mutations persist within a session. */
let notifications: AppNotification[] = mockNotifications.map((n) => ({ ...n }));

export const mockShellApi = {
  async listOrganizations(): Promise<Organization[]> {
    await delay(400);
    return mockOrganizations.map((o) => ({ ...o }));
  },

  async listNotifications(): Promise<AppNotification[]> {
    await delay(400);
    return notifications.map((n) => ({ ...n }));
  },

  async markNotificationRead(id: string): Promise<AppNotification[]> {
    await delay(200);
    notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    return notifications.map((n) => ({ ...n }));
  },

  async markAllNotificationsRead(): Promise<AppNotification[]> {
    await delay(300);
    notifications = notifications.map((n) => ({ ...n, read: true }));
    return notifications.map((n) => ({ ...n }));
  },
};

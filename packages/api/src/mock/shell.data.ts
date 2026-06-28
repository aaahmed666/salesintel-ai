import type { AppNotification, Organization } from '@salesintel/types';

/** Seed organizations for the organization switcher. */
export const mockOrganizations: Organization[] = [
  { id: 'org_acme', name: 'Acme Corporation', initials: 'AC', plan: 'enterprise' },
  { id: 'org_stellar', name: 'Stellar Solutions', initials: 'SS', plan: 'growth' },
  { id: 'org_globex', name: 'Globex Inc', initials: 'GX', plan: 'starter' },
];

/** Seed notifications for the notification menu / activity feed. */
export const mockNotifications: AppNotification[] = [
  {
    id: 'ntf_1',
    type: 'success',
    title: 'Meeting analysis complete',
    body: 'Q4 Strategy — Acme Corp finished processing with a 84% positive sentiment.',
    icon: 'check_circle',
    read: false,
    createdAt: '2024-10-24T10:45:00.000Z',
    href: '/meetings',
  },
  {
    id: 'ntf_2',
    type: 'info',
    title: 'New high-intent lead matched',
    body: 'Global Tech Inc matched your "Ideal Customer Profile".',
    icon: 'person_add',
    read: false,
    createdAt: '2024-10-24T09:10:00.000Z',
    href: '/leads',
  },
  {
    id: 'ntf_3',
    type: 'warning',
    title: 'Deal at risk',
    body: 'Stellar Solutions has been inactive for 14 days.',
    icon: 'warning',
    read: true,
    createdAt: '2024-10-23T16:30:00.000Z',
    href: '/pipelines',
  },
  {
    id: 'ntf_4',
    type: 'info',
    title: 'Daily AI tokens at 72%',
    body: 'You have used 1,450 of 2,000 tokens today.',
    icon: 'bolt',
    read: true,
    createdAt: '2024-10-23T08:00:00.000Z',
  },
];

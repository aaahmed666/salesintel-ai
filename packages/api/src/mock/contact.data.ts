import type { DirectoryContact } from '@salesintel/types';

export const mockContacts: DirectoryContact[] = [
  {
    id: 'cont-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@cloudscale.io',
    phone: '+1 (555) 019-2834',
    companyName: 'CloudScale Technologies',
    jobTitle: 'VP Operations',
    status: 'active',
    createdAt: '2023-05-10T10:00:00Z',
    timeline: [
      { id: 't-c-1', type: 'email', title: 'Sent pricing proposal', description: 'Proposed Enterprise tier with 15% discount for annual commitment.', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
      { id: 't-c-2', type: 'call', title: 'Introductory Discovery Call', description: 'Vetted DevOps environment and hypervisor limitations.', timestamp: new Date(Date.now() - 3600000 * 24).toISOString() },
    ],
    notes: [
      { id: 'n-c-1', content: 'Sarah is the main champion. Highly enthusiastic about the Slack alerting features.', author: 'Current Rep', date: new Date(Date.now() - 3600000 * 5).toISOString() },
    ],
  },
  {
    id: 'cont-2',
    name: 'Marcus Chen',
    email: 'marcus.chen@cloudscale.io',
    phone: '+1 (555) 019-5832',
    companyName: 'CloudScale Technologies',
    jobTitle: 'CFO',
    status: 'active',
    createdAt: '2023-06-15T11:00:00Z',
    timeline: [
      { id: 't-c-3', type: 'meeting', title: 'Contract SLA Sync', description: 'Reviewed margin calculations and payment cycles.', timestamp: new Date(Date.now() - 3600000 * 12).toISOString() },
    ],
    notes: [
      { id: 'n-c-2', content: 'Marcus is budget-conscious. Emphasize total ROI and cloud cost savings.', author: 'Current Rep', date: new Date(Date.now() - 3600000 * 10).toISOString() },
    ],
  },
  {
    id: 'cont-3',
    name: 'Anita Rao',
    email: 'anita.rao@cloudscale.io',
    phone: '+1 (555) 019-9118',
    companyName: 'CloudScale Technologies',
    jobTitle: 'Technical Lead',
    status: 'lead',
    createdAt: '2023-08-01T09:00:00Z',
    timeline: [
      { id: 't-c-4', type: 'note', title: 'Lead Captured', description: 'Downloaded the SOC2 Compliance PDF from website resource portal.', timestamp: new Date(Date.now() - 3600000 * 48).toISOString() },
    ],
    notes: [],
  },
  {
    id: 'cont-4',
    name: 'Gregory House',
    email: 'gregory.house@ppth.org',
    phone: '+1 (555) 017-1234',
    companyName: 'Princeton Plainsboro',
    jobTitle: 'Diagnostic Lead',
    status: 'do-not-contact',
    createdAt: '2022-09-12T14:00:00Z',
    timeline: [
      { id: 't-c-5', type: 'call', title: 'Outbound Dial', description: 'Refused proposal instantly due to internal database changes.', timestamp: new Date(Date.now() - 3600000 * 72).toISOString() },
    ],
    notes: [
      { id: 'n-c-3', content: 'Demanded to be removed from the calling sequence logs.', author: 'System Admin', date: new Date(Date.now() - 3600000 * 70).toISOString() },
    ],
  },
];

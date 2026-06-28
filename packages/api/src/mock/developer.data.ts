import type { ApiKey, Webhook, WebhookLog } from '@salesintel/types';

export const mockApiKeys: ApiKey[] = [
  {
    id: 'key-1',
    name: 'Production Read-Only',
    prefix: 'sk_live_51M...',
    secretValue: 'sk_live_51Mzk3dF8zJnW2p5xQ8z91xY2bA7cE4gD',
    createdAt: '2024-01-15T08:00:00Z',
    status: 'active',
  },
  {
    id: 'key-2',
    name: 'Staging Sync Worker',
    prefix: 'sk_test_51N...',
    secretValue: 'sk_test_51NzK8dG9zLmN9b2xO1q82cY1xZ4wV5pT',
    createdAt: '2024-03-22T14:30:00Z',
    status: 'active',
  },
  {
    id: 'key-3',
    name: 'Legacy Cron Service',
    prefix: 'sk_live_50A...',
    secretValue: 'sk_live_50AxK8dF8yJnR1p5xP0z82xY1bA7cE4gD',
    createdAt: '2023-06-10T10:15:00Z',
    status: 'revoked',
  },
];

export const mockWebhooks: Webhook[] = [
  {
    id: 'wh-1',
    url: 'https://api.acme.com/v1/webhooks/salesintel',
    description: 'Pipes analysis completions straight into Acme internal ERP.',
    events: ['meeting.completed', 'risk.detected'],
    secret: 'whsec_9b2xO1q82cY1xZ4wV5pT9z...',
    status: 'active',
    createdAt: '2024-02-18T09:00:00Z',
  },
  {
    id: 'wh-2',
    url: 'https://slack.com/services/hooks/B12893A',
    description: 'Post objections and coaching warnings into #sales-alerts.',
    events: ['objection.handled', 'stage.changed'],
    secret: 'whsec_a8xY2bA7cE4gD1xMzk3dF8z...',
    status: 'inactive',
    createdAt: '2024-05-01T12:00:00Z',
  },
];

export const mockWebhookLogs: WebhookLog[] = [
  {
    id: 'log-1',
    webhookId: 'wh-1',
    event: 'risk.detected',
    status: 'success',
    statusCode: 200,
    payload: JSON.stringify({ event: 'risk.detected', dealId: 'DEAL-4921-X', severity: 'critical' }, null, 2),
    responseBody: JSON.stringify({ received: true, status: 'ok' }, null, 2),
    timestamp: new Date(Date.now() - 60000 * 5).toISOString(), // 5 mins ago
    durationMs: 142,
  },
  {
    id: 'log-2',
    webhookId: 'wh-1',
    event: 'meeting.completed',
    status: 'failed',
    statusCode: 502,
    payload: JSON.stringify({ event: 'meeting.completed', meetingId: 'm-1293' }, null, 2),
    responseBody: 'Bad Gateway - Connection Timed Out',
    timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(), // 1.5 hrs ago
    durationMs: 5000,
  },
  {
    id: 'log-3',
    webhookId: 'wh-2',
    event: 'stage.changed',
    status: 'success',
    statusCode: 200,
    payload: JSON.stringify({ event: 'stage.changed', dealId: 'DEAL-4921-X', oldStage: 'proposal', newStage: 'negotiation' }, null, 2),
    responseBody: 'ok',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    durationMs: 89,
  },
];

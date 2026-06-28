import type { ID, ISODateString } from './common';

export interface ApiKey {
  id: ID;
  name: string;
  prefix: string;
  secretValue: string; // masked when sent normally, but revealed on creation
  createdAt: ISODateString;
  expiresAt?: ISODateString;
  status: 'active' | 'revoked';
}

export interface Webhook {
  id: ID;
  url: string;
  description: string;
  events: string[];
  secret: string;
  status: 'active' | 'inactive';
  createdAt: ISODateString;
}

export interface WebhookLog {
  id: ID;
  webhookId: ID;
  event: string;
  status: 'success' | 'failed' | 'retrying';
  statusCode: number;
  payload: string;
  responseBody: string;
  timestamp: ISODateString;
  durationMs: number;
}

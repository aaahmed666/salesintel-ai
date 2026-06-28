import type { ID, ISODateString } from './common';

export type AIProviderId = 'openai' | 'gemini' | 'groq' | 'whisper';

export interface AIProvider {
  id: AIProviderId;
  name: string;
  enabled: boolean;
  activeModel: string;
  availableModels: string[];
  usageTokenCount: number;
  totalCostUsd: number;
  icon: string;
}

export type SystemHealthStatus = 'healthy' | 'warning' | 'error';

export interface SystemComponentHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'offline';
  responseTimeMs: number;
  uptimePercent: number;
}

export interface AIUsagePoint {
  timestamp: string; // e.g. "10:00 AM" or date
  openaiTokens: number;
  geminiTokens: number;
  costUsd: number;
}

export interface SystemHealthSummary {
  status: SystemHealthStatus;
  components: SystemComponentHealth[];
  queueBacklog: number;
  processingRatePerMin: number;
  usageHistory: AIUsagePoint[];
  uptimePercent: number;
}

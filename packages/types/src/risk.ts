import type { ID, ISODateString } from './common';

export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';

export type RiskStatus = 'detected' | 'under_review' | 'escalated' | 'resolved';

export type RiskRootCause =
  | 'sentiment_drift'
  | 'stagnancy'
  | 'budget_reprioritization'
  | 'competitor_mentioned';

export interface EscalationTimelineItem {
  id: ID;
  status: RiskStatus;
  comment?: string;
  actor: string;
  timestamp: ISODateString;
}

export interface DealRisk {
  id: ID;
  dealId: ID;
  company: string;
  dealValue: number;
  stage: string;
  severity: RiskSeverity;
  rootCause: RiskRootCause;
  status: RiskStatus;
  lastActivity: string;
  description: string;
  repName: string;
  assigneeName?: string;
  createdAt: ISODateString;
  timeline: EscalationTimelineItem[];
}

export interface RiskRule {
  id: ID;
  title: string;
  condition: string;
  action: string;
  enabled: boolean;
}

export interface RiskFilters {
  search?: string;
  severities?: RiskSeverity[];
  statuses?: RiskStatus[];
}

import type { ID, ISODateString } from './common';
import type { PipelineStage, DealTemperature } from './pipeline';

export interface CompanyInfo {
  name: string;
  website: string;
  industry: string;
  employeeCount: number;
  annualRevenue: number;
  headquarters: string;
  description: string;
  logoUrl?: string;
}

export interface Contact {
  id: ID;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  isChampion: boolean;
}

export interface Stakeholder {
  id: ID;
  name: string;
  role: string;
  avatarUrl?: string;
  category: 'champion' | 'buyer' | 'blocker' | 'influencer';
  status: 'positive' | 'neutral' | 'negative';
}

export interface TimelineActivity {
  id: ID;
  type: 'email' | 'call' | 'meeting' | 'task' | 'document';
  title: string;
  description: string;
  date: ISODateString;
  details?: string;
  aiSummary?: string;
  transcriptAvailable?: boolean;
}

export interface Note {
  id: ID;
  content: string;
  author: string;
  date: ISODateString;
}

export interface Task {
  id: ID;
  title: string;
  dueDate: ISODateString;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface Document {
  id: ID;
  name: string;
  type: 'pdf' | 'doc' | 'xls' | 'ppt';
  size: string;
  uploadDate: ISODateString;
  url?: string;
}

export interface DealProfile {
  id: ID;
  title: string;
  stage: PipelineStage;
  value: number;
  closeDate: ISODateString;
  probability: number;
  status: string;
  tier: string;
  lastActivity: string;
  lastActivityDate: ISODateString;
  healthScore: number;
  healthScoreStatus: 'good' | 'fair' | 'risk';
  revenueTracking: {
    value: number;
    margin: number;
    expectedCloseValue: number;
  };
  nextActions: {
    id: ID;
    action: string;
    dueDate: ISODateString;
    assignee: string;
    completed: boolean;
  }[];
  company: CompanyInfo;
  contacts: Contact[];
  stakeholders: Stakeholder[];
  opportunitySummary: {
    description: string;
    painPoints: string[];
    keyRequirements: string[];
    competitorActivity: string;
  };
  meetings: {
    id: ID;
    title: string;
    date: ISODateString;
    duration: string;
    attendeesCount: number;
    aiSummary: string;
    transcriptAvailable: boolean;
  }[];
  activities: TimelineActivity[];
  notes: Note[];
  tasks: Task[];
  documents: Document[];
}

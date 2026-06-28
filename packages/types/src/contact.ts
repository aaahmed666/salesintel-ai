import type { ID, ISODateString } from './common';

export type ContactStatus = 'active' | 'inactive' | 'lead' | 'do-not-contact';

export interface ContactTimelineItem {
  id: ID;
  type: 'call' | 'email' | 'meeting' | 'note';
  title: string;
  description: string;
  timestamp: ISODateString;
}

export interface ContactNote {
  id: ID;
  content: string;
  author: string;
  date: ISODateString;
}

export interface DirectoryContact {
  id: ID;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  jobTitle: string;
  status: ContactStatus;
  timeline: ContactTimelineItem[];
  notes: ContactNote[];
  createdAt: ISODateString;
}

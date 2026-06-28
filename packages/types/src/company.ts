import type { ID, ISODateString } from './common';

export type SubscriptionPlan = 'starter' | 'growth' | 'enterprise';
export type CompanyStatus = 'active' | 'suspended' | 'trial';

export interface Company {
  id: ID;
  name: string;
  industry: string;
  domain: string;
  plan: SubscriptionPlan;
  usersCount: number;
  status: CompanyStatus;
  createdAt: ISODateString;
}

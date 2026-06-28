import type { DealRisk, RiskRule, RiskStatus, RiskFilters } from '@salesintel/types';
import { delay } from './db';
import { mockRisks, mockRiskRules } from './risk.data';

export const mockRiskApi = {
  async getRisks(filters: RiskFilters = {}): Promise<DealRisk[]> {
    await delay(300);
    let results = [...mockRisks];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (r) =>
          r.company.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.repName.toLowerCase().includes(q),
      );
    }

    if (filters.severities && filters.severities.length > 0) {
      results = results.filter((r) => filters.severities?.includes(r.severity));
    }

    if (filters.statuses && filters.statuses.length > 0) {
      results = results.filter((r) => filters.statuses?.includes(r.status));
    }

    return results;
  },

  async updateRiskStatus(
    id: string,
    status: RiskStatus,
    comment?: string,
    actor = 'Alex Mercer (Sales Manager)',
  ): Promise<DealRisk> {
    await delay(200);
    const risk = mockRisks.find((r) => r.id === id);
    if (!risk) throw new Error('Risk item not found');

    risk.status = status;
    risk.timeline.push({
      id: `t-${Date.now()}`,
      status,
      comment,
      actor,
      timestamp: new Date().toISOString(),
    });

    return { ...risk };
  },

  async getRiskRules(): Promise<RiskRule[]> {
    await delay(150);
    return [...mockRiskRules];
  },

  async toggleRiskRule(id: string, enabled: boolean): Promise<RiskRule> {
    await delay(150);
    const rule = mockRiskRules.find((r) => r.id === id);
    if (!rule) throw new Error('Escalation rule not found');
    rule.enabled = enabled;
    return { ...rule };
  },

  async createRiskRule(ruleInput: Omit<RiskRule, 'id'>): Promise<RiskRule> {
    await delay(200);
    const newRule: RiskRule = {
      id: `rule-${Date.now()}`,
      title: ruleInput.title,
      condition: ruleInput.condition,
      action: ruleInput.action,
      enabled: ruleInput.enabled ?? true,
    };
    mockRiskRules.push(newRule);
    return newRule;
  },
};

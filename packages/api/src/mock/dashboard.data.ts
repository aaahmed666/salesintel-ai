import type { RepDashboardData, ManagerDashboardData, ExecutiveDashboardData } from '@salesintel/types';

export const mockRepDashboard: RepDashboardData = {
  kpis: [
    { key: 'quota', value: '78%', label: 'Quota Attainment', change: 8, status: 'increase', icon: 'trending_up' },
    { key: 'pipeline', value: '$320,000', label: 'Personal Pipeline', change: 12, status: 'increase', icon: 'handshake' },
    { key: 'talkRatio', value: '46%', label: 'Average Talk Ratio', change: -2, status: 'decrease', icon: 'record_voice_over' },
    { key: 'activities', value: '48', label: 'Completed Activities', change: 5, status: 'increase', icon: 'event_note' },
  ],
  performanceHistory: [
    { name: 'Mon', value: 72, benchmark: 75 },
    { name: 'Tue', value: 78, benchmark: 75 },
    { name: 'Wed', value: 85, benchmark: 75 },
    { name: 'Thu', value: 74, benchmark: 75 },
    { name: 'Fri', value: 80, benchmark: 75 },
  ],
  pipelineStages: [
    { name: 'Lead', value: 8, target: 10 },
    { name: 'Qualified', value: 5, target: 8 },
    { name: 'Proposal', value: 4, target: 5 },
    { name: 'Negotiation', value: 3, target: 4 },
  ],
  talkRatioAttainment: [
    { name: 'Talk Ratio', value: 46, fill: '#4648d4' },
    { name: 'Ideal Limit', value: 50, fill: '#eff4ff' },
  ],
};

export const mockManagerDashboard: ManagerDashboardData = {
  kpis: [
    { key: 'teamQuota', value: '82%', label: 'Team Attainment', change: 4, status: 'increase', icon: 'groups' },
    { key: 'pipeline', value: '$1.4M', label: 'Team Pipeline', change: 18, status: 'increase', icon: 'monetization_on' },
    { key: 'coachingHours', value: '14 hrs', label: 'Coaching Session Time', change: 15, status: 'increase', icon: 'psychology' },
    { key: 'escalations', value: '3', label: 'Active Escalations', change: 1, status: 'increase', icon: 'auto_fix_high' },
  ],
  teamQuotaAttainment: [
    { name: 'Sarah', value: 92, target: 100 },
    { name: 'Marcus', value: 78, target: 100 },
    { name: 'Anita', value: 85, target: 100 },
    { name: 'Alex', value: 72, target: 100 },
  ],
  callVolumeTrend: [
    { name: 'Week 1', value: 140, benchmark: 150 },
    { name: 'Week 2', value: 165, benchmark: 150 },
    { name: 'Week 3', value: 180, benchmark: 150 },
    { name: 'Week 4', value: 155, benchmark: 150 },
  ],
  coachingPriorityCount: [
    { name: 'High Priority', value: 4, fill: '#ba1a1a' },
    { name: 'Other priority', value: 8, fill: '#eff4ff' },
  ],
};

export const mockExecutiveDashboard: ExecutiveDashboardData = {
  kpis: [
    { key: 'acv', value: '$4.2M', label: 'Annual Contract Value', change: 24, status: 'increase', icon: 'storefront' },
    { key: 'globalPipeline', value: '$12.8M', label: 'Global Pipeline', change: 15, status: 'increase', icon: 'travel_explore' },
    { key: 'winRate', value: '34%', label: 'Win Rate Percentage', change: 2, status: 'increase', icon: 'star' },
    { key: 'riskExposure', value: '72%', label: 'Exposure Index', change: -6, status: 'decrease', icon: 'gavel' },
  ],
  revenueGrowth: [
    { name: 'Q1', revenue: 850000, costs: 600000 },
    { name: 'Q2', revenue: 1200000, costs: 750000 },
    { name: 'Q3', revenue: 1450000, costs: 820000 },
    { name: 'Q4', revenue: 1800000, costs: 900000 },
  ],
  pipelineHealth: [
    { name: 'Healthy Deals', value: 72, fill: '#00628d' },
    { name: 'Risk exposure', value: 28, fill: '#eff4ff' },
  ],
  annualTargetAttainment: [
    { name: 'Sales Target', value: 78, target: 100 },
  ],
};

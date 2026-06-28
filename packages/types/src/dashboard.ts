import type { ID, ISODateString } from './common';

export interface KPICardData {
  key: string;
  value: string | number;
  label: string;
  change?: number; // percentage change, e.g. +12% or -3%
  status?: 'increase' | 'decrease' | 'neutral';
  icon: string;
}

export interface LineChartPoint {
  name: string;
  value: number;
  benchmark?: number;
}

export interface BarChartPoint {
  name: string;
  value: number;
  target?: number;
}

export interface AreaChartPoint {
  name: string;
  revenue: number;
  costs: number;
}

export interface RadialProgressData {
  name: string;
  value: number;
  fill: string;
}

export interface RepDashboardData {
  kpis: KPICardData[];
  performanceHistory: LineChartPoint[];
  pipelineStages: BarChartPoint[];
  talkRatioAttainment: RadialProgressData[];
}

export interface ManagerDashboardData {
  kpis: KPICardData[];
  teamQuotaAttainment: BarChartPoint[];
  callVolumeTrend: LineChartPoint[];
  coachingPriorityCount: RadialProgressData[];
}

export interface ExecutiveDashboardData {
  kpis: KPICardData[];
  revenueGrowth: AreaChartPoint[];
  pipelineHealth: RadialProgressData[];
  annualTargetAttainment: BarChartPoint[];
}

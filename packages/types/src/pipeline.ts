/**
 * Sales Pipeline domain types.
 * Covers deal tracking, stage management, KPIs, and filtering.
 */

import type { ID, ISODateString } from './common';

/* ─────────────────────── Stage & Temperature ─────────────────────── */

/** Pipeline stage identifiers ordered by progression. */
export type PipelineStage =
  | 'lead'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost';

/** Deal temperature / engagement level. */
export type DealTemperature = 'hot' | 'warm' | 'cold';

/* ─────────────────────── Sorting ─────────────────────── */

/** Sort fields for the pipeline table view. */
export type PipelineSortField =
  | 'company'
  | 'value'
  | 'stage'
  | 'closeDate'
  | 'rep'
  | 'lastActivity';

/* ─────────────────────── Deal ─────────────────────── */

/** Rep assigned to a deal. */
export interface DealRep {
  id: ID;
  name: string;
  avatarUrl?: string;
  /** Two-character fallback for avatar, e.g. "AJ". */
  initials: string;
}

/** A single deal in the pipeline. */
export interface Deal {
  id: ID;
  company: string;
  title: string;
  /** Monetary value of the deal in USD. */
  value: number;
  stage: PipelineStage;
  temperature: DealTemperature;
  /** 0–100 probability of winning this deal. */
  probability: number;
  /** Expected close date. */
  closeDate: ISODateString;
  rep: DealRep;
  /** Short label for the most recent activity, e.g. "V2 Sent". */
  lastActivity: string;
  /** ISO timestamp of the most recent activity. */
  lastActivityDate: ISODateString;
  /** Material Symbols ligature for the activity icon. */
  lastActivityIcon: string;
  /** Optional tags for filtering/display. */
  tags?: string[];
}

/* ─────────────────────── KPIs & Metrics ─────────────────────── */

/** KPI summary for the pipeline overview. */
export interface PipelineKPIs {
  totalDeals: number;
  totalValue: number;
  avgDealSize: number;
  /** Win rate as a percentage (0–100). */
  winRate: number;
  /** Average sales cycle length in days. */
  avgCycleLength: number;
  /** Value-weighted pipeline (sum of value × probability). */
  weightedPipeline: number;
}

/** Per-stage aggregation. */
export interface StageMetric {
  stage: PipelineStage;
  dealCount: number;
  totalValue: number;
}

/* ─────────────────────── Filters ─────────────────────── */

/** Filter parameters for querying the pipeline. */
export interface PipelineFilters {
  search?: string;
  stages?: PipelineStage[];
  temperatures?: DealTemperature[];
  repIds?: string[];
  minValue?: number;
  maxValue?: number;
}

/* ─────────────────────── Payload ─────────────────────── */

/** Full pipeline response payload. */
export interface PipelineData {
  deals: Deal[];
  kpis: PipelineKPIs;
  stageMetrics: StageMetric[];
  pipelineName: string;
  totalDeals: number;
}

/**
 * Re-export the shared scoring domain types for ergonomic feature-local imports.
 * The canonical definitions live in @salesintel/types so the mock backend and
 * the UI agree on shape.
 */
export type {
  SalesGrade,
  ScoringMetricKey,
  ScoringMetric,
  CoachingRecommendation,
  TalkRatioBreakdown,
  ScoreTrendPoint,
  SalesScore,
} from '@salesintel/types';

import type { ID, ISODateString } from './common';

/* -------------------------------- Meetings ------------------------------- */

/**
 * The full processing lifecycle a meeting recording moves through after upload.
 * Ordered from earliest to latest; `failed` is terminal-but-retryable.
 */
export type MeetingStatus =
  | 'uploaded'
  | 'processing'
  | 'transcribing'
  | 'analyzing'
  | 'scoring'
  | 'completed'
  | 'failed';

/** Accepted upload container/codecs (extension + MIME). */
export type MeetingFileExtension = 'mp3' | 'wav' | 'mp4' | 'webm' | 'm4a';

/** Client-side state for a file moving through the upload queue. */
export type UploadState = 'queued' | 'uploading' | 'success' | 'error' | 'canceled';

/** A queued/active client upload item (lives in the UI, not the backend). */
export interface UploadItem {
  /** Client-generated id (uuid) so the row is stable before the server responds. */
  id: ID;
  fileName: string;
  /** Size in bytes. */
  size: number;
  mimeType: string;
  extension: MeetingFileExtension;
  state: UploadState;
  /** 0–100 upload progress. */
  progress: number;
  /** Populated once the server accepts the upload. */
  meetingId?: ID;
  /** i18n error key when `state === 'error'`. */
  errorKey?: string;
}

/** A meeting record as returned by the backend / mock. */
export interface Meeting {
  id: ID;
  title: string;
  fileName: string;
  size: number;
  status: MeetingStatus;
  /** 0–100 processing progress for the active stage. */
  progress: number;
  /** Minutes of recording, when known. */
  durationMinutes?: number;
  /** Estimated minutes until processing completes. */
  estimatedMinutesLeft?: number;
  uploadedAt: ISODateString;
  /** AI deal/sentiment score once `completed`. */
  score?: number;
}

/* --------------------------------- Inputs -------------------------------- */

export interface CreateUploadInput {
  fileName: string;
  size: number;
  mimeType: string;
}

export interface CreateUploadResult {
  meetingId: ID;
  /** Echoes the initial status the backend assigns (`uploaded`). */
  status: MeetingStatus;
}

/* ------------------------- Analysis directory ---------------------------- */

/** Coarse sentiment bucket derived from the AI score. */
export type MeetingSentiment = 'very_positive' | 'positive' | 'neutral' | 'critical';

/** Sales representative summary shown in directory rows + details. */
export interface MeetingRep {
  id: ID;
  name: string;
  /** Optional avatar URL; UI falls back to initials when absent. */
  avatarUrl?: string;
}

/**
 * A fully-processed meeting as listed in the Analysis Directory table. Extends
 * the upload-centric {@link Meeting} fields with the analytical/CRM columns the
 * directory and details screens render.
 */
export interface MeetingAnalysis {
  id: ID;
  title: string;
  company: string;
  rep: MeetingRep;
  /** Meeting start, ISO. */
  date: ISODateString;
  durationMinutes: number;
  status: MeetingStatus;
  /** 0–100 AI deal score (present once analysis is complete). */
  score?: number;
  sentiment?: MeetingSentiment;
  /** Short AI insight tags, e.g. "High Intent", "Competitor Mentioned". */
  insights: string[];
  dealValue?: number;
}

/** Sortable column ids for the directory table. */
export type MeetingSortField =
  | 'title'
  | 'company'
  | 'rep'
  | 'date'
  | 'durationMinutes'
  | 'status'
  | 'score';

export type SortDirection = 'asc' | 'desc';

/** Query envelope the directory sends to the list endpoint. */
export interface MeetingListParams {
  search?: string;
  status?: MeetingStatus | 'all';
  sentiment?: MeetingSentiment | 'all';
  sortBy?: MeetingSortField;
  sortDir?: SortDirection;
  page?: number;
  pageSize?: number;
}

/* ----------------------------- Meeting details ---------------------------- */

export type ParticipantRole = 'host' | 'decision_maker' | 'blocker' | 'champion' | 'participant';

export interface MeetingParticipant {
  id: ID;
  name: string;
  title: string;
  /** Side of the table: our team vs the prospect. */
  side: 'internal' | 'external';
  role: ParticipantRole;
  avatarUrl?: string;
}

/**
 * Category of an AI-detected moment attached to a transcript utterance. Drives
 * the colour + icon of the inline highlight callout in the Transcript viewer.
 */
export type TranscriptHighlightKind = 'objection' | 'upsell' | 'buying-signal';

/** An AI highlight callout rendered beneath a transcript utterance. */
export interface TranscriptHighlight {
  id: ID;
  kind: TranscriptHighlightKind;
  /** Localized via i18n key when present, else shown verbatim. */
  titleKey?: string;
  title: string;
  detail: string;
}

/** One utterance in the transcript. */
export interface TranscriptEntry {
  id: ID;
  speaker: string;
  /** Speaker role/title shown next to the name, e.g. "Account Executive". */
  role?: string;
  /** True when the speaker is on our side ("(Me)"). */
  isSelf: boolean;
  /** Seconds from meeting start. */
  timestamp: number;
  text: string;
  /** Inline tags surfaced by the AI, e.g. "Competitor Mention". */
  tags?: string[];
  /** Substrings to emphasise inline (keyword highlighting). */
  keywords?: string[];
  /** AI highlight callout anchored to this utterance, if any. */
  highlight?: TranscriptHighlight;
}

/** A single qualification signal in the Buying Intent panel. */
export interface BuyingSignal {
  id: ID;
  label: string;
  met: boolean;
}

/** Aggregated buying-intent readout for the AI Highlights panel. */
export interface BuyingIntent {
  /** 0–100 propensity score. */
  score: number;
  signals: BuyingSignal[];
}

/** A keyword chip in the Keyword Analysis cloud. */
export interface KeywordTag {
  id: ID;
  label: string;
  /** Emphasised (primary) vs neutral chip. */
  emphasis: boolean;
}

/**
 * Side panel intelligence for the Transcript & AI Highlights screen:
 * buying intent, competitor threat levels, keyword cloud, and AI confidence.
 */
export interface TranscriptInsights {
  buyingIntent: BuyingIntent;
  competitors: TranscriptCompetitor[];
  keywords: KeywordTag[];
  /** 0–100 self-reported model confidence. */
  aiConfidence: number;
}

/** Competitor mention with a threat level for the highlights panel. */
export interface TranscriptCompetitor {
  id: ID;
  name: string;
  threatLevel: 'threat' | 'neutral' | 'favorable';
}

/** Coarse meeting urgency surfaced in the transcript meta bar. */
export type MeetingUrgency = 'high' | 'medium' | 'low';

/* ------------------------- AI Analysis Deep Dive ------------------------- */

/** Distribution of sentiment across the conversation (percentages, sum ~100). */
export interface SentimentBreakdown {
  positive: number;
  neutral: number;
  negative: number;
}

/** Share of speaking time between our side and the prospect (percentages). */
export interface TalkRatio {
  self: number;
  prospect: number;
}

export type KeywordCategory = 'product' | 'pricing' | 'competitor' | 'risk' | 'process';

/** A detected keyword with how often it surfaced and its theme. */
export interface KeywordFrequency {
  id: ID;
  label: string;
  count: number;
  category: KeywordCategory;
}

export type BuyingSignalCategory = 'timeline' | 'budget' | 'authority' | 'need';

/** A buying signal with a strength score and supporting evidence. */
export interface BuyingSignalDetail {
  id: ID;
  label: string;
  /** 0–100 strength. */
  strength: number;
  category: BuyingSignalCategory;
  evidence: string;
}

export type ObjectionSeverity = 'high' | 'medium' | 'low';
export type ObjectionStatus = 'open' | 'addressed';

/** A detected objection with severity, handling status and a recommendation. */
export interface ObjectionDetail {
  id: ID;
  title: string;
  quote: string;
  severity: ObjectionSeverity;
  status: ObjectionStatus;
  recommendation: string;
}

/** A single "you vs industry" benchmark row. */
export interface IndustryBenchmark {
  id: ID;
  label: string;
  /** This deal's value. */
  value: number;
  /** Sector benchmark value. */
  benchmark: number;
  /** Optional unit suffix, e.g. "%", "min". */
  unit?: string;
}

/** Industry positioning context for the deal. */
export interface IndustryContext {
  sector: string;
  summary: string;
  benchmarks: IndustryBenchmark[];
  trends: string[];
}

/** A recommended next action surfaced by the deep dive. */
export interface DeepDiveRecommendation {
  id: ID;
  title: string;
  detail: string;
  actionLabel: string;
  tone: 'positive' | 'neutral' | 'risk';
}

/** Aggregated buying-signal section payload. */
export interface BuyingSignalsSection {
  score: number;
  summary: string;
  signals: BuyingSignalDetail[];
}

/** Sentiment section payload. */
export interface SentimentSection {
  overall: MeetingSentiment;
  summary: string;
  breakdown: SentimentBreakdown;
  timeline: SentimentPoint[];
  talkRatio: TalkRatio;
  qualityScore: number;
}

/** Full payload for the AI Analysis Deep Dive screen. */
export interface MeetingDeepDive {
  id: ID;
  title: string;
  company: string;
  date: ISODateString;
  /** 0–100 closed-won probability shown in the header pill. */
  closeWonProbability: number;
  /** 0–100 composite deal-health score. */
  dealHealthScore: number;
  sentiment: SentimentSection;
  competitors: CompetitorMention[];
  competitorSummary: string;
  industry: IndustryContext;
  keywords: KeywordFrequency[];
  keywordSummary: string;
  buyingSignals: BuyingSignalsSection;
  objections: ObjectionDetail[];
  objectionSummary: string;
  recommendations: DeepDiveRecommendation[];
}

/** A single bar in the sentiment timeline. */
export interface SentimentPoint {
  /** Seconds from meeting start. */
  timestamp: number;
  /** -1..1 sentiment value; negative = friction. */
  value: number;
}

export interface CompetitorMention {
  id: ID;
  name: string;
  mentions: number;
  context: string;
  favorable: boolean;
}

export interface AnalysisHighlight {
  id: ID;
  /** i18n-free label; localized category tag. */
  label: string;
  tone: 'positive' | 'neutral' | 'risk';
  detail: string;
}

export interface NextStep {
  id: ID;
  label: string;
  done: boolean;
}

/** Full detail payload for the Meeting Details screen. */
export interface MeetingDetail extends MeetingAnalysis {
  recordingAvailable: boolean;
  /** Free-text AI executive summary. */
  summary: string;
  summaryTags: string[];
  propensityLabel: string;
  participants: MeetingParticipant[];
  sentimentTimeline: SentimentPoint[];
  competitors: CompetitorMention[];
  highlights: AnalysisHighlight[];
  nextSteps: NextStep[];
  transcript: TranscriptEntry[];
  /** CRM sync provider label, e.g. "SFDC". */
  crmProvider?: string;
  /** Side-panel intelligence for the Transcript & AI Highlights screen. */
  transcriptInsights?: TranscriptInsights;
  /** Coarse urgency surfaced in the transcript meta bar. */
  urgency?: MeetingUrgency;
}

/* ----------------------- Sales Scoring Engine ----------------------- */

/** Letter grade for a sales metric. */
export type SalesGrade = 'A+' | 'A' | 'B' | 'C' | 'D';

/** Individual metric within the scoring engine. */
export type ScoringMetricKey =
  | 'talkRatio'
  | 'discovery'
  | 'objectionHandling'
  | 'commitment'
  | 'nextSteps';

/** A single scored metric with its value, benchmark, grade, and tips. */
export interface ScoringMetric {
  key: ScoringMetricKey;
  label: string;
  /** 0–100 score for this metric. */
  score: number;
  /** 0–100 benchmark for industry average. */
  benchmark: number;
  grade: SalesGrade;
  /** Short explanation of how this score was derived. */
  description: string;
  /** What the rep did well. */
  strengths: string[];
  /** Areas for improvement. */
  improvements: string[];
}

/** A coaching recommendation card. */
export interface CoachingRecommendation {
  id: ID;
  title: string;
  detail: string;
  /** The metric this recommendation targets. */
  metricKey: ScoringMetricKey;
  priority: 'high' | 'medium' | 'low';
  /** Actionable steps. */
  steps: string[];
  /** Estimated improvement if followed. */
  estimatedImpact: string;
}

/** Talk ratio breakdown for the radial chart. */
export interface TalkRatioBreakdown {
  selfPercent: number;
  prospectPercent: number;
  silencePercent: number;
  /** Ideal range from Gong Gold Standard. */
  idealSelfRange: [number, number];
}

/** Score trend data point for sparklines. */
export interface ScoreTrendPoint {
  date: ISODateString;
  score: number;
}

/** Full payload for the Sales Scoring Engine screen. */
export interface SalesScore {
  id: ID;
  meetingId: ID;
  meetingTitle: string;
  repName: string;
  date: ISODateString;
  /** 0–100 overall composite score. */
  overallScore: number;
  overallGrade: SalesGrade;
  /** Previous meeting's overall score for delta. */
  previousScore?: number;
  metrics: ScoringMetric[];
  talkRatioBreakdown: TalkRatioBreakdown;
  coachingRecommendations: CoachingRecommendation[];
  /** Historical scores for the trend sparkline. */
  scoreTrend: ScoreTrendPoint[];
}

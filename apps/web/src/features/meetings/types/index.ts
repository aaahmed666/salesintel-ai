/**
 * Re-export the shared domain types for ergonomic feature-local imports. The
 * canonical definitions live in @salesintel/types so the mock backend and the
 * UI agree on shape.
 */
export type {
  Meeting,
  MeetingStatus,
  MeetingFileExtension,
  UploadItem,
  UploadState,
  CreateUploadInput,
  CreateUploadResult,
  MeetingAnalysis,
  MeetingDetail,
  MeetingRep,
  MeetingSentiment,
  MeetingSortField,
  MeetingListParams,
  SortDirection,
  MeetingParticipant,
  ParticipantRole,
  TranscriptEntry,
  SentimentPoint,
  CompetitorMention,
  AnalysisHighlight,
  NextStep,
} from '@salesintel/types';

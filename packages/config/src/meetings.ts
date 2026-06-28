import type { MeetingFileExtension, MeetingStatus } from '@salesintel/types';

/* ----------------------------- Upload limits ----------------------------- */

/** Hard ceiling enforced client-side before a file enters the queue. */
export const MAX_UPLOAD_BYTES = 500 * 1024 * 1024; // 500 MB
export const MAX_UPLOAD_MB = 500;

/** Maximum number of files that may be queued in a single batch. */
export const MAX_UPLOAD_BATCH = 10;

/** Accepted extensions and their canonical MIME types. */
export const ACCEPTED_UPLOAD_TYPES: Record<MeetingFileExtension, string[]> = {
  mp3: ['audio/mpeg', 'audio/mp3'],
  wav: ['audio/wav', 'audio/x-wav', 'audio/wave'],
  mp4: ['video/mp4'],
  webm: ['video/webm', 'audio/webm'],
  m4a: ['audio/x-m4a', 'audio/m4a', 'audio/mp4'],
};

/** Flat MIME list for the file input `accept` attribute. */
export const ACCEPTED_MIME_LIST: string[] = Object.values(ACCEPTED_UPLOAD_TYPES).flat();

/** Dot-prefixed extension list for the file input `accept` attribute. */
export const ACCEPTED_EXTENSION_LIST: string[] = (
  Object.keys(ACCEPTED_UPLOAD_TYPES) as MeetingFileExtension[]
).map((ext) => `.${ext}`);

export const FILE_INPUT_ACCEPT = [...ACCEPTED_EXTENSION_LIST, ...ACCEPTED_MIME_LIST].join(',');

/* --------------------------- Status presentation -------------------------- */

/**
 * Visual treatment for each processing status. `tone` maps to the design's
 * semantic chip colors; `icon` is a Material Symbols ligature. `i18n` is the
 * label key under `meetings.status.*`.
 */
export const MEETING_STATUS_META: Record<
  MeetingStatus,
  { tone: 'neutral' | 'info' | 'progress' | 'success' | 'error'; icon: string }
> = {
  uploaded: { tone: 'neutral', icon: 'cloud_done' },
  processing: { tone: 'info', icon: 'autorenew' },
  transcribing: { tone: 'progress', icon: 'graphic_eq' },
  analyzing: { tone: 'progress', icon: 'psychology' },
  scoring: { tone: 'progress', icon: 'scoreboard' },
  completed: { tone: 'success', icon: 'check_circle' },
  failed: { tone: 'error', icon: 'error' },
};

/** Ordered pipeline stages (excludes terminal completed/failed). */
export const PROCESSING_PIPELINE: MeetingStatus[] = [
  'uploaded',
  'processing',
  'transcribing',
  'analyzing',
  'scoring',
];

/* --------------------------- Analysis directory -------------------------- */

import type { MeetingSentiment } from '@salesintel/types';

/** Page size options for the analysis directory table. */
export const DIRECTORY_PAGE_SIZES = [10, 25, 50] as const;
export const DEFAULT_DIRECTORY_PAGE_SIZE = 10;

/**
 * Visual treatment for each sentiment bucket. `tone` maps to the {@link Badge}
 * tones; `min` is the inclusive lower score bound used to derive a bucket from
 * a raw score.
 */
export const MEETING_SENTIMENT_META: Record<
  MeetingSentiment,
  { tone: 'success' | 'info' | 'neutral' | 'error'; min: number }
> = {
  very_positive: { tone: 'success', min: 85 },
  positive: { tone: 'info', min: 70 },
  neutral: { tone: 'neutral', min: 50 },
  critical: { tone: 'error', min: 0 },
};

/** Derive a sentiment bucket from a 0–100 score. */
export function sentimentFromScore(score: number): MeetingSentiment {
  if (score >= MEETING_SENTIMENT_META.very_positive.min) return 'very_positive';
  if (score >= MEETING_SENTIMENT_META.positive.min) return 'positive';
  if (score >= MEETING_SENTIMENT_META.neutral.min) return 'neutral';
  return 'critical';
}

/** Status filter options surfaced in the directory filter menu. */
export const DIRECTORY_STATUS_FILTERS: (MeetingStatus | 'all')[] = [
  'all',
  'completed',
  'analyzing',
  'transcribing',
  'processing',
  'failed',
];

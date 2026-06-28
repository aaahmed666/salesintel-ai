'use client';

import { useQuery } from '@tanstack/react-query';
import { meetingService, queryKeys } from '@salesintel/api';
import type {
  ApiError,
  MeetingDetail,
  TranscriptEntry,
  TranscriptInsights,
  MeetingUrgency,
} from '@salesintel/types';

export interface TranscriptPayload {
  meetingId: string;
  title: string;
  company: string;
  durationMinutes: number;
  dealValue?: number;
  date: string;
  urgency?: MeetingUrgency;
  transcript: TranscriptEntry[];
  transcriptInsights?: TranscriptInsights;
}

/**
 * Transcript-scoped view over the meeting detail payload. Re-uses the cached
 * detail query (same queryKey) and `select`s just the transcript + insights so
 * the Transcript screen never refetches what the detail screen already loaded.
 */
export function useTranscript(id: string) {
  return useQuery<MeetingDetail, ApiError, TranscriptPayload>({
    queryKey: queryKeys.meetings.detail(id),
    queryFn: () => meetingService.getAnalysis(id),
    enabled: Boolean(id),
    select: (m): TranscriptPayload => ({
      meetingId: m.id,
      title: m.title,
      company: m.company,
      durationMinutes: m.durationMinutes,
      dealValue: m.dealValue,
      date: m.date,
      urgency: m.urgency,
      transcript: m.transcript,
      transcriptInsights: m.transcriptInsights,
    }),
  });
}

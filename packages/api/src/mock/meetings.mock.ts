import type {
  CreateUploadInput,
  CreateUploadResult,
  Meeting,
  MeetingStatus,
} from '@salesintel/types';
import { PROCESSING_PIPELINE } from '@salesintel/config';
import { delay } from './db';
import { makeMeeting, mockMeetings } from './meetings.data';

/** Session-scoped store so uploads + status advancement persist. */
let meetings: Meeting[] = mockMeetings.map((m) => ({ ...m }));

function deriveTitle(fileName: string): string {
  const base = fileName.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
  return base.replace(/\b\w/g, (c) => c.toUpperCase()).trim() || 'Untitled Meeting';
}

/**
 * Advance a single meeting one step through the processing pipeline. Each call
 * bumps progress; when progress completes the current stage, it moves to the
 * next. Returns the updated meeting so the UI can poll.
 */
function advance(meeting: Meeting): Meeting {
  if (meeting.status === 'completed' || meeting.status === 'failed') return meeting;

  const idx = PROCESSING_PIPELINE.indexOf(meeting.status);
  const nextProgress = Math.min(100, meeting.progress + 18 + Math.floor(Math.random() * 14));

  if (nextProgress >= 100) {
    const isLast = idx >= PROCESSING_PIPELINE.length - 1;
    if (isLast) {
      return {
        ...meeting,
        status: 'completed',
        progress: 100,
        estimatedMinutesLeft: 0,
        score: 80 + Math.floor(Math.random() * 18),
      };
    }
    const nextStatus = PROCESSING_PIPELINE[idx + 1] as MeetingStatus;
    return { ...meeting, status: nextStatus, progress: 8 };
  }

  return {
    ...meeting,
    progress: nextProgress,
    estimatedMinutesLeft: Math.max(0, (meeting.estimatedMinutesLeft ?? 5) - 1),
  };
}

export const mockMeetingApi = {
  async createUpload(input: CreateUploadInput): Promise<CreateUploadResult> {
    await delay(600);
    const meeting = makeMeeting(deriveTitle(input.fileName), input.fileName, input.size);
    meetings = [meeting, ...meetings];
    // Kick the new upload into the pipeline.
    setTimeout(() => {
      meetings = meetings.map((m) =>
        m.id === meeting.id ? { ...m, status: 'processing', progress: 5 } : m,
      );
    }, 800);
    return { meetingId: meeting.id, status: 'uploaded' };
  },

  async listMeetings(): Promise<Meeting[]> {
    await delay(500);
    // Each poll advances active meetings to simulate background processing.
    meetings = meetings.map((m) => (m.status === 'uploaded' ? m : advance(m)));
    return meetings.map((m) => ({ ...m }));
  },

  async retryUpload(meetingId: string): Promise<Meeting> {
    await delay(500);
    meetings = meetings.map((m) =>
      m.id === meetingId ? { ...m, status: 'processing', progress: 5, estimatedMinutesLeft: 5 } : m,
    );
    const found = meetings.find((m) => m.id === meetingId);
    if (!found) throw { code: 'NOT_FOUND', message: 'errors.unknown', status: 404 };
    return { ...found };
  },
};

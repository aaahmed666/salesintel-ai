import type { Meeting } from '@salesintel/types';
import { randomId } from './db';

/**
 * Seed meeting history, mirroring the design's Processing Queue + history. The
 * active rows advance through the pipeline via the mock service's progress
 * simulation; completed rows are terminal.
 */
export const mockMeetings: Meeting[] = [
  {
    id: 'mtg_1',
    title: 'Q4 Strategy - Acme Corp',
    fileName: 'q4-strategy-acme.mp4',
    size: 124 * 1024 * 1024,
    status: 'analyzing',
    progress: 64,
    durationMinutes: 48,
    estimatedMinutesLeft: 4,
    uploadedAt: '2024-10-24T10:45:00.000Z',
  },
  {
    id: 'mtg_2',
    title: 'Discovery Call: Stellar Solutions',
    fileName: 'discovery-stellar.m4a',
    size: 42 * 1024 * 1024,
    status: 'transcribing',
    progress: 88,
    durationMinutes: 22,
    estimatedMinutesLeft: 1,
    uploadedAt: '2024-10-24T09:15:00.000Z',
  },
  {
    id: 'mtg_3',
    title: 'Weekly Sync - Regional Ops',
    fileName: 'weekly-sync-regional.mp3',
    size: 18 * 1024 * 1024,
    status: 'completed',
    progress: 100,
    durationMinutes: 31,
    uploadedAt: '2024-10-24T07:30:00.000Z',
    score: 91,
  },
  {
    id: 'mtg_4',
    title: 'Renewal Review - Globex',
    fileName: 'renewal-globex.wav',
    size: 64 * 1024 * 1024,
    status: 'failed',
    progress: 0,
    uploadedAt: '2024-10-23T15:05:00.000Z',
  },
];

export function makeMeeting(title: string, fileName: string, size: number): Meeting {
  return {
    id: randomId('mtg'),
    title,
    fileName,
    size,
    status: 'uploaded',
    progress: 0,
    estimatedMinutesLeft: 5,
    uploadedAt: new Date().toISOString(),
  };
}

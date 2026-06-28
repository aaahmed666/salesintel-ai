'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@salesintel/ui';
import type { TranscriptEntry, TranscriptHighlightKind } from '@salesintel/types';
import { formatTimestamp } from '../hooks/use-format';

const MARKER_COLOR: Record<TranscriptHighlightKind, string> = {
  objection: 'bg-error',
  upsell: 'bg-tertiary',
  'buying-signal': 'bg-primary',
};

interface TranscriptTimelineProps {
  entries: TranscriptEntry[];
  /** Total meeting duration in seconds (axis scale). */
  durationSeconds: number;
  /** Current playhead position in seconds. */
  position?: number;
  onSeek?: (seconds: number) => void;
}

/**
 * Horizontal timeline of the conversation. Each AI highlight is a coloured,
 * clickable marker positioned by timestamp; a playhead reflects the current
 * position. Uses logical inline-start offsets so markers mirror correctly in RTL.
 */
export function TranscriptTimeline({
  entries,
  durationSeconds,
  position = 0,
  onSeek,
}: TranscriptTimelineProps) {
  const t = useTranslations('meetings.transcript.timeline');
  const total = Math.max(durationSeconds, 1);
  const highlights = entries.filter((e) => e.highlight);
  const playPct = Math.min(100, Math.max(0, (position / total) * 100));

  return (
    <div className="bg-surface-container-lowest border-outline-variant rounded-xl border p-4">
      <p className="text-label-sm text-on-surface-variant mb-3 font-semibold uppercase tracking-wide">
        {t('label')}
      </p>

      <div className="relative h-2 w-full rounded-full bg-surface-container">
        {/* progress fill */}
        <div
          className="bg-primary/30 absolute inset-y-0 start-0 rounded-full"
          style={{ width: `${playPct}%` }}
        />
        {/* playhead */}
        <div
          className="bg-primary border-surface-container-lowest absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2"
          style={{ insetInlineStart: `calc(${playPct}% - 6px)` }}
          aria-hidden
        />
        {/* highlight markers */}
        {highlights.map((entry) => {
          const pct = Math.min(100, Math.max(0, (entry.timestamp / total) * 100));
          const kind = entry.highlight!.kind;
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => onSeek?.(entry.timestamp)}
              title={t('jumpTo', { time: formatTimestamp(entry.timestamp) })}
              aria-label={t('jumpTo', { time: formatTimestamp(entry.timestamp) })}
              className={cn(
                'absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full ring-2 ring-surface-container-lowest transition-transform hover:scale-125',
                MARKER_COLOR[kind],
              )}
              style={{ insetInlineStart: `calc(${pct}% - 7px)` }}
            />
          );
        })}
      </div>

      <div className="text-label-sm text-on-surface-variant mt-2 flex justify-between tabular-nums">
        <span>{formatTimestamp(0)}</span>
        <span>{formatTimestamp(total)}</span>
      </div>
    </div>
  );
}

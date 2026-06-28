'use client';

import { forwardRef } from 'react';
import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback, cn } from '@salesintel/ui';
import type { TranscriptEntry } from '@salesintel/types';
import { Icon } from '@/features/shell';
import { formatTimestamp } from '../hooks/use-format';
import { TranscriptKeywordText } from './transcript-keyword-text';
import { TranscriptHighlightCallout } from './transcript-highlight-callout';

function initials(name: string): string {
  const clean = name.replace(/\(.*?\)/g, '').trim();
  return clean
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

function displayName(speaker: string): string {
  return speaker.replace(/\s*\(.*?\)\s*/g, '').trim();
}

interface TranscriptMessageProps {
  entry: TranscriptEntry;
  /** Active search query for inline match highlighting. */
  query?: string;
  /** True when this entry is the currently focused search match. */
  active?: boolean;
  /** Seek the (mock) player to this utterance's timestamp. */
  onSeek?: (seconds: number) => void;
}

/**
 * A single threaded utterance: avatar + speaker identity, a clickable timestamp
 * (timestamp navigation), keyword-highlighted body, and an optional AI callout.
 * Forwarded ref + `data-entry-id` let the timeline and search scroll to it.
 */
export const TranscriptMessage = forwardRef<HTMLLIElement, TranscriptMessageProps>(
  function TranscriptMessage({ entry, query, active, onSeek }, ref) {
    const t = useTranslations('meetings.transcript');
    const stamp = formatTimestamp(entry.timestamp);

    return (
      <li
        ref={ref}
        data-entry-id={entry.id}
        className={cn(
          'flex gap-3 scroll-mt-28 rounded-xl p-2 transition-colors',
          active && 'bg-primary/5 ring-1 ring-primary/30',
        )}
      >
        <Avatar className="mt-0.5 h-10 w-10 flex-shrink-0">
          <AvatarFallback
            className={cn(
              'text-label-sm font-bold',
              entry.isSelf
                ? 'bg-secondary-fixed text-secondary'
                : 'bg-primary-fixed text-primary',
            )}
          >
            {initials(entry.speaker)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-body-sm text-on-surface font-semibold">
              {displayName(entry.speaker)}
            </span>
            {entry.role ? (
              <span className="text-body-sm text-on-surface-variant">{entry.role}</span>
            ) : null}
            <button
              type="button"
              onClick={() => onSeek?.(entry.timestamp)}
              title={t('jumpToTimestamp', { time: stamp })}
              aria-label={t('jumpToTimestamp', { time: stamp })}
              className="text-label-sm text-on-surface-variant hover:text-primary ms-auto inline-flex items-center gap-1 font-medium tabular-nums transition-colors"
            >
              <Icon name="play_circle" size={14} />
              {stamp}
            </button>
          </div>

          <p className="text-body-md text-on-surface-variant mt-1 leading-relaxed">
            <TranscriptKeywordText text={entry.text} keywords={entry.keywords} query={query} />
          </p>

          {entry.tags && entry.tags.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-surface-container text-label-sm text-on-surface-variant rounded px-2 py-0.5 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {entry.highlight ? <TranscriptHighlightCallout highlight={entry.highlight} /> : null}
        </div>
      </li>
    );
  },
);

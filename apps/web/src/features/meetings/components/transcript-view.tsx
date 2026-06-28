'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { TranscriptEntry } from '@salesintel/types';
import { Avatar, AvatarFallback, Input } from '@salesintel/ui';
import { Icon } from '@/features/shell';

function initials(name: string): string {
  const clean = name.replace(/\(.*?\)/g, '').trim();
  return clean
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

interface TranscriptViewProps {
  entries: TranscriptEntry[];
  /** When true, shows the search box + download header (Transcript tab). */
  withHeader?: boolean;
}

/** Threaded meeting transcript with speaker bubbles and inline AI tags. */
export function TranscriptView({ entries, withHeader = true }: TranscriptViewProps) {
  const t = useTranslations('meetings.details');
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? entries.filter((e) => e.text.toLowerCase().includes(query.toLowerCase()))
    : entries;

  return (
    <div>
      {withHeader ? (
        <div className="mb-md flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-body-lg text-on-surface font-semibold">{t('transcript')}</h3>
            <button
              type="button"
              className="text-body-sm text-primary inline-flex items-center gap-1 font-medium hover:underline"
            >
              <Icon name="download" size={16} />
              {t('downloadPdf')}
            </button>
          </div>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('findInTranscript')}
            startIcon={<Icon name="search" size={16} className="text-on-surface-variant" />}
            className="h-10 sm:max-w-xs"
            aria-label={t('findInTranscript')}
          />
        </div>
      ) : null}

      <ol className="space-y-md">
        {filtered.map((entry) => (
          <li key={entry.id} className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback
                className={
                  entry.isSelf
                    ? 'bg-primary text-on-primary text-label-sm'
                    : 'bg-secondary-container/20 text-secondary text-label-sm'
                }
              >
                {initials(entry.speaker)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-body-sm text-on-surface font-semibold">{entry.speaker}</p>
              <p className="text-body-sm text-on-surface-variant mt-1">{entry.text}</p>
              {entry.tags && entry.tags.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-error-container/50 text-label-sm text-on-error-container rounded px-2 py-0.5 font-medium uppercase tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </li>
        ))}
        {filtered.length === 0 ? (
          <li className="py-lg text-body-sm text-on-surface-variant text-center">
            {t('noTranscriptMatch')}
          </li>
        ) : null}
      </ol>
    </div>
  );
}

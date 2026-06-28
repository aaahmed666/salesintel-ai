'use client';

import { useMemo, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Avatar, AvatarFallback, Button, Input, Skeleton, cn } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import { useTranscript } from '../queries/use-transcript';
import { useTranscriptSearch } from '../hooks/use-transcript-search';
import { formatDuration, formatCurrency } from '../hooks/use-format';
import { TranscriptMessage } from './transcript-message';
import { TranscriptTimeline } from './transcript-timeline';
import { AiHighlightsPanel } from './ai-highlights-panel';

const URGENCY_STYLES = {
  high: 'bg-error-container/60 text-on-error-container',
  medium: 'bg-tertiary-container/20 text-tertiary',
  low: 'bg-surface-container-high text-on-surface-variant',
} as const;

function speakerInitials(name: string): string {
  const clean = name.replace(/\(.*?\)/g, '').trim();
  return clean
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

interface TranscriptHighlightsScreenProps {
  meetingId: string;
}

/** Standalone Transcript & AI Highlights screen (Transcript Viewer + AI panel). */
export function TranscriptHighlightsScreen({ meetingId }: TranscriptHighlightsScreenProps) {
  const t = useTranslations('meetings.transcript');
  const locale = useLocale();
  const { data, isLoading, isError, refetch } = useTranscript(meetingId);

  const entries = useMemo(() => data?.transcript ?? [], [data]);
  const search = useTranscriptSearch(entries);
  const [position, setPosition] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  const durationSeconds = (data?.durationMinutes ?? 0) * 60;

  // Avatar stack derived from distinct transcript speakers.
  const speakers = useMemo(() => {
    const seen = new Map<string, string>();
    for (const e of entries) {
      const name = e.speaker.replace(/\s*\(.*?\)\s*/g, '').trim();
      if (!seen.has(name)) seen.set(name, name);
    }
    return [...seen.values()];
  }, [entries]);

  if (isLoading) return <TranscriptScreenSkeleton />;

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <Icon name="error" size={40} className="text-error" />
        <p className="text-body-md text-on-surface-variant max-w-sm">{t('error')}</p>
        <Button variant="secondary" onClick={() => refetch()}>
          {t('retry')}
        </Button>
      </div>
    );
  }

  const visibleSpeakers = speakers.slice(0, 3);
  const extraSpeakers = Math.max(0, speakers.length - visibleSpeakers.length);

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Meta bar */}
      <div className="border-outline-variant flex flex-col gap-4 border-b pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Meta label={t('duration')} value={formatDuration(data.durationMinutes)} />
          {data.dealValue != null ? (
            <Meta
              label={t('dealValue')}
              value={formatCurrency(data.dealValue, locale)}
              valueClass="text-primary"
            />
          ) : null}

          <div className="flex -space-x-2 rtl:space-x-reverse">
            {visibleSpeakers.map((name) => (
              <Avatar key={name} className="border-surface h-8 w-8 border-2">
                <AvatarFallback className="bg-primary-fixed text-primary text-label-sm font-bold">
                  {speakerInitials(name)}
                </AvatarFallback>
              </Avatar>
            ))}
            {extraSpeakers > 0 ? (
              <span className="bg-surface-container-high text-on-surface-variant border-surface text-label-sm z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 font-semibold">
                {t('participantsMore', { count: extraSpeakers })}
              </span>
            ) : null}
          </div>

          {data.urgency ? (
            <span
              className={cn(
                'text-label-sm rounded-full px-3 py-1 font-semibold uppercase tracking-wide',
                URGENCY_STYLES[data.urgency],
              )}
            >
              {t(`urgency.${data.urgency}`)}
            </span>
          ) : null}
        </div>

        <Button className="gap-2">
          <Icon name="ios_share" size={18} />
          {t('exportInsights')}
        </Button>
      </div>

      <div className="gap-lg mt-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main column: search + timeline + thread */}
        <div className="space-y-lg min-w-0">
          <SearchBar search={search} />
          <TranscriptTimeline
            entries={entries}
            durationSeconds={durationSeconds}
            position={position}
            onSeek={setPosition}
          />

          {entries.length === 0 ? (
            <div className="text-body-md text-on-surface-variant py-16 text-center">
              {t('empty')}
            </div>
          ) : (
            <ol ref={listRef} className="space-y-md">
              {entries.map((entry) => (
                <TranscriptMessage
                  key={entry.id}
                  entry={entry}
                  query={search.query}
                  active={search.activeId === entry.id}
                  onSeek={setPosition}
                  ref={(node) => search.registerEntry(entry.id, node)}
                />
              ))}
            </ol>
          )}
        </div>

        {/* Side rail: AI highlights */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          {data.transcriptInsights ? (
            <AiHighlightsPanel insights={data.transcriptInsights} />
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function Meta({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div>
      <p className="text-label-sm text-on-surface-variant font-semibold uppercase tracking-wide">
        {label}
      </p>
      <p className={cn('text-body-md text-on-surface font-semibold tabular-nums', valueClass)}>
        {value}
      </p>
    </div>
  );
}

function SearchBar({ search }: { search: ReturnType<typeof useTranscriptSearch> }) {
  const t = useTranslations('meetings.transcript.search');
  const hasQuery = search.query.trim().length > 0;
  const total = search.matchIds.length;

  return (
    <div className="flex items-center gap-2">
      <Input
        value={search.query}
        onChange={(e) => search.setQuery(e.target.value)}
        placeholder={t('placeholder')}
        startIcon={<Icon name="search" size={16} className="text-on-surface-variant" />}
        className="h-11 flex-1"
        aria-label={t('placeholder')}
      />
      {hasQuery ? (
        <div className="text-label-sm text-on-surface-variant flex items-center gap-1">
          <span className="tabular-nums">
            {total > 0 ? t('matches', { current: search.activeIndex + 1, total }) : t('noMatches')}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={search.previous}
            disabled={total === 0}
            aria-label={t('previous')}
          >
            <Icon name="keyboard_arrow_up" size={18} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={search.next}
            disabled={total === 0}
            aria-label={t('next')}
          >
            <Icon name="keyboard_arrow_down" size={18} />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={search.clear} aria-label={t('clear')}>
            <Icon name="close" size={18} />
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function TranscriptScreenSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="border-outline-variant flex items-center justify-between border-b pb-4">
        <div className="flex gap-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="gap-lg mt-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-lg">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-20 w-full" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-lg">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    </div>
  );
}

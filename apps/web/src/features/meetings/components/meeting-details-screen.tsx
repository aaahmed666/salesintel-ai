'use client';

import { useLocale, useTranslations } from 'next-intl';
import { ROUTES } from '@salesintel/config';
import { Button, Card, Skeleton } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import { Link } from '@/i18n/navigation';
import { formatDateTime, formatDuration } from '../hooks';
import { useMeetingDetail } from '../queries';
import { ExecutiveSummary } from './executive-summary';
import { AnalysisHighlights, CompetitorIntelligence } from './meeting-analysis-blocks';
import { MeetingMetaSidebar } from './meeting-meta-sidebar';
import { ScoreRing } from './score-ring';
import { SentimentTimeline } from './sentiment-timeline';
import { TranscriptView } from './transcript-view';

/**
 * Unified-scroll meeting detail (design parity): AI summary + score ring,
 * sentiment timeline, competitor intelligence, AI highlights and the transcript
 * are stacked in one scroll, with a sticky metadata / next-steps / stakeholders
 * sidebar. Deep links jump to the dedicated transcript and analysis screens.
 */
export function MeetingDetailsScreen({ meetingId }: { meetingId: string }) {
  const t = useTranslations('meetings.details');
  const locale = useLocale();
  const { data: meeting, isLoading, isError, refetch } = useMeetingDetail(meetingId);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[88rem] space-y-lg p-md lg:p-lg">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-96" />
        <div className="grid grid-cols-1 gap-lg lg:grid-cols-[1fr_20rem]">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !meeting) {
    return (
      <div className="mx-auto flex w-full max-w-[88rem] flex-col items-center gap-3 p-2xl text-center">
        <Icon name="error" size={40} className="text-error" />
        <p className="text-body-md text-on-surface">{t('error')}</p>
        <Button type="button" variant="secondary" size="sm" onClick={() => refetch()}>
          {t('retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[88rem] p-md lg:p-lg">
      {/* Breadcrumb */}
      <nav className="mb-2 flex items-center gap-1.5 text-body-sm text-on-surface-variant">
        <Link href={ROUTES.meetings.root} className="hover:text-on-surface">
          {t('breadcrumb')}
        </Link>
        <Icon name="chevron_right" size={16} className="rtl:rotate-180" />
        <span className="font-medium text-primary">{meeting.title}</span>
      </nav>

      {/* Header */}
      <header className="flex flex-col gap-md sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-headline-lg text-on-surface">{meeting.title}</h1>
          <p className="mt-1 inline-flex items-center gap-2 text-body-sm text-on-surface-variant">
            <Icon name="calendar_today" size={16} />
            {formatDateTime(meeting.date, locale)} · {formatDuration(meeting.durationMinutes)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" size="sm" className="gap-2">
            <Icon name="download" size={18} />
            {t('export')}
          </Button>
          <Button type="button" variant="primary" size="sm" className="gap-2">
            <Icon name="share" size={18} />
            {t('shareInsight')}
          </Button>
        </div>
      </header>

      <div className="mt-lg grid grid-cols-1 gap-lg lg:grid-cols-[1fr_20rem]">
        {/* Unified content scroll */}
        <div className="space-y-lg">
          <div className="grid grid-cols-1 gap-md md:grid-cols-[1fr_14rem]">
            <Card>
              <ExecutiveSummary meeting={meeting} />
            </Card>
            <Card className="bg-primary-container/10">
              {meeting.score !== undefined ? (
                <ScoreRing score={meeting.score} propensityLabel={meeting.propensityLabel} />
              ) : (
                <p className="py-lg text-center text-body-sm text-on-surface-variant">
                  {t('scorePending')}
                </p>
              )}
            </Card>
          </div>

          <Card>
            <SentimentTimeline points={meeting.sentimentTimeline} />
          </Card>

          <Card>
            <div className="mb-md flex items-center justify-between">
              <AnalysisHighlights highlights={meeting.highlights} />
            </div>
            <div className="flex justify-end border-t border-outline-variant pt-3">
              <Button asChild variant="ghost" size="sm" className="gap-1">
                <Link href={ROUTES.meetings.deepDive(meeting.id)}>
                  {t('openDeepDive')}
                  <Icon name="arrow_forward" size={16} className="rtl:rotate-180" />
                </Link>
              </Button>
            </div>
          </Card>

          <Card>
            <CompetitorIntelligence competitors={meeting.competitors} />
          </Card>

          <Card>
            <div className="mb-md flex items-center justify-between border-b border-outline-variant pb-3">
              <h2 className="font-display text-title-md font-bold text-on-surface">{t('tabs.transcript')}</h2>
              <Button asChild variant="ghost" size="sm" className="gap-1">
                <Link href={ROUTES.meetings.transcript(meeting.id)}>
                  {t('openTranscript')}
                  <Icon name="arrow_forward" size={16} className="rtl:rotate-180" />
                </Link>
              </Button>
            </div>
            <TranscriptView entries={meeting.transcript} />
          </Card>
        </div>

        {/* Sticky metadata sidebar */}
        <div className="lg:sticky lg:top-md lg:self-start">
          <MeetingMetaSidebar meeting={meeting} />
        </div>
      </div>
    </div>
  );
}

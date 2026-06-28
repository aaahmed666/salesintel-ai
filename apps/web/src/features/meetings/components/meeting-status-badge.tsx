'use client';

import { useTranslations } from 'next-intl';
import { MEETING_STATUS_META } from '@salesintel/config';
import type { MeetingStatus } from '@salesintel/types';
import { Badge } from '@salesintel/ui';
import { Icon } from '@/features/shell';

/** Renders a localized, color-coded chip for a processing status. */
export function MeetingStatusBadge({
  status,
  animated = true,
}: {
  status: MeetingStatus;
  animated?: boolean;
}) {
  const t = useTranslations('meetings.status');
  const meta = MEETING_STATUS_META[status];
  const spinning = animated && (status === 'processing' || status === 'transcribing');

  return (
    <Badge tone={meta.tone} className="gap-1.5">
      <Icon name={meta.icon} size={14} className={spinning ? 'animate-spin' : undefined} />
      {t(status)}
    </Badge>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import type { MeetingDetail } from '@salesintel/types';
import { Icon } from '@/features/shell';

/** AI executive summary block with topic tags (Overview tab, left column). */
export function ExecutiveSummary({ meeting }: { meeting: MeetingDetail }) {
  const t = useTranslations('meetings.details');

  return (
    <div>
      <h3 className="text-body-lg text-on-surface mb-2 inline-flex items-center gap-2 font-semibold">
        <Icon name="auto_awesome" size={20} className="text-primary" />
        {t('aiSummary')}
      </h3>
      <p className="text-body-md text-on-surface-variant leading-relaxed">{meeting.summary}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {meeting.summaryTags.map((tag) => (
          <span
            key={tag}
            className="bg-surface-container-high text-label-sm text-on-surface-variant rounded-full px-2.5 py-0.5 font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useLocale, useTranslations } from 'next-intl';
import type { MeetingDetail } from '@salesintel/types';
import { Button, Card, Separator } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import { formatCurrency } from '../hooks';
import { RepCell } from './rep-cell';

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-body-sm text-on-surface-variant">{label}</span>
      <span className="text-body-sm text-on-surface font-medium">{children}</span>
    </div>
  );
}

/** Right rail: metadata, AI next steps and stakeholders, plus the CRM sync pill. */
export function MeetingMetaSidebar({ meeting }: { meeting: MeetingDetail }) {
  const t = useTranslations('meetings.details');
  const locale = useLocale();
  const stakeholders = meeting.participants.filter((p) => p.side === 'external');

  return (
    <aside className="gap-lg flex flex-col">
      <section>
        <h2 className="text-label-sm text-on-surface-variant mb-1 uppercase tracking-wide">
          {t('metadata')}
        </h2>
        <div className="divide-outline-variant divide-y">
          <MetaRow label={t('status')}>
            <span className="bg-primary text-label-sm text-on-primary rounded-full px-2.5 py-0.5">
              {t('discoveryCall')}
            </span>
          </MetaRow>
          <MetaRow label={t('recording')}>
            <span className="inline-flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${
                  meeting.recordingAvailable ? 'bg-error' : 'bg-on-surface-variant'
                }`}
              />
              {meeting.recordingAvailable ? t('available') : t('unavailable')}
            </span>
          </MetaRow>
          <MetaRow label={t('participants')}>
            {t('members', { count: meeting.participants.length })}
          </MetaRow>
          {meeting.dealValue !== undefined ? (
            <MetaRow label={t('dealSize')}>{formatCurrency(meeting.dealValue, locale)}</MetaRow>
          ) : null}
        </div>
      </section>

      <Card className="p-md">
        <h3 className="text-body-md text-on-surface mb-2 inline-flex items-center gap-2 font-semibold">
          <Icon name="task_alt" size={18} className="text-primary" />
          {t('nextSteps')}
        </h3>
        <ul className="space-y-2">
          {meeting.nextSteps.map((step) => (
            <li key={step.id} className="text-body-sm flex items-start gap-2">
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                  step.done ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant'
                }`}
              >
                {step.done ? <Icon name="check" size={12} /> : null}
              </span>
              <span
                className={step.done ? 'text-on-surface-variant line-through' : 'text-on-surface'}
              >
                {step.label}
              </span>
            </li>
          ))}
        </ul>
        <Separator className="my-3" />
        <Button type="button" variant="secondary" size="sm" fullWidth>
          {t('createTasks')}
        </Button>
      </Card>

      <section>
        <h2 className="text-label-sm text-on-surface-variant mb-2 uppercase tracking-wide">
          {t('stakeholders')}
        </h2>
        <ul className="space-y-3">
          {stakeholders.map((person) => (
            <li key={person.id} className="flex items-center justify-between">
              <RepCell rep={{ id: person.id, name: person.name }} />
              <span className="text-body-sm text-on-surface-variant">{person.title}</span>
            </li>
          ))}
        </ul>
      </section>

      {meeting.crmProvider ? (
        <div className="border-outline-variant bg-surface-container-low/60 px-md flex items-center justify-between rounded-lg border py-2.5">
          <span className="text-body-sm text-on-surface-variant inline-flex items-center gap-2">
            <Icon name="cloud_sync" size={18} className="text-primary" />
            {t('syncedWith', { provider: meeting.crmProvider })}
          </span>
          <Icon name="autorenew" size={16} className="text-on-surface-variant" />
        </div>
      ) : null}
    </aside>
  );
}

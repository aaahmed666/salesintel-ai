'use client';

import { useTranslations } from 'next-intl';
import { Badge, Card } from '@salesintel/ui';
import { Icon } from '@/features/shell';

interface Integration {
  name: string;
  icon: string;
  status: 'connected' | 'syncing' | 'disconnected';
}

const INTEGRATIONS: Integration[] = [
  { name: 'Zoom Video', icon: 'videocam', status: 'syncing' },
  { name: 'MS Teams', icon: 'groups', status: 'disconnected' },
];

const STATUS_TONE = {
  connected: 'success',
  syncing: 'info',
  disconnected: 'neutral',
} as const;

/** "Connected Sources" row from the design — illustrative integration tiles. */
export function IntegrationCards() {
  const t = useTranslations('meetings.upload');

  return (
    <section>
      <h2 className="font-display text-headline-md text-on-surface">Connected Sources</h2>
      <div className="mt-md gap-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {INTEGRATIONS.map((it) => (
          <Card key={it.name} className="py-lg flex flex-col items-center gap-2 text-center">
            <span className="bg-surface-container-high text-on-surface-variant flex h-12 w-12 items-center justify-center rounded-lg">
              <Icon name={it.icon} size={26} />
            </span>
            <span className="text-body-sm text-on-surface font-semibold">{it.name}</span>
            <Badge tone={STATUS_TONE[it.status]} className="uppercase">
              {it.status}
            </Badge>
          </Card>
        ))}
        <button
          type="button"
          className="border-outline-variant py-lg text-on-surface-variant hover:border-primary/50 hover:text-primary flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors"
        >
          <Icon name="add_circle" size={28} />
          <span className="text-body-sm font-semibold">Add New Integration</span>
        </button>
      </div>
      <p className="sr-only">{t('gdpr')}</p>
    </section>
  );
}

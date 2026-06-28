import { Card, cn } from '@salesintel/ui';
import { Icon } from './icon';

export interface StatCardItem {
  key: string;
  label: string;
  value: string;
  icon: string;
  change?: string;
  tone?: 'up' | 'down' | 'flat';
  hint?: string;
}

const toneClass = (tone?: string) =>
  tone === 'up'
    ? 'bg-green-50 text-green-700'
    : tone === 'down'
      ? 'bg-error-container/15 text-error'
      : 'bg-surface-container text-on-surface-variant';

/** KPI summary strip shown at the top of directory screens (design parity). */
export function StatCards({ items }: { items: StatCardItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.key} className="p-lg">
          <div className="mb-md flex items-center justify-between">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary">
              <Icon name={item.icon} size={20} />
            </span>
            {item.change && (
              <span className={cn('rounded-full px-sm py-0.5 text-label-sm font-bold', toneClass(item.tone))}>
                {item.change}
              </span>
            )}
          </div>
          <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">{item.label}</p>
          <h3 className="mt-1 font-display text-headline-md font-black text-on-surface">{item.value}</h3>
          {item.hint && <p className="mt-base text-body-sm text-on-surface-variant">{item.hint}</p>}
        </Card>
      ))}
    </div>
  );
}

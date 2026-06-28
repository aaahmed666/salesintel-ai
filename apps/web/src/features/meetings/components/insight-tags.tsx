'use client';

import { cn } from '@salesintel/ui';

/** Map well-known insight labels to a tone so risk vs. opportunity reads fast. */
function toneFor(label: string): string {
  const risk = /risk|blocker|competitor|objection|budget/i;
  const win = /ready|sign|high intent|decision maker|champion|upsell/i;
  if (risk.test(label)) return 'bg-error-container/60 text-on-error-container';
  if (win.test(label)) return 'bg-primary-container/15 text-primary';
  return 'bg-secondary-container/15 text-secondary';
}

/** Renders the stacked AI insight chips shown in the directory's last column. */
export function InsightTags({ insights }: { insights: string[] }) {
  if (insights.length === 0) {
    return <span className="text-body-sm text-on-surface-variant">—</span>;
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      {insights.map((label) => (
        <span
          key={label}
          className={cn(
            'text-label-sm inline-flex rounded-md px-2 py-0.5 font-medium',
            toneFor(label),
          )}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

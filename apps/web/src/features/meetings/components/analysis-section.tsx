'use client';

import type { ReactNode } from 'react';
import { Card } from '@salesintel/ui';
import { Icon } from '@/features/shell';

interface AnalysisSectionProps {
  id?: string;
  icon: string;
  title: string;
  /** Short AI summary shown under the title. */
  summary?: string;
  /** Optional element rendered on the right of the header (e.g. a score). */
  aside?: ReactNode;
  children: ReactNode;
}

/** Consistent titled container for each deep-dive analysis section. */
export function AnalysisSection({
  id,
  icon,
  title,
  summary,
  aside,
  children,
}: AnalysisSectionProps) {
  return (
    <Card id={id} className="scroll-mt-24">
      <div className="mb-md flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="bg-primary-fixed text-primary flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg">
            <Icon name={icon} size={20} />
          </span>
          <div>
            <h2 className="text-body-lg text-on-surface font-semibold">{title}</h2>
            {summary ? (
              <p className="text-body-sm text-on-surface-variant mt-1 max-w-2xl">{summary}</p>
            ) : null}
          </div>
        </div>
        {aside ? <div className="flex-shrink-0">{aside}</div> : null}
      </div>
      {children}
    </Card>
  );
}

'use client';

import { type ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@salesintel/ui';
import { Icon } from '@/features/shell';

interface PipelineSearchProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/** Search input matching the design's rounded pill search bar with debounced input. */
export function PipelineSearch({ value, onChange, className }: PipelineSearchProps) {
  const t = useTranslations('pipeline.toolbar');

  return (
    <div className={cn('group relative', className)}>
      <Icon
        name="search"
        size={20}
        className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
      />
      <input
        type="text"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={t('search')}
        className={cn(
          'w-64 rounded-full border-none bg-surface-container-low ps-10 pe-4 py-1.5',
          'font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant/60',
          'transition-all focus:ring-2 focus:ring-primary/20 group-hover:w-80',
        )}
      />
    </div>
  );
}

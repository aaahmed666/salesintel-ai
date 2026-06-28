'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@salesintel/ui';
import type { DealTemperature } from '@salesintel/types';

const TEMP_STYLES: Record<DealTemperature, { bg: string; text: string }> = {
  hot:  { bg: 'bg-red-100',    text: 'text-red-700' },
  warm: { bg: 'bg-orange-100', text: 'text-orange-700' },
  cold: { bg: 'bg-blue-100',   text: 'text-blue-700' },
};

interface TemperatureBadgeProps {
  temperature: DealTemperature;
  className?: string;
}

/** Temperature indicator pill: Hot (red), Warm (orange), Cold (blue). */
export function TemperatureBadge({ temperature, className }: TemperatureBadgeProps) {
  const t = useTranslations('pipeline.temperature');
  const styles = TEMP_STYLES[temperature];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight',
        styles.bg, styles.text,
        className,
      )}
    >
      {t(temperature as never)}
    </span>
  );
}

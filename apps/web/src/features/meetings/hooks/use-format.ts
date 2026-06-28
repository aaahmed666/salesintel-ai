'use client';

/** Human-readable byte size, e.g. 124 MB. */
export function formatBytes(bytes: number, locale?: string): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / 1024 ** i;
  const fmt = new Intl.NumberFormat(locale, { maximumFractionDigits: value < 10 ? 1 : 0 });
  return `${fmt.format(value)} ${units[i]}`;
}

/** Relative time like "2h ago" / "just now" (coarse, dependency-free). */
export function formatRelative(iso: string, locale?: string): string {
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const mins = Math.round(diffMs / 60000);
  if (Math.abs(mins) < 60) return rtf.format(-mins, 'minute');
  const hours = Math.round(mins / 60);
  if (Math.abs(hours) < 24) return rtf.format(-hours, 'hour');
  const days = Math.round(hours / 24);
  return rtf.format(-days, 'day');
}

/** Localized date + time, e.g. "Oct 24, 2023 · 10:30 AM". */
export function formatDateTime(iso: string, locale?: string): string {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
  const time = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);
  return `${date} · ${time}`;
}

/** Compact meeting duration, e.g. "24m 12s" or "1h 03m". */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

/** Localized currency for deal values, e.g. "$240,000". */
export function formatCurrency(value: number, locale?: string, currency = 'USD'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

/** mm:ss timestamp for transcript / timeline axes. */
export function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

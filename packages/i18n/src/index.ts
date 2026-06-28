import { DEFAULT_LOCALE, LOCALES, RTL_LOCALES } from '@salesintel/config';
import type { Direction, Locale } from '@salesintel/types';

export const locales = LOCALES;
export const defaultLocale = DEFAULT_LOCALE;

export type { Locale, Direction };

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Resolve the text direction for a given locale. */
export function getDirection(locale: Locale): Direction {
  return RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';
}

/** Lazily import the message catalog for a locale (used by next-intl). */
export async function loadMessages(locale: Locale): Promise<Messages> {
  switch (locale) {
    case 'ar':
      return (await import('./messages/ar.json')).default as Messages;
    case 'en':
    default:
      return (await import('./messages/en.json')).default;
  }
}

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
export type Messages = typeof import('./messages/en.json');

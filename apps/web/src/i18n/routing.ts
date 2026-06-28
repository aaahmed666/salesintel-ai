import { defineRouting } from 'next-intl/routing';
import { defaultLocale, locales } from '@salesintel/i18n';

/**
 * Locale routing config. Locales are always prefixed in the URL (e.g. /en/login,
 * /ar/login) so language is shareable and SSR-safe.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

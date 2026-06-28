import { getRequestConfig } from 'next-intl/server';
import { isLocale, loadMessages } from '@salesintel/i18n';
import { routing } from './routing';

/**
 * Per-request next-intl config. Resolves the active locale, falls back to the
 * default when unknown, and loads the matching message catalog.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested && isLocale(requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
  };
});

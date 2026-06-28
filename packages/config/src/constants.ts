import type { Locale } from '@salesintel/types';

/** Application identity. */
export const APP_NAME = 'SalesForce AI';
export const APP_TAGLINE = 'Enterprise Sales Intelligence Platform';

/* ------------------------------ i18n / locale ---------------------------- */

export const LOCALES = ['en', 'ar'] as const;
export const DEFAULT_LOCALE: Locale = 'en';

/** Locales that render right-to-left. */
export const RTL_LOCALES: readonly Locale[] = ['ar'];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
};

/* ------------------------------- Auth rules ------------------------------ */

export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;
export const FULL_NAME_MIN_LENGTH = 2;
export const FULL_NAME_MAX_LENGTH = 80;
export const TWO_FACTOR_CODE_LENGTH = 6;

/** Seconds the user must wait before requesting another 2FA / reset code. */
export const RESEND_COOLDOWN_SECONDS = 30;

/* ------------------------------ Storage keys ----------------------------- */

export const STORAGE_KEYS = {
  session: 'salesintel.session',
  locale: 'salesintel.locale',
  theme: 'salesintel.theme',
} as const;

/* ----------------------------- Query timings ----------------------------- */

export const QUERY_STALE_TIME = 60 * 1000; // 1 minute
export const QUERY_GC_TIME = 5 * 60 * 1000; // 5 minutes
export const DEFAULT_QUERY_RETRY = 1;

/* -------------------------- API error code map --------------------------- */

export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_TAKEN: 'EMAIL_TAKEN',
  EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
  INVALID_TOKEN: 'INVALID_TOKEN',
  EXPIRED_TOKEN: 'EXPIRED_TOKEN',
  INVALID_2FA_CODE: 'INVALID_2FA_CODE',
  RATE_LIMITED: 'RATE_LIMITED',
  UNKNOWN: 'UNKNOWN',
} as const;

export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

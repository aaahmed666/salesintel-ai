/**
 * Shared primitive and envelope types used across the platform.
 */

export type ID = string;

export type ISODateString = string;

/** Supported application locales. */
export type Locale = 'en' | 'ar';

/** Text direction derived from the active locale. */
export type Direction = 'ltr' | 'rtl';

/** Generic, discriminated request status used by UI state machines. */
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

/** Standard success envelope returned by the API layer. */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

/** Standard error shape surfaced to the UI. */
export interface ApiError {
  /** Machine-readable error code, e.g. INVALID_CREDENTIALS. */
  code: string;
  /** Human-readable message (already localized when possible). */
  message: string;
  /** Optional field-level validation errors keyed by form field. */
  fieldErrors?: Record<string, string>;
  /** HTTP-like status for logging/branching. */
  status?: number;
}

/** Paginated list envelope. */
export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

import type { ID, ISODateString } from './common';
import type { UserRole } from './auth';

/* ------------------------------ Navigation ------------------------------- */

/**
 * A single primary navigation entry. `route` is locale-agnostic (the active
 * locale is prepended by the i18n Link helpers). `icon` is a Material Symbols
 * ligature name so the design's iconography renders 1:1.
 */
export interface NavItem {
  /** Stable key used for i18n labels and active-state matching. */
  key: string;
  /** Locale-agnostic destination, e.g. `/dashboard`. */
  route: string;
  /** Material Symbols Outlined ligature, e.g. `insights`. */
  icon: string;
  /** Roles allowed to see this entry. Empty = visible to all roles. */
  roles?: UserRole[];
  /** Optional unread/count badge surfaced next to the label. */
  badgeKey?: string;
}

/* ----------------------------- Organizations ----------------------------- */

export type OrgPlan = 'starter' | 'growth' | 'enterprise';

export interface Organization {
  id: ID;
  name: string;
  /** Short label rendered in the avatar chip, e.g. `AC`. */
  initials: string;
  plan: OrgPlan;
  /** Optional logo; falls back to `initials` when absent. */
  logoUrl?: string;
}

/* ----------------------------- Notifications ----------------------------- */

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface AppNotification {
  id: ID;
  type: NotificationType;
  /** i18n key OR raw title; mock data uses raw strings for both locales. */
  title: string;
  body: string;
  /** Material Symbols ligature shown in the row. */
  icon: string;
  read: boolean;
  createdAt: ISODateString;
  /** Optional deep link (locale-agnostic). */
  href?: string;
}

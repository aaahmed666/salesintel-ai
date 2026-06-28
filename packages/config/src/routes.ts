/**
 * Centralized, locale-agnostic route map. Components prepend the active locale
 * via the i18n navigation helpers, so paths here never include the locale.
 */
export const ROUTES = {
  home: '/',
  auth: {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    verifyEmail: '/verify-email',
    twoFactor: '/two-factor',
  },
  dashboard: {
    root: '/dashboard',
    rep: '/dashboard/representative',
    manager: '/dashboard/manager',
    executive: '/dashboard/executive',
  },
  workflows: { root: '/workflows' },

  meetings: {
    root: '/meetings',
    upload: '/upload',
    detail: (id: string) => `/meetings/${id}`,
    transcript: (id: string) => `/meetings/${id}/transcript`,
    deepDive: (id: string) => `/meetings/${id}/analysis`,
    scoring: (id: string) => `/meetings/${id}/scoring`,
  },
  leads: { root: '/leads' },
  pipelines: {
    root: '/pipelines',
    board: '/pipelines/board',
    detail: (id: string) => `/pipelines/${id}`,
    escalations: '/pipelines/escalations',
  },

  activity: { root: '/activity' },

  companies: { root: '/companies' },
  contacts: { root: '/contacts' },
  integrations: { root: '/integrations' },
  developer: { root: '/developer' },
  aiSettings: { root: '/ai-settings' },
  users: { root: '/users' },
  billing: { root: '/billing' },
  auditLogs: { root: '/audit-logs' },
  adminSettings: { root: '/admin-settings' },

  analytics: { root: '/analytics' },
  settings: { root: '/settings' },
} as const;

export type AppRoute = string;

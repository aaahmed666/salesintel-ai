/**
 * Centralized, type-safe query/mutation keys. Co-locating these prevents the
 * stringly-typed drift that breaks cache invalidation across features.
 */
export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },
  shell: {
    all: ['shell'] as const,
    organizations: () => [...queryKeys.shell.all, 'organizations'] as const,
    notifications: () => [...queryKeys.shell.all, 'notifications'] as const,
  },
  meetings: {
    all: ['meetings'] as const,
    list: () => [...queryKeys.meetings.all, 'list'] as const,
    directory: (params: unknown) => [...queryKeys.meetings.all, 'directory', params] as const,
    detail: (id: string) => [...queryKeys.meetings.all, 'detail', id] as const,
    deepDive: (id: string) => [...queryKeys.meetings.all, 'deep-dive', id] as const,
  },
  scoring: {
    all: ['scoring'] as const,
    detail: (meetingId: string) => [...queryKeys.scoring.all, 'detail', meetingId] as const,
  },
  pipeline: {
    all: ['pipeline'] as const,
    list: (filters?: unknown) => [...queryKeys.pipeline.all, 'list', filters] as const,
  },
  deals: {
    all: ['deals'] as const,
    detail: (id: string) => [...queryKeys.deals.all, 'detail', id] as const,
  },
  risks: {
    all: ['risks'] as const,
    list: (filters?: unknown) => [...queryKeys.risks.all, 'list', filters] as const,
    rules: () => [...queryKeys.risks.all, 'rules'] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    rep: () => [...queryKeys.dashboard.all, 'rep'] as const,
    manager: () => [...queryKeys.dashboard.all, 'manager'] as const,
    executive: () => [...queryKeys.dashboard.all, 'executive'] as const,
  },
  workflows: {
    all: ['workflows'] as const,
    list: () => [...queryKeys.workflows.all, 'list'] as const,
  },
  integrations: {
    all: ['integrations'] as const,
    list: () => [...queryKeys.integrations.all, 'list'] as const,
  },
  developer: {
    all: ['developer'] as const,
    keys: () => [...queryKeys.developer.all, 'keys'] as const,
    webhooks: () => [...queryKeys.developer.all, 'webhooks'] as const,
    logs: () => [...queryKeys.developer.all, 'logs'] as const,
  },
  aiSettings: {
    all: ['aiSettings'] as const,
    providers: () => [...queryKeys.aiSettings.all, 'providers'] as const,
    health: () => [...queryKeys.aiSettings.all, 'health'] as const,
  },
  companies: {
    all: ['companies'] as const,
    list: () => [...queryKeys.companies.all, 'list'] as const,
  },
  contacts: {
    all: ['contacts'] as const,
    list: () => [...queryKeys.contacts.all, 'list'] as const,
  },
  users: {
    all: ['users'] as const,
    list: () => [...queryKeys.users.all, 'list'] as const,
  },
  billing: {
    all: ['billing'] as const,
    invoices: () => [...queryKeys.billing.all, 'invoices'] as const,
    metrics: () => [...queryKeys.billing.all, 'metrics'] as const,
  },
  auditLogs: {
    all: ['auditLogs'] as const,
    list: () => [...queryKeys.auditLogs.all, 'list'] as const,
  },
  adminSettings: {
    all: ['adminSettings'] as const,
    settings: () => [...queryKeys.adminSettings.all, 'settings'] as const,
  },
} as const;

export const mutationKeys = {
  auth: {
    login: ['auth', 'login'] as const,
    register: ['auth', 'register'] as const,
    forgotPassword: ['auth', 'forgot-password'] as const,
    resetPassword: ['auth', 'reset-password'] as const,
    verifyEmail: ['auth', 'verify-email'] as const,
    twoFactor: ['auth', 'two-factor'] as const,
    resend2fa: ['auth', 'resend-2fa'] as const,
    logout: ['auth', 'logout'] as const,
    googleStart: ['auth', 'google-start'] as const,
    googleCallback: ['auth', 'google-callback'] as const,
    createInvite: ['auth', 'create-invite'] as const,
  },
  shell: {
    markRead: ['shell', 'notifications', 'mark-read'] as const,
    markAllRead: ['shell', 'notifications', 'mark-all-read'] as const,
  },
  meetings: {
    createUpload: ['meetings', 'create-upload'] as const,
    retry: ['meetings', 'retry'] as const,
  },
  deals: {
    updateTask: ['deals', 'update-task'] as const,
    addTask: ['deals', 'add-task'] as const,
    addNote: ['deals', 'add-note'] as const,
  },
  risks: {
    updateStatus: ['risks', 'update-status'] as const,
    toggleRule: ['risks', 'toggle-rule'] as const,
    createRule: ['risks', 'create-rule'] as const,
  },
  workflows: {
    update: ['workflows', 'update'] as const,
    create: ['workflows', 'create'] as const,
  },
  integrations: {
    connect: ['integrations', 'connect'] as const,
    disconnect: ['integrations', 'disconnect'] as const,
    updateSettings: ['integrations', 'update-settings'] as const,
  },
  developer: {
    createKey: ['developer', 'create-key'] as const,
    revokeKey: ['developer', 'revoke-key'] as const,
    createWebhook: ['developer', 'create-webhook'] as const,
    editWebhook: ['developer', 'edit-webhook'] as const,
    deleteWebhook: ['developer', 'delete-webhook'] as const,
    retryWebhook: ['developer', 'retry-webhook'] as const,
  },
  aiSettings: {
    updateModel: ['aiSettings', 'update-model'] as const,
    toggleProvider: ['aiSettings', 'toggle-provider'] as const,
  },
  companies: {
    create: ['companies', 'create'] as const,
    update: ['companies', 'update'] as const,
  },
  contacts: {
    addNote: ['contacts', 'add-note'] as const,
    updateStatus: ['contacts', 'update-status'] as const,
  },
  users: {
    create: ['users', 'create'] as const,
    update: ['users', 'update'] as const,
    deactivate: ['users', 'deactivate'] as const,
  },
  adminSettings: {
    update: ['adminSettings', 'update'] as const,
  },
} as const;




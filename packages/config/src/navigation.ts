import type { NavItem, UserRole } from '@salesintel/types';
import { ROUTES } from './routes';

/**
 * Primary sidebar navigation, mirroring the design's order and Material Symbols
 * iconography. `roles` gates visibility; an absent/empty list means every role
 * sees the item. The shell filters this list against the signed-in user.
 */
export const PRIMARY_NAV: readonly NavItem[] = [
  { key: 'intelligence', route: ROUTES.dashboard.root, icon: 'insights' },
  { key: 'pipelines', route: ROUTES.pipelines.root, icon: 'view_kanban' },
  { key: 'companies', route: ROUTES.companies.root, icon: 'corporate_fare' },
  { key: 'contacts', route: ROUTES.contacts.root, icon: 'contacts' },
  { key: 'meetings', route: ROUTES.meetings.root, icon: 'format_list_bulleted' },
  { key: 'upload', route: ROUTES.meetings.upload, icon: 'upload_file' },
  { key: 'integrations', route: ROUTES.integrations.root, icon: 'extension' },
  {
    key: 'users',
    route: ROUTES.users.root,
    icon: 'manage_accounts',
    roles: ['manager', 'admin'],
  },
  {
    key: 'billing',
    route: ROUTES.billing.root,
    icon: 'credit_card',
  },
  {
    key: 'auditLogs',
    route: ROUTES.auditLogs.root,
    icon: 'receipt_long',
    roles: ['admin'],
  },
  {
    key: 'adminSettings',
    route: ROUTES.adminSettings.root,
    icon: 'tune',
    roles: ['admin'],
  },
  {
    key: 'workflows',
    route: ROUTES.workflows.root,
    icon: 'account_tree',
    roles: ['manager', 'admin'],
  },
  {
    key: 'developer',
    route: ROUTES.developer.root,
    icon: 'code',
    roles: ['manager', 'admin'],
  },
  {
    key: 'aiSettings',
    route: ROUTES.aiSettings.root,
    icon: 'settings_suggest',
    roles: ['manager', 'admin'],
  },
  {
    key: 'analytics',
    route: ROUTES.analytics.root,
    icon: 'bar_chart',
    roles: ['manager', 'admin'],
  },
] as const;

/** Display order + label keys for the role badge in the user menu. */
export const ROLE_LABEL_KEYS: Record<UserRole, string> = {
  sales_rep: 'roles.representative',
  manager: 'roles.manager',
  admin: 'roles.admin',
};

/**
 * Coarse role ranking used for simple "at least this role" checks in the UI.
 * Higher number = more privilege.
 */
export const ROLE_RANK: Record<UserRole, number> = {
  sales_rep: 1,
  manager: 2,
  admin: 3,
};

/** Filter a nav list down to the entries a given role may see. */
export function navForRole(items: readonly NavItem[], role: UserRole): NavItem[] {
  return items.filter(
    (item) => !item.roles || item.roles.length === 0 || item.roles.includes(role),
  );
}

/**
 * Resolve the role restriction for a locale-stripped pathname by matching it
 * against the most specific (longest) nav route prefix. Returns `undefined`
 * when the route carries no restriction (every role may enter). Used by the
 * route guard so deep-linking a restricted page is blocked, not just hidden.
 */
export function requiredRolesForPath(
  path: string,
  items: readonly NavItem[] = PRIMARY_NAV,
): readonly UserRole[] | undefined {
  const match = items
    .filter((item) => path === item.route || path.startsWith(`${item.route}/`))
    .sort((a, b) => b.route.length - a.route.length)[0];
  if (!match || !match.roles || match.roles.length === 0) return undefined;
  return match.roles;
}

/** Whether a role is permitted to view a given locale-stripped path. */
export function canAccessPath(path: string, role: UserRole): boolean {
  const roles = requiredRolesForPath(path);
  return !roles || roles.includes(role);
}

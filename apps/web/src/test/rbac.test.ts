import { describe, it, expect } from 'vitest';
import { canAccessPath, requiredRolesForPath, navForRole, PRIMARY_NAV } from '@salesintel/config';

describe('Role-based access control', () => {
  it('leaves unrestricted routes open to every role', () => {
    expect(canAccessPath('/dashboard', 'sales_rep')).toBe(true);
    expect(canAccessPath('/pipelines', 'sales_rep')).toBe(true);
    expect(canAccessPath('/meetings', 'sales_rep')).toBe(true);
    expect(requiredRolesForPath('/dashboard')).toBeUndefined();
  });

  it('blocks restricted routes for insufficient roles', () => {
    expect(canAccessPath('/admin-settings', 'sales_rep')).toBe(false);
    expect(canAccessPath('/audit-logs', 'sales_rep')).toBe(false);
    expect(canAccessPath('/users', 'sales_rep')).toBe(false);
    expect(canAccessPath('/workflows', 'sales_rep')).toBe(false);
  });

  it('permits restricted routes for sufficient roles', () => {
    expect(canAccessPath('/admin-settings', 'admin')).toBe(true);
    expect(canAccessPath('/audit-logs', 'admin')).toBe(true);
    expect(canAccessPath('/users', 'manager')).toBe(true);
    expect(canAccessPath('/workflows', 'manager')).toBe(true);
  });

  it('protects nested paths via longest-prefix match', () => {
    expect(canAccessPath('/admin-settings/security', 'sales_rep')).toBe(false);
    expect(canAccessPath('/admin-settings/security', 'admin')).toBe(true);
  });

  it('hides restricted items from the sidebar for lower roles', () => {
    const repNav = navForRole(PRIMARY_NAV, 'sales_rep').map((i) => i.key);
    expect(repNav).not.toContain('adminSettings');
    expect(repNav).not.toContain('workflows');
    expect(repNav).toContain('pipelines');
  });
});

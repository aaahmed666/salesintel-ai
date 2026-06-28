import { describe, it, expect } from 'vitest';
import { ROUTES } from '@salesintel/config';

describe('Navigation Routes', () => {
  it('should define the correct paths for final admin/billing modules', () => {
    expect(ROUTES.users.root).toBe('/users');
    expect(ROUTES.billing.root).toBe('/billing');
    expect(ROUTES.auditLogs.root).toBe('/audit-logs');
    expect(ROUTES.adminSettings.root).toBe('/admin-settings');
  });
});

'use client';

import { useMemo } from 'react';
import { PRIMARY_NAV, navForRole } from '@salesintel/config';
import type { NavItem, UserRole } from '@salesintel/types';
import { usePathname } from '@/i18n/navigation';

/** Role-filtered primary navigation plus an `isActive` matcher. */
export function useNavigation(role: UserRole) {
  const pathname = usePathname();

  const items = useMemo<NavItem[]>(() => navForRole(PRIMARY_NAV, role), [role]);

  const isActive = (route: string): boolean => {
    if (route === '/dashboard') return pathname === route || pathname === '/';
    return pathname === route || pathname.startsWith(`${route}/`);
  };

  return { items, isActive };
}

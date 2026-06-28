'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { TooltipProvider } from '@salesintel/ui';
import { usePathname } from '@/i18n/navigation';
import { BreadcrumbBar, Header } from './header';
import { Sidebar } from './sidebar';
import { RoleGuard } from './role-guard';

/**
 * Authenticated application shell. Desktop renders a persistent sidebar; tablet
 * and mobile collapse it into an overlay drawer toggled from the header. The
 * drawer auto-closes on route change.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex">
          <Sidebar />
        </div>

        {/* Mobile / tablet drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"
            />
            <div className="absolute inset-y-0 start-0 animate-in slide-in-from-start">
              <Sidebar onNavigate={() => setDrawerOpen(false)} className="shadow-elevated" />
            </div>
          </div>
        )}

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Header onMenuClick={() => setDrawerOpen(true)} />
          <BreadcrumbBar />
          <main className="flex-1 overflow-y-auto">
            <RoleGuard>{children}</RoleGuard>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

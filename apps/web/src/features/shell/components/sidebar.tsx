'use client';

import { useTranslations } from 'next-intl';
import { ROUTES } from '@salesintel/config';
import { Button, cn } from '@salesintel/ui';
import { Link } from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';
import { useLogout } from '@/features/auth/queries';
import { useCurrentUser, useNavigation } from '../hooks';
import { BrandMark } from './brand-mark';
import { Icon } from './icon';

interface SidebarProps {
  /** Called when a nav item is chosen (used to close the mobile drawer). */
  onNavigate?: () => void;
  className?: string;
}

/**
 * Primary navigation rail. Renders the brand lockup, role-filtered nav, an
 * upgrade CTA, and help/logout. Shared by the desktop rail and mobile drawer.
 */
export function Sidebar({ onNavigate, className }: SidebarProps) {
  const t = useTranslations();
  const user = useCurrentUser();
  const { items, isActive } = useNavigation(user.role);
  const router = useRouter();
  const logout = useLogout();

  return (
    <aside
      className={cn(
        'flex h-full w-64 shrink-0 flex-col border-e border-outline-variant bg-surface-container-lowest',
        className,
      )}
    >
      <div className="px-lg py-lg">
        <BrandMark />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {items.map((item) => {
          const active = isActive(item.route);
          return (
            <Link
              key={item.key}
              href={item.route}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-md font-medium transition-colors',
                active
                  ? 'bg-primary-container/15 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface',
              )}
            >
              <Icon name={item.icon} size={22} filled={active} />
              <span>{t(`nav.${item.key}` as never)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 px-3 pb-lg pt-md">
        <Button variant="primary" fullWidth className="mb-md">
          {t('shell.upgrade')}
        </Button>
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            logout.mutate(undefined, { onSettled: () => router.replace(ROUTES.auth.login) });
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-body-md font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
        >
          <Icon name="logout" size={22} />
          {t('shell.logout')}
        </button>
      </div>
    </aside>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { Button, cn } from '@salesintel/ui';
import { Breadcrumbs } from './breadcrumbs';
import { Icon } from './icon';
import { NotificationMenu } from './notification-menu';
import { OrganizationSwitcher } from './organization-switcher';
import { ShellLanguageSwitcher } from './shell-language-switcher';
import { UserMenu } from './user-menu';

interface HeaderProps {
  /** Toggles the mobile navigation drawer. */
  onMenuClick: () => void;
  className?: string;
}

/** Top application bar: menu toggle, org switcher, search, actions, menus. */
export function Header({ onMenuClick, className }: HeaderProps) {
  const t = useTranslations('shell');

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-outline-variant bg-surface-container-lowest/95 px-md backdrop-blur lg:px-lg',
        className,
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        aria-label={t('toggleSidebar')}
        onClick={onMenuClick}
        className="h-10 w-10 rounded-full text-on-surface-variant lg:hidden"
      >
        <Icon name="menu" size={24} />
      </Button>

      <div className="hidden lg:block">
        <OrganizationSwitcher />
      </div>

      <div className="relative mx-2 hidden max-w-md flex-1 items-center md:flex">
        <Icon
          name="search"
          size={20}
          className="pointer-events-none absolute start-3 text-on-surface-variant"
        />
        <input
          type="search"
          placeholder={t('search')}
          className="h-10 w-full rounded-full border border-outline-variant bg-surface-container-low ps-10 pe-4 text-body-sm text-on-surface outline-none transition-shadow placeholder:text-on-surface-variant focus-visible:shadow-focus-ring"
        />
      </div>

      <div className="ms-auto flex items-center gap-1 sm:gap-2">
        <Button variant="gradient" size="sm" className="hidden sm:inline-flex">
          <Icon name="add" size={18} />
          {t('createLead')}
        </Button>
        <ShellLanguageSwitcher />
        <NotificationMenu />
        <span className="mx-1 hidden h-6 w-px bg-outline-variant sm:block" />
        <UserMenu />
      </div>
    </header>
  );
}

/** Secondary bar holding the breadcrumb trail (below the header). */
export function BreadcrumbBar() {
  return (
    <div className="flex h-11 items-center border-b border-outline-variant bg-background px-md lg:px-lg">
      <Breadcrumbs />
    </div>
  );
}

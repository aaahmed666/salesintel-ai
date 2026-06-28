'use client';

import { useTranslations } from 'next-intl';
import { ROLE_LABEL_KEYS } from '@salesintel/config';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@salesintel/ui';
import { useRouter } from '@/i18n/navigation';
import { ROUTES } from '@salesintel/config';
import { useLogout } from '@/features/auth/queries';
import { useCurrentUser } from '../hooks';
import { Icon } from './icon';

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/** Avatar trigger + dropdown with profile links and sign-out. */
export function UserMenu() {
  const t = useTranslations('shell.userMenu');
  const tRole = useTranslations();
  const user = useCurrentUser();
  const router = useRouter();
  const logout = useLogout();

  function handleSignOut() {
    logout.mutate(undefined, {
      onSettled: () => router.replace(ROUTES.auth.login),
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={user.fullName}
          className="rounded-full outline-none ring-offset-2 transition-shadow focus-visible:shadow-focus-ring"
        >
          <Avatar className="h-10 w-10 border border-outline-variant">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
            <AvatarFallback>{initials(user.fullName)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[15rem]">
        <DropdownMenuLabel className="flex flex-col gap-1 py-2">
          <span className="text-body-sm font-semibold text-on-surface">{user.fullName}</span>
          <span className="text-label-sm font-normal text-on-surface-variant">{user.email}</span>
          <Badge tone="info" className="mt-1 w-fit">
            {tRole(ROLE_LABEL_KEYS[user.role] as never)}
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Icon name="person" size={20} className="text-on-surface-variant" />
          {t('profile')}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon name="settings" size={20} className="text-on-surface-variant" />
          {t('settings')}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon name="credit_card" size={20} className="text-on-surface-variant" />
          {t('billing')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={handleSignOut}
          className="text-error focus:bg-error-container/40"
        >
          <Icon name="logout" size={20} />
          {t('signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { LOCALE_LABELS, LOCALES } from '@salesintel/config';
import type { Locale } from '@salesintel/types';
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@salesintel/ui';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Icon } from './icon';

/**
 * Header language switcher. Re-navigates to the same route under the chosen
 * locale, flipping LTR/RTL on the next render via the locale layout.
 */
export function ShellLanguageSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    startTransition(() => router.replace(pathname, { locale: next }));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('language')}
          className="h-10 w-10 rounded-full text-on-surface-variant"
        >
          <Icon name="language" size={22} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={isPending ? 'opacity-60' : undefined}>
        <DropdownMenuLabel>{t('language')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LOCALES.map((l) => (
          <DropdownMenuCheckboxItem key={l} checked={l === locale} onSelect={() => switchTo(l)}>
            {LOCALE_LABELS[l]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

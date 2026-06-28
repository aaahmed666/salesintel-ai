'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { Globe } from 'lucide-react';
import { LOCALE_LABELS, LOCALES } from '@salesintel/config';
import type { Locale } from '@salesintel/types';
import { cn } from '@salesintel/ui';
import { usePathname, useRouter } from '@/i18n/navigation';

/**
 * Runtime locale switch. Re-navigates to the same route under the chosen locale,
 * which flips `dir` (LTR/RTL) on the next render via the locale layout.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-outline-variant/60 bg-surface-container-lowest p-1',
        isPending && 'opacity-60',
        className,
      )}
    >
      <Globe className="ms-1 h-4 w-4 text-on-surface-variant" aria-hidden />
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-current={l === locale}
          className={cn(
            'rounded-full px-3 py-1 text-label-md font-medium transition-colors',
            l === locale
              ? 'bg-primary text-on-primary'
              : 'text-on-surface-variant hover:text-on-surface',
          )}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}

import type { ReactNode } from 'react';
import { GlassCard, cn } from '@salesintel/ui';
import { BrandLogo } from '@/features/auth/components';
import { LanguageSwitcher } from '@/features/auth/components';

interface CenteredAuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Use the plain glyph header (login) vs. icon-only variants. */
  icon?: ReactNode;
  cardClassName?: string;
}

/**
 * The centered single-column auth layout shared by login, forgot/reset password,
 * email verification and two-factor screens. The language switcher floats at the
 * inline-end so it works in both LTR and RTL.
 */
export function CenteredAuthShell({
  title,
  subtitle,
  children,
  footer,
  icon,
  cardClassName,
}: CenteredAuthShellProps) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-surface-container-low via-background to-surface-dim/40 px-md py-xl">
      <div className="absolute end-md top-md z-50">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md space-y-lg">
        <header className="flex flex-col items-center gap-md text-center">
          {icon ?? <BrandLogo />}
          <div className="space-y-1">
            <h1 className="font-display text-headline-lg text-on-surface">{title}</h1>
            {subtitle && (
              <p className="mx-auto max-w-sm text-body-md text-on-surface-variant">{subtitle}</p>
            )}
          </div>
        </header>

        <GlassCard className={cn('p-lg', cardClassName)}>{children}</GlassCard>

        {footer && <div className="text-center">{footer}</div>}
      </div>
    </main>
  );
}

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BarChart3, Sparkles, TrendingUp } from 'lucide-react';
import { APP_NAME } from '@salesintel/config';
import { ROUTES } from '@salesintel/config';
import { GlassCard } from '@salesintel/ui';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher, RegisterForm } from '@/features/auth/components';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.register');
  return { title: t('submit') };
}

export default async function RegisterPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('auth.register');
  const tc = await getTranslations('common');

  const features = [
    { icon: TrendingUp, key: 'predictive' as const },
    { icon: Sparkles, key: 'workflows' as const },
    { icon: BarChart3, key: 'analytics' as const },
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-inverse-surface text-inverse-on-surface">
      {/* Ambient mesh background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(107,56,212,0.35), transparent 45%), radial-gradient(circle at 80% 70%, rgba(70,72,212,0.35), transparent 45%)',
        }}
      />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-margin-page py-md">
        <span className="font-display text-headline-md font-bold text-inverse-on-surface">
          {APP_NAME}
        </span>
        <div className="flex items-center gap-md">
          <LanguageSwitcher />
          <span className="hidden text-body-md text-inverse-on-surface/80 sm:inline">
            {t('haveAccount')}
          </span>
          <Link href={ROUTES.auth.login} className="font-semibold text-inverse-primary hover:underline">
            {t('login')}
          </Link>
        </div>
      </header>

      {/* Body */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-md py-xl">
        <div className="grid w-full max-w-6xl items-center gap-xl lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
          {/* Form card */}
          <GlassCard className="mx-auto w-full max-w-md bg-white/90 text-on-surface">
            <div className="mb-lg space-y-2 text-center">
              <h1 className="font-display text-headline-lg text-on-surface">{t('title')}</h1>
              <p className="mx-auto max-w-sm text-body-md text-on-surface-variant">
                {t('subtitle')}
              </p>
            </div>
            <Suspense fallback={null}>
              <RegisterForm />
            </Suspense>
          </GlassCard>

          {/* Feature highlights */}
          <ul className="mx-auto hidden w-full max-w-md space-y-md lg:block">
            {features.map(({ icon: Icon, key }) => (
              <li
                key={key}
                className="flex items-start gap-md rounded-xl border border-white/15 bg-white/10 p-lg backdrop-blur-sm"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-inverse-primary/20 text-inverse-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="space-y-1">
                  <h3 className="font-display text-body-lg font-semibold text-inverse-on-surface">
                    {t(`features.${key}.title`)}
                  </h3>
                  <p className="text-body-sm text-inverse-on-surface/70">
                    {t(`features.${key}.desc`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex flex-col items-center justify-between gap-sm border-t border-white/10 px-margin-page py-md text-body-sm text-inverse-on-surface/60 sm:flex-row">
        <div className="flex items-center gap-lg">
          <a href="#" className="hover:text-inverse-on-surface">{t('footer.helpCenter')}</a>
          <a href="#" className="hover:text-inverse-on-surface">{t('footer.documentation')}</a>
          <a href="#" className="hover:text-inverse-on-surface">{t('footer.systemStatus')}</a>
        </div>
        <span>© {new Date().getFullYear()} {APP_NAME} Inc. {t('footer.rights')}</span>
      </footer>

      <span className="sr-only">{tc('appName')}</span>
    </div>
  );
}

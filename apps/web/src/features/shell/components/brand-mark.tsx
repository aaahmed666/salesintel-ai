import { useTranslations } from 'next-intl';
import { APP_NAME } from '@salesintel/config';
import { Icon } from './icon';

/** Sidebar brand lockup: gradient glyph + wordmark + tier caption. */
export function BrandMark({ collapsed = false }: { collapsed?: boolean }) {
  const t = useTranslations('shell');
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-gradient text-on-primary shadow-sm">
        <Icon name="monitoring" size={22} filled />
      </span>
      {!collapsed && (
        <span className="flex flex-col leading-tight">
          <span className="font-display text-body-lg font-bold text-primary">{APP_NAME}</span>
          <span className="text-label-sm font-medium text-on-surface-variant">{t('tier')}</span>
        </span>
      )}
    </div>
  );
}

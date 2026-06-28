'use client';

import { useTranslations } from 'next-intl';
import type { AppNotification, NotificationType } from '@salesintel/types';
import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Skeleton,
} from '@salesintel/ui';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadCount,
} from '../queries';
import { Icon } from './icon';

const TYPE_COLOR: Record<NotificationType, string> = {
  info: 'text-primary',
  success: 'text-success',
  warning: 'text-amber-600',
  error: 'text-error',
};

function NotificationRow({
  notification,
  onRead,
}: {
  notification: AppNotification;
  onRead: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onRead(notification.id)}
      className={cn(
        'flex w-full items-start gap-3 rounded-md p-2.5 text-start transition-colors hover:bg-surface-container-low',
        !notification.read && 'bg-primary-container/[0.06]',
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container-high',
          TYPE_COLOR[notification.type],
        )}
      >
        <Icon name={notification.icon} size={20} />
      </span>
      <span className="flex flex-1 flex-col gap-0.5">
        <span className="text-body-sm font-semibold text-on-surface">{notification.title}</span>
        <span className="line-clamp-2 text-label-md font-normal text-on-surface-variant">
          {notification.body}
        </span>
      </span>
      {!notification.read && (
        <span aria-hidden className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
      )}
    </button>
  );
}

/** Bell trigger with unread count + dropdown list. */
export function NotificationMenu() {
  const t = useTranslations('shell.notifications');
  const { data, isPending } = useNotifications();
  const unread = useUnreadCount();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('title')}
          className="relative h-10 w-10 rounded-full text-on-surface-variant"
        >
          <Icon name="notifications" size={22} />
          {unread > 0 && (
            <span className="absolute end-1.5 top-1.5 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold leading-none text-on-error">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[22rem] p-0">
        <div className="flex items-center justify-between border-b border-outline-variant px-3 py-2.5">
          <span className="text-body-sm font-semibold text-on-surface">{t('title')}</span>
          {unread > 0 && (
            <button
              type="button"
              onClick={() => markAll.mutate()}
              className="text-label-md font-medium text-primary hover:underline"
            >
              {t('markAllRead')}
            </button>
          )}
        </div>
        <div className="max-h-[24rem] overflow-y-auto p-1.5">
          {isPending ? (
            <div className="space-y-2 p-1.5">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : data && data.length > 0 ? (
            data.map((n) => (
              <NotificationRow key={n.id} notification={n} onRead={(id) => markRead.mutate(id)} />
            ))
          ) : (
            <p className="px-3 py-8 text-center text-body-sm text-on-surface-variant">
              {t('empty')}
            </p>
          )}
        </div>
        <div className="border-t border-outline-variant p-2">
          <button
            type="button"
            className="w-full rounded-md py-2 text-center text-label-md font-medium text-primary hover:bg-surface-container-low"
          >
            {t('viewActivity')}
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

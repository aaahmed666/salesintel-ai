'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, cn } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useSystemAdminSettings,
  useUpdateSystemAdminSettings,
} from '../queries';
import type { SystemAdminSettings } from '@salesintel/types';

const settingsSchema = z.object({
  orgName: z.string().min(2, 'Organization name must be at least 2 characters'),
  billingEmail: z.string().email('Invalid email address'),
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color'),
  accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color'),
  smtpHost: z.string().min(3, 'SMTP host is required'),
  smtpPort: z.coerce.number().min(1, 'SMTP port is required'),
  requireMfa: z.boolean(),
  passwordMinLength: z.coerce.number().min(8, 'Minimum length must be at least 8'),
  sessionTimeoutMinutes: z.coerce.number().min(5, 'Minimum timeout is 5 minutes'),
  emailAlerts: z.boolean(),
  slackAlerts: z.boolean(),
  webhookAlerts: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function AdminSettingsScreen() {
  const t = useTranslations('adminSettings');
  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'security' | 'notifications'>('general');

  // Queries
  const { data: settings, isLoading } = useSystemAdminSettings();
  const updateMutation = useUpdateSystemAdminSettings();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    values: settings
      ? {
          orgName: settings.org.name,
          billingEmail: settings.org.billingEmail,
          primaryColor: settings.branding.primaryColor,
          accentColor: settings.branding.accentColor,
          smtpHost: settings.email.smtpHost || '',
          smtpPort: settings.email.smtpPort || 587,
          requireMfa: settings.security.requireMfa,
          passwordMinLength: settings.security.passwordMinLength,
          sessionTimeoutMinutes: settings.security.sessionTimeoutMinutes,
          emailAlerts: settings.notifications.emailAlerts,
          slackAlerts: settings.notifications.slackAlerts,
          webhookAlerts: settings.notifications.webhookAlerts,
        }
      : undefined,
  });

  const onSubmit = (values: SettingsFormValues) => {
    updateMutation.mutate(
      {
        org: { name: values.orgName, billingEmail: values.billingEmail },
        branding: { primaryColor: values.primaryColor, accentColor: values.accentColor, companyName: settings?.branding.companyName || 'CloudScale' },
        email: { senderName: settings?.email.senderName || '', senderEmail: settings?.email.senderEmail || '', smtpHost: values.smtpHost, smtpPort: values.smtpPort },
        security: { requireMfa: values.requireMfa, passwordMinLength: values.passwordMinLength, sessionTimeoutMinutes: values.sessionTimeoutMinutes },
        notifications: { emailAlerts: values.emailAlerts, slackAlerts: values.slackAlerts, webhookAlerts: values.webhookAlerts },
      },
      {
        onSuccess: () => {
          setToastMessage(t('success'));
          setTimeout(() => setToastMessage(null), 3000);
        },
      }
    );
  };

  if (isLoading || !settings) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-md">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="font-label-md text-label-md text-on-surface-variant">Loading System Preferences...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: t('general'), icon: 'corporate_fare' },
    { id: 'branding', label: t('branding'), icon: 'palette' },
    { id: 'security', label: t('security'), icon: 'security' },
    { id: 'notifications', label: t('notifications'), icon: 'notifications' },
  ] as const;

  return (
    <div className="space-y-lg px-sm sm:px-md max-w-7xl mx-auto pb-xl">
      {/* Header Banner */}
      <div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-base font-bold">
          {t('pageTitle')}
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          {t('subtitle')}
        </p>
      </div>

      {toastMessage && (
        <div className="bg-green-500 text-white p-md rounded-xl font-label-md shadow-lg animate-fade-in flex items-center gap-xs">
          <Icon name="check_circle" size={20} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Settings Frame */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg items-start">
        
        {/* Sidebar Nav */}
        <div className="md:col-span-3 space-y-xs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'w-full text-start flex items-center gap-md px-md py-3 rounded-xl font-label-md text-label-md transition-all outline-none border',
                activeTab === tab.id
                  ? 'bg-primary-container/10 border-primary/20 text-primary font-bold shadow-sm'
                  : 'bg-transparent border-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              )}
            >
              <Icon name={tab.icon} size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Container (Right) */}
        <div className="md:col-span-9 glass-card rounded-2xl p-lg border border-outline-variant/60 bg-surface-container-lowest">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-lg">
            
            {/* Tab: General settings */}
            {activeTab === 'general' && (
              <div className="space-y-md">
                <h3 className="font-title-md text-title-md text-on-surface font-bold border-b border-outline-variant/30 pb-sm">{t('general')}</h3>
                <div className="space-y-sm">
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-xs">Organization Name</label>
                    <input
                      type="text"
                      {...register('orgName')}
                      className="w-full bg-surface-container text-body-sm rounded-xl border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary"
                    />
                    {errors.orgName && <p className="text-xs text-error mt-xs">{errors.orgName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-xs">Billing Contact Email</label>
                    <input
                      type="email"
                      {...register('billingEmail')}
                      className="w-full bg-surface-container text-body-sm rounded-xl border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary"
                    />
                    {errors.billingEmail && <p className="text-xs text-error mt-xs">{errors.billingEmail.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Branding settings */}
            {activeTab === 'branding' && (
              <div className="space-y-md">
                <h3 className="font-title-md text-title-md text-on-surface font-bold border-b border-outline-variant/30 pb-sm">{t('branding')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-xs">Primary Brand Color (Hex)</label>
                    <input
                      type="text"
                      {...register('primaryColor')}
                      className="w-full bg-surface-container text-body-sm rounded-xl border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                    {errors.primaryColor && <p className="text-xs text-error mt-xs">{errors.primaryColor.message}</p>}
                  </div>
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-xs">Accent Highlight Color (Hex)</label>
                    <input
                      type="text"
                      {...register('accentColor')}
                      className="w-full bg-surface-container text-body-sm rounded-xl border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                    {errors.accentColor && <p className="text-xs text-error mt-xs">{errors.accentColor.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-md">
                <h3 className="font-title-md text-title-md text-on-surface font-bold border-b border-outline-variant/30 pb-sm">{t('security')}</h3>
                <div className="space-y-md">
                  <label className="flex items-center gap-xs text-body-sm cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register('requireMfa')}
                      className="rounded text-primary focus:ring-primary border-outline-variant"
                    />
                    <span className="font-semibold text-on-surface">Require Multi-Factor Authentication (MFA)</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                    <div>
                      <label className="block text-label-sm text-on-surface-variant mb-xs">Password Minimum Characters</label>
                      <input
                        type="number"
                        {...register('passwordMinLength')}
                        className="w-full bg-surface-container text-body-sm rounded-xl border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary font-mono"
                      />
                      {errors.passwordMinLength && <p className="text-xs text-error mt-xs">{errors.passwordMinLength.message}</p>}
                    </div>
                    <div>
                      <label className="block text-label-sm text-on-surface-variant mb-xs">Inactive Session Timeout (Minutes)</label>
                      <input
                        type="number"
                        {...register('sessionTimeoutMinutes')}
                        className="w-full bg-surface-container text-body-sm rounded-xl border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary font-mono"
                      />
                      {errors.sessionTimeoutMinutes && <p className="text-xs text-error mt-xs">{errors.sessionTimeoutMinutes.message}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-md">
                <h3 className="font-title-md text-title-md text-on-surface font-bold border-b border-outline-variant/30 pb-sm">{t('notifications')}</h3>
                <div className="space-y-sm">
                  <label className="flex items-center gap-xs text-body-sm cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register('emailAlerts')}
                      className="rounded text-primary focus:ring-primary border-outline-variant"
                    />
                    <span>Receive Daily Digest Email Summaries</span>
                  </label>
                  <label className="flex items-center gap-xs text-body-sm cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register('slackAlerts')}
                      className="rounded text-primary focus:ring-primary border-outline-variant"
                    />
                    <span>Post Real-Time Objections in Slack Alerts Channel</span>
                  </label>
                  <label className="flex items-center gap-xs text-body-sm cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register('webhookAlerts')}
                      className="rounded text-primary focus:ring-primary border-outline-variant"
                    />
                    <span>Dispatch API webhooks on critical risk detection</span>
                  </label>
                </div>
              </div>
            )}

            {/* Action buttons footer */}
            <div className="flex gap-sm justify-end border-t border-outline-variant/30 pt-md mt-md">
              <Button type="button" variant="secondary" onClick={() => reset()} className="rounded-xl">
                {t('reset')}
              </Button>
              <Button type="submit" variant="primary" className="rounded-xl">
                {t('save')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

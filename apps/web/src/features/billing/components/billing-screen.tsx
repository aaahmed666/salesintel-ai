'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Button, cn } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useBillingInvoices, useBillingMetrics } from '../queries';
import type { BillingInvoice } from '@salesintel/types';

const columnHelper = createColumnHelper<BillingInvoice>();

export function BillingScreen() {
  const t = useTranslations('billing');

  const { data: invoices = [], isLoading: loadingInvoices } = useBillingInvoices();
  const { data: metrics, isLoading: loadingMetrics } = useBillingMetrics();

  const columns = useMemo(() => [
    columnHelper.accessor('id', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('invoices.id')}</span>,
      cell: (info) => <span className="font-mono text-xs text-on-surface">{info.getValue()}</span>,
    }),
    columnHelper.accessor('date', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('invoices.date')}</span>,
      cell: (info) => <span className="text-on-surface-variant text-body-sm">{new Date(info.getValue()).toLocaleDateString()}</span>,
    }),
    columnHelper.accessor('amount', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('invoices.amount')}</span>,
      cell: (info) => (
        <span className="font-mono font-bold text-on-surface">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(info.getValue())}
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('invoices.status')}</span>,
      cell: (info) => {
        const val = info.getValue();
        const color = val === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-error-container/10 text-error border-error/25';
        return (
          <span className={cn('px-xs py-0.5 rounded-full text-[10px] font-bold border capitalize', color)}>
            {val}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('invoices.action')}</span>,
      cell: () => (
        <button className="text-primary hover:underline text-xs font-semibold flex items-center gap-xs">
          <Icon name="download" size={16} />
          PDF
        </button>
      ),
    }),
  ], [t]);

  const table = useReactTable({
    data: invoices,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const plans = [
    { name: t('starter'), price: '$49', desc: 'Ideal for small sales teams to capture transcript scripts.', features: ['100 meetings / month', 'Basic Objection analysis', '5 team members seat limit', '25GB storage capacity'], active: false },
    { name: t('professional'), price: '$149', desc: 'Optimal for growing businesses with workflow building setups.', features: ['500 meetings / month', 'AI Insights & scoring rules', '15 team members seat limit', '100GB storage capacity'], active: false },
    { name: t('enterprise'), price: '$490', desc: 'Scale with unlimited pipeline reviews and API keys.', features: ['Unlimited meetings', 'Dedicated custom prompt templates', 'Unlimited members seats', '500GB storage capacity'], active: true },
  ];

  if (loadingInvoices || loadingMetrics || !metrics) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-md">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="font-label-md text-label-md text-on-surface-variant">Loading Subscription Plans...</p>
      </div>
    );
  }

  // Radial data for AI requests limit
  const radialData = [
    { name: 'Used', value: metrics.aiUsagePercent, fill: '#4648d4' },
    { name: 'Remaining', value: 100 - metrics.aiUsagePercent, fill: '#f1f5f9' },
  ];

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

      {/* Usage Analytics Dashboards Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        
        {/* Meetings processed */}
        <div className="glass-card rounded-2xl p-lg border border-outline-variant/60 bg-surface-container-lowest flex flex-col justify-between">
          <div className="flex justify-between items-start mb-sm">
            <span className="font-bold text-[10px] uppercase text-on-surface-variant tracking-wider">{t('metrics.meetings')}</span>
            <Icon name="groups" className="text-primary" size={20} />
          </div>
          <div className="space-y-xs">
            <h3 className="font-headline-lg text-headline-lg font-black text-on-surface">
              {metrics.meetingsProcessed} / {metrics.meetingsLimit}
            </h3>
            <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${(metrics.meetingsProcessed / metrics.meetingsLimit) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-on-surface-variant">Resets in 12 days</p>
          </div>
        </div>

        {/* AI Limit Usage */}
        <div className="glass-card rounded-2xl p-lg border border-outline-variant/60 bg-surface-container-lowest flex flex-col justify-between">
          <div className="flex justify-between items-start mb-sm">
            <span className="font-bold text-[10px] uppercase text-on-surface-variant tracking-wider">{t('metrics.aiTokens')}</span>
            <Icon name="auto_awesome" className="text-primary" size={20} />
          </div>
          <div className="space-y-xs">
            <h3 className="font-headline-lg text-headline-lg font-black text-on-surface">
              {metrics.aiUsagePercent}%
            </h3>
            <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.aiUsagePercent}%` }}
              />
            </div>
            <p className="text-[10px] text-on-surface-variant">Monthly allocation consumption</p>
          </div>
        </div>

        {/* Storage */}
        <div className="glass-card rounded-2xl p-lg border border-outline-variant/60 bg-surface-container-lowest flex flex-col justify-between">
          <div className="flex justify-between items-start mb-sm">
            <span className="font-bold text-[10px] uppercase text-on-surface-variant tracking-wider">{t('metrics.storage')}</span>
            <Icon name="folder" className="text-primary" size={20} />
          </div>
          <div className="space-y-xs">
            <h3 className="font-headline-lg text-headline-lg font-black text-on-surface">
              {metrics.storageUsageGb} / {metrics.storageLimitGb} GB
            </h3>
            <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${(metrics.storageUsageGb / metrics.storageLimitGb) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-on-surface-variant">Archived recording packages capacity</p>
          </div>
        </div>

        {/* Members seats */}
        <div className="glass-card rounded-2xl p-lg border border-outline-variant/60 bg-surface-container-lowest flex flex-col justify-between">
          <div className="flex justify-between items-start mb-sm">
            <span className="font-bold text-[10px] uppercase text-on-surface-variant tracking-wider">{t('metrics.users')}</span>
            <Icon name="manage_accounts" className="text-primary" size={20} />
          </div>
          <div className="space-y-xs">
            <h3 className="font-headline-lg text-headline-lg font-black text-on-surface">
              {metrics.activeUsers} / {metrics.activeUsersLimit}
            </h3>
            <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${(metrics.activeUsers / metrics.activeUsersLimit) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-on-surface-variant">Active tenant seats allocated</p>
          </div>
        </div>
      </div>

      {/* Pricing Comparison Cards */}
      <div className="space-y-md">
        <h3 className="font-title-md text-title-md text-on-surface font-bold">{t('pricingTitle')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {plans.map((p) => (
            <div
              key={p.name}
              className={cn(
                'glass-card rounded-3xl p-lg border flex flex-col justify-between relative min-h-[380px]',
                p.active
                  ? 'border-primary ring-2 ring-primary/20 bg-primary-container/5'
                  : 'border-outline-variant/60 hover:border-primary/40'
              )}
            >
              {p.active && (
                <span className="absolute top-md right-md bg-primary text-on-primary text-[10px] font-bold px-sm py-0.5 rounded-full uppercase tracking-wider">
                  {t('currentPlan')}
                </span>
              )}
              <div className="space-y-md">
                <div>
                  <h4 className="font-headline-md text-headline-md font-bold text-on-surface">{p.name}</h4>
                  <p className="text-body-sm text-on-surface-variant mt-xs leading-relaxed">{p.desc}</p>
                </div>

                <div className="flex items-baseline gap-xs">
                  <span className="font-headline-lg text-4xl font-black text-on-surface">{p.price}</span>
                  <span className="text-body-sm text-on-surface-variant">/ month</span>
                </div>

                <ul className="space-y-xs pt-md border-t border-outline-variant/40">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-xs text-body-sm text-on-surface-variant">
                      <Icon name="check" className="text-primary shrink-0" size={18} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {!p.active && (
                <Button variant="primary" className="rounded-xl w-full mt-lg">
                  Upgrade Plan Tiers
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Invoices Logs Table */}
      <div className="space-y-md">
        <h3 className="font-title-md text-title-md text-on-surface font-bold">{t('invoicesTitle')}</h3>
        <div className="glass-card rounded-2xl p-lg border border-outline-variant/60 bg-surface-container-lowest overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-start">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-outline-variant text-on-surface-variant bg-surface-container-low">
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="p-md text-start font-semibold text-xs uppercase tracking-wider">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-outline-variant/60 hover:bg-surface-container-low/20 transition-all">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-md text-body-sm text-on-surface-variant font-medium">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

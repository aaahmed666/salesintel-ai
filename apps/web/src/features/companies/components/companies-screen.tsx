'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Button, cn } from '@salesintel/ui';
import { Icon, StatCards } from '@/features/shell';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table';
import {
  useCompanies,
  useCreateCompany,
  useUpdateCompany,
} from '../queries';
import type { Company, SubscriptionPlan, CompanyStatus } from '@salesintel/types';

const columnHelper = createColumnHelper<Company>();

const companySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  industry: z.string().min(2, 'Industry is required'),
  domain: z.string().min(3, 'Domain is required'),
  plan: z.enum(['starter', 'growth', 'enterprise']),
  usersCount: z.coerce.number().min(1, 'Count must be at least 1'),
  status: z.enum(['active', 'suspended', 'trial']),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export function CompaniesScreen() {
  const t = useTranslations('companies');

  // Queries
  const { data: companies = [], isLoading, isError } = useCompanies();
  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany();

  // Local UI State
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      industry: '',
      domain: '',
      plan: 'growth',
      usersCount: 5,
      status: 'active',
    },
  });

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('name')}</span>,
      cell: (info) => <span className="font-semibold text-on-surface">{info.getValue()}</span>,
    }),
    columnHelper.accessor('industry', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('industry')}</span>,
      cell: (info) => <span className="text-on-surface-variant text-body-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor('domain', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('domain')}</span>,
      cell: (info) => <code className="bg-surface-container px-sm py-0.5 rounded text-xs font-mono">{info.getValue()}</code>,
    }),
    columnHelper.accessor('plan', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('plan')}</span>,
      cell: (info) => (
        <span className="px-xs py-0.5 rounded-full text-[10px] font-bold border bg-primary-container/10 text-primary border-primary/20 capitalize">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('usersCount', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('users')}</span>,
      cell: (info) => <span className="text-on-surface-variant font-mono">{info.getValue()}</span>,
    }),
    columnHelper.accessor('status', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('status')}</span>,
      cell: (info) => {
        const val = info.getValue();
        const color = val === 'active' ? 'bg-green-50 text-green-700 border-green-200' : val === 'trial' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-error-container/10 text-error border-error/20';
        return (
          <span className={cn('px-xs py-0.5 rounded-full text-[10px] font-bold border', color)}>
            {t(`statuses.${val}`)}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('actionsColumn')}</span>,
      cell: (info) => {
        const item = info.row.original;
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingId(item.id);
              reset({
                name: item.name,
                industry: item.industry,
                domain: item.domain,
                plan: item.plan,
                usersCount: item.usersCount,
                status: item.status,
              });
              setIsFormOpen(true);
            }}
            className="text-on-surface-variant hover:text-primary transition-colors p-xs"
          >
            <Icon name="edit" size={18} />
          </button>
        );
      },
    }),
  ], [t, reset]);

  const table = useReactTable({
    data: companies,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const onSubmit = (values: CompanyFormValues) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, input: values }, {
        onSuccess: () => {
          setIsFormOpen(false);
          setEditingId(null);
          reset();
        }
      });
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          setIsFormOpen(false);
          reset();
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-md">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="font-label-md text-label-md text-on-surface-variant">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-lg px-sm sm:px-md max-w-7xl mx-auto pb-xl">
      {/* Header Banner */}
      <div className="flex justify-between items-center mb-xl flex-wrap gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-base font-bold">
            {t('pageTitle')}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            {t('subtitle')}
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setEditingId(null);
            reset({
              name: '',
              industry: '',
              domain: '',
              plan: 'growth',
              usersCount: 5,
              status: 'active',
            });
            setIsFormOpen(true);
          }}
          className="rounded-xl flex items-center gap-xs"
        >
          <Icon name="add_circle" size={18} />
          {t('create')}
        </Button>
      </div>

      <StatCards
        items={[
          { key: 'accounts', label: t('kpis.totalAccounts'), value: '1,284', icon: 'corporate_fare', change: '+12%', tone: 'up' },
          { key: 'pipeline', label: t('kpis.totalPipeline'), value: '$12.4M', icon: 'trending_up', change: '+24%', tone: 'up' },
          { key: 'highIntent', label: t('kpis.highIntent'), value: '42', icon: 'bolt', change: '-3%', tone: 'down' },
          { key: 'activities', label: t('kpis.activities24h'), value: '156', icon: 'history' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Table List View */}
        <div className="lg:col-span-8 glass-card rounded-2xl p-lg border border-outline-variant/60 bg-surface-container-lowest overflow-hidden">
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
                  <tr
                    key={row.id}
                    onClick={() => setSelectedCompany(row.original)}
                    className={cn(
                      'border-b border-outline-variant/60 hover:bg-surface-container-low/20 transition-all cursor-pointer',
                      selectedCompany?.id === row.original.id && 'bg-primary-container/5 border-primary/20'
                    )}
                  >
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

        {/* Company Details Pane */}
        <div className="lg:col-span-4">
          {selectedCompany ? (
            <div className="glass-card rounded-2xl p-lg border border-outline-variant/60 bg-surface-container-lowest space-y-lg relative">
              <div className="flex justify-between items-start border-b border-outline-variant pb-md">
                <div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                    {selectedCompany.name}
                  </h3>
                  <code className="text-xs font-mono text-primary font-semibold">{selectedCompany.domain}</code>
                </div>
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="text-on-surface-variant hover:text-primary transition-colors p-xs"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>

              <div className="space-y-md text-body-sm">
                <div>
                  <span className="font-bold text-[10px] uppercase text-on-surface-variant tracking-wider block mb-base">{t('industry')}</span>
                  <span className="text-on-surface font-semibold">{selectedCompany.industry}</span>
                </div>
                <div>
                  <span className="font-bold text-[10px] uppercase text-on-surface-variant tracking-wider block mb-base">{t('plan')}</span>
                  <span className="px-xs py-0.5 rounded bg-primary/10 text-primary border border-primary/25 text-xs font-bold">
                    {t(`plans.${selectedCompany.plan}`)}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[10px] uppercase text-on-surface-variant tracking-wider block mb-base">{t('users')}</span>
                  <span className="text-on-surface font-mono">{t('usersUnit', { count: selectedCompany.usersCount })}</span>
                </div>
                <div>
                  <span className="font-bold text-[10px] uppercase text-on-surface-variant tracking-wider block mb-base">{t('registrationDate')}</span>
                  <span className="text-on-surface-variant">{new Date(selectedCompany.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-lg flex flex-col items-center justify-center text-center py-20 text-on-surface-variant border border-outline-variant/60 h-full min-h-[250px]">
              <Icon name="corporate_fare" size={36} className="text-outline-variant mb-md" />
              <p className="font-label-md text-label-md font-bold">{t('emptyTitle')}</p>
              <p className="text-body-sm text-on-surface-variant max-w-[15rem] mt-xs">
                {t('emptyBody')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Register/Edit Company overlay dialog */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-md z-50 animate-fade-in">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-surface rounded-2xl max-w-md w-full p-lg space-y-md border border-outline-variant shadow-xl">
            <div className="flex justify-between items-center border-b border-outline-variant pb-md">
              <h4 className="font-headline-md text-headline-md font-bold text-on-surface">
                {editingId ? t('edit') : t('create')}
              </h4>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-on-surface-variant hover:text-primary transition-colors p-xs"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="space-y-sm">
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-xs">{t('name')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('namePlaceholder')}
                  {...register('name')}
                  className="w-full bg-surface-container text-body-sm rounded-xl border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.name && <p className="text-xs text-error mt-xs">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-label-sm text-on-surface-variant mb-xs">{t('industry')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('industryPlaceholder')}
                  {...register('industry')}
                  className="w-full bg-surface-container text-body-sm rounded-xl border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.industry && <p className="text-xs text-error mt-xs">{errors.industry.message}</p>}
              </div>

              <div>
                <label className="block text-label-sm text-on-surface-variant mb-xs">{t('domain')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('domainPlaceholder')}
                  {...register('domain')}
                  className="w-full bg-surface-container text-body-sm rounded-xl border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.domain && <p className="text-xs text-error mt-xs">{errors.domain.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-xs">{t('plan')}</label>
                  <select
                    {...register('plan')}
                    className="w-full bg-surface-container text-body-sm rounded-xl border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="starter">{t('plans.starter')}</option>
                    <option value="growth">{t('plans.growth')}</option>
                    <option value="enterprise">{t('plans.enterprise')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-xs">{t('users')}</label>
                  <input
                    type="number"
                    required
                    {...register('usersCount')}
                    className="w-full bg-surface-container text-body-sm rounded-xl border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                  {errors.usersCount && <p className="text-xs text-error mt-xs">{errors.usersCount.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-label-sm text-on-surface-variant mb-xs">{t('status')}</label>
                <select
                  {...register('status')}
                  className="w-full bg-surface-container text-body-sm rounded-xl border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="active">{t('statuses.active')}</option>
                  <option value="trial">{t('statuses.trial')}</option>
                  <option value="suspended">{t('statuses.suspended')}</option>
                </select>
              </div>
            </div>

            <div className="flex gap-sm justify-end border-t border-outline-variant pt-md mt-md">
              <Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)} className="rounded-xl">
                {t('cancel')}
              </Button>
              <Button type="submit" variant="primary" className="rounded-xl">
                {t('submit')}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

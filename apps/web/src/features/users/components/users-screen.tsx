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
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeactivateUser,
} from '../queries';
import type { AppUser, UserRole, DirectoryUserStatus } from '@salesintel/types';

const columnHelper = createColumnHelper<AppUser>();

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['sales_rep', 'manager', 'admin']),
  department: z.string().min(2, 'Department is required'),
});

type UserFormValues = z.infer<typeof userSchema>;

export function UsersScreen() {
  const t = useTranslations('users');

  // Queries
  const { data: users = [], isLoading, isError } = useUsers();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deactivateMutation = useDeactivateUser();

  // Local UI State
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'sales_rep',
      department: '',
    },
  });

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('name')}</span>,
      cell: (info) => <span className="font-semibold text-on-surface">{info.getValue()}</span>,
    }),
    columnHelper.accessor('email', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('email')}</span>,
      cell: (info) => <span className="text-on-surface-variant text-body-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor('role', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('role')}</span>,
      cell: (info) => (
        <span className="px-xs py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold capitalize">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('department', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('department')}</span>,
      cell: (info) => <span className="text-on-surface-variant text-body-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor('status', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('status')}</span>,
      cell: (info) => {
        const val = info.getValue();
        let color = 'bg-surface-container text-on-surface-variant border-outline-variant';
        if (val === 'active') color = 'bg-green-50 text-green-700 border-green-200';
        if (val === 'invited') color = 'bg-blue-50 text-blue-700 border-blue-200';
        if (val === 'deactivated') color = 'bg-error-container/15 text-error border-error/25';
        return (
          <span className={cn('px-xs py-0.5 rounded-full text-[10px] font-bold border capitalize', color)}>
            {val}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">Action</span>,
      cell: (info) => {
        const item = info.row.original;
        const isDeactivated = item.status === 'deactivated';
        return (
          <div className="flex gap-xs" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                setEditingId(item.id);
                reset({
                  name: item.name,
                  email: item.email,
                  role: item.role,
                  department: item.department,
                });
                setIsInviteOpen(true);
              }}
              className="text-on-surface-variant hover:text-primary transition-colors p-xs"
            >
              <Icon name="edit" size={18} />
            </button>
            {!isDeactivated && (
              <button
                onClick={() => deactivateMutation.mutate(item.id)}
                className="text-on-surface-variant hover:text-error transition-colors p-xs"
                title={t('deactivate')}
              >
                <Icon name="block" size={18} />
              </button>
            )}
          </div>
        );
      },
    }),
  ], [t, reset, deactivateMutation]);

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const onSubmit = (values: UserFormValues) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, input: values }, {
        onSuccess: () => {
          setIsInviteOpen(false);
          setEditingId(null);
          reset();
        }
      });
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          setIsInviteOpen(false);
          reset();
        }
      });
    }
  };

  const activeUser = users.find((u) => u.id === selectedUser?.id) || selectedUser;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-md">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="font-label-md text-label-md text-on-surface-variant">Loading Members Directory...</p>
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
              email: '',
              role: 'sales_rep',
              department: '',
            });
            setIsInviteOpen(true);
          }}
          className="rounded-xl flex items-center gap-xs"
        >
          <Icon name="person_add" size={18} />
          {t('invite')}
        </Button>
      </div>

      <StatCards
        items={[
          { key: 'total', label: t('kpis.totalUsers'), value: '1,284', icon: 'group', change: '+12%', tone: 'up' },
          { key: 'active', label: t('kpis.activeNow'), value: '452', icon: 'how_to_reg' },
          { key: 'invited', label: t('kpis.invited'), value: '18', icon: 'mail', hint: t('kpis.pending') },
          { key: 'alerts', label: t('kpis.securityAlerts'), value: '0', icon: 'shield', hint: t('kpis.allClear') },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Users Table */}
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
                    onClick={() => setSelectedUser(row.original)}
                    className={cn(
                      'border-b border-outline-variant/60 hover:bg-surface-container-low/20 transition-all cursor-pointer',
                      activeUser?.id === row.original.id && 'bg-primary-container/5 border-primary/20'
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

        {/* User Details & Profile Panel */}
        <div className="lg:col-span-4">
          {activeUser ? (
            <div className="glass-card rounded-2xl p-lg border border-outline-variant/60 bg-surface-container-lowest space-y-lg relative">
              <div className="flex justify-between items-start border-b border-outline-variant pb-md">
                <div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                    {activeUser.name}
                  </h3>
                  <code className="text-xs font-mono text-primary font-semibold">{activeUser.email}</code>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-on-surface-variant hover:text-primary transition-colors p-xs"
                  aria-label="Close user details"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>

              <div className="space-y-md text-body-sm">
                <div>
                  <span className="font-bold text-[10px] uppercase text-on-surface-variant tracking-wider block mb-base">{t('role')}</span>
                  <span className="px-xs py-0.5 rounded bg-primary/10 text-primary border border-primary/25 text-xs font-bold capitalize">
                    {activeUser.role}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[10px] uppercase text-on-surface-variant tracking-wider block mb-base">{t('department')}</span>
                  <span className="text-on-surface font-semibold">{activeUser.department}</span>
                </div>
                <div>
                  <span className="font-bold text-[10px] uppercase text-on-surface-variant tracking-wider block mb-base">{t('lastLogin')}</span>
                  <span className="text-on-surface-variant">{activeUser.lastLogin ? new Date(activeUser.lastLogin).toLocaleString() : 'Never logged in'}</span>
                </div>
              </div>

              {/* Simple Audit Timeline */}
              <div className="space-y-sm pt-md border-t border-outline-variant/40">
                <span className="font-bold text-[10px] uppercase text-on-surface-variant tracking-wider block mb-xs">Recent Operations</span>
                <div className="space-y-xs max-h-[10rem] overflow-y-auto pr-xs text-xs text-on-surface-variant">
                  <div className="flex gap-sm p-sm bg-surface rounded-xl border border-outline-variant/30">
                    <Icon name="login" size={14} className="text-primary shrink-0" />
                    <span>Logged into portal session successfully</span>
                  </div>
                  <div className="flex gap-sm p-sm bg-surface rounded-xl border border-outline-variant/30">
                    <Icon name="settings" size={14} className="text-on-surface-variant shrink-0" />
                    <span>Modified workspace alerts notifications</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-lg flex flex-col items-center justify-center text-center py-20 text-on-surface-variant border border-outline-variant/60 h-full min-h-[250px]">
              <Icon name="manage_accounts" size={36} className="text-outline-variant mb-md" />
              <p className="font-label-md text-label-md font-bold">No User Selected</p>
              <p className="text-body-sm text-on-surface-variant max-w-[15rem] mt-xs">
                Select a member on the list table to view profile scopes and login logs.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Invite / Edit User Dialog Overlay Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-md z-50 animate-fade-in">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-surface rounded-2xl max-w-md w-full p-lg space-y-md border border-outline-variant shadow-xl">
            <div className="flex justify-between items-center border-b border-outline-variant pb-md">
              <h4 className="font-headline-md text-headline-md font-bold text-on-surface">
                {editingId ? t('edit') : t('inviteModal.title')}
              </h4>
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="text-on-surface-variant hover:text-primary transition-colors p-xs"
                aria-label="Close dialog"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <p className="text-body-sm text-on-surface-variant">
              {editingId ? 'Modify this user permissions role and department.' : t('inviteModal.desc')}
            </p>

            <div className="space-y-sm">
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-xs">{t('name')}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  {...register('name')}
                  className="w-full bg-surface-container text-body-sm rounded-xl border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.name && <p className="text-xs text-error mt-xs">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-label-sm text-on-surface-variant mb-xs">{t('email')}</label>
                <input
                  type="email"
                  required
                  placeholder={t('emailPlaceholder')}
                  {...register('email')}
                  disabled={!!editingId}
                  className="w-full bg-surface-container text-body-sm rounded-xl border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                />
                {errors.email && <p className="text-xs text-error mt-xs">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-xs">{t('role')}</label>
                  <select
                    {...register('role')}
                    className="w-full bg-surface-container text-body-sm rounded-xl border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary capitalize"
                  >
                    <option value="sales_rep">Sales Rep</option>
                    <option value="manager">Sales Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-xs">{t('department')}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EMEA Sales"
                    {...register('department')}
                    className="w-full bg-surface-container text-body-sm rounded-xl border border-outline-variant p-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.department && <p className="text-xs text-error mt-xs">{errors.department.message}</p>}
                </div>
              </div>
            </div>

            <div className="flex gap-sm justify-end border-t border-outline-variant pt-md mt-md">
              <Button type="button" variant="secondary" onClick={() => setIsInviteOpen(false)} className="rounded-xl">
                {t('cancel')}
              </Button>
              <Button type="submit" variant="primary" className="rounded-xl">
                {editingId ? t('save') : t('inviteModal.submit')}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

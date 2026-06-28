'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Button, cn } from '@salesintel/ui';
import { Icon, StatCards } from '@/features/shell';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
  getPaginationRowModel,
} from '@tanstack/react-table';
import {
  useContacts,
  useAddContactNote,
  useUpdateContactStatus,
} from '../queries';
import type { DirectoryContact, ContactStatus } from '@salesintel/types';

const columnHelper = createColumnHelper<DirectoryContact>();

export function ContactsScreen() {
  const t = useTranslations('contacts');

  // Queries
  const { data: contacts = [], isLoading, isError } = useContacts();
  const addNoteMutation = useAddContactNote();
  const updateStatusMutation = useUpdateContactStatus();

  // Local UI State
  const [selectedContact, setSelectedContact] = useState<DirectoryContact | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [detailTab, setDetailTab] = useState<'timeline' | 'notes'>('timeline');

  // Current active details object from list database
  const activeContact = contacts.find((c) => c.id === selectedContact?.id) || selectedContact;

  // Filters logic
  const filteredContacts = useMemo(() => {
    let result = [...contacts];

    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.companyName.toLowerCase().includes(q) ||
          c.jobTitle.toLowerCase().includes(q)
      );
    }

    return result;
  }, [contacts, search, statusFilter]);

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('name')}</span>,
      cell: (info) => <span className="font-semibold text-on-surface">{info.getValue()}</span>,
    }),
    columnHelper.accessor('email', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('email')}</span>,
      cell: (info) => <span className="text-on-surface-variant text-body-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor('phone', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('phone')}</span>,
      cell: (info) => <span className="text-on-surface-variant text-body-sm font-mono">{info.getValue()}</span>,
    }),
    columnHelper.accessor('companyName', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('company')}</span>,
      cell: (info) => <span className="text-on-surface font-semibold">{info.getValue()}</span>,
    }),
    columnHelper.accessor('jobTitle', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('title')}</span>,
      cell: (info) => <span className="text-on-surface-variant text-body-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor('status', {
      header: () => <span className="font-bold text-[11px] uppercase tracking-wider">{t('status')}</span>,
      cell: (info) => {
        const val = info.getValue();
        let color = 'bg-surface-container text-on-surface-variant border-outline-variant';
        if (val === 'active') color = 'bg-green-50 text-green-700 border-green-200';
        if (val === 'lead') color = 'bg-blue-50 text-blue-700 border-blue-200';
        if (val === 'do-not-contact') color = 'bg-error-container/15 text-error border-error/25';
        return (
          <span className={cn('px-xs py-0.5 rounded-full text-[10px] font-bold border capitalize', color)}>
            {val}
          </span>
        );
      },
    }),
  ], [t]);

  const table = useReactTable({
    data: filteredContacts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
  });

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeContact || !newNoteContent.trim()) return;
    addNoteMutation.mutate(
      { contactId: activeContact.id, content: newNoteContent, author: 'Current Rep' },
      {
        onSuccess: (updatedContact) => {
          setNewNoteContent('');
          setSelectedContact(updatedContact);
        },
      }
    );
  };

  const handleStatusChange = (status: ContactStatus) => {
    if (!activeContact) return;
    updateStatusMutation.mutate(
      { contactId: activeContact.id, status },
      {
        onSuccess: (updatedContact) => {
          setSelectedContact(updatedContact);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-md">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="font-label-md text-label-md text-on-surface-variant">Loading Contacts Directory...</p>
      </div>
    );
  }

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

      <StatCards
        items={[
          { key: 'contacts', label: t('kpis.totalContacts'), value: '12,482', icon: 'group', change: '+4.2%', tone: 'up' },
          { key: 'highIntent', label: t('kpis.highIntent'), value: '184', icon: 'auto_awesome' },
          { key: 'response', label: t('kpis.responseRate'), value: '64%', icon: 'mark_email_read' },
          { key: 'deals', label: t('kpis.activeDeals'), value: '$2.4M', icon: 'handshake' },
        ]}
      />

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between gap-md items-start sm:items-center">
        {/* Search */}
        <div className="relative flex items-center bg-surface-container rounded-full px-md py-xs border border-outline-variant w-full sm:w-80">
          <Icon name="search" className="text-on-surface-variant mr-xs" size={18} />
          <input
            type="text"
            placeholder={t('search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-body-sm font-body-sm w-full focus:ring-0 p-0"
          />
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-xs shrink-0">
          {['all', 'active', 'inactive', 'lead', 'do-not-contact'].map((pill) => (
            <button
              key={pill}
              onClick={() => setStatusFilter(pill)}
              className={cn(
                'px-sm py-1 rounded-full font-label-sm text-[11px] border transition-all capitalize',
                statusFilter === pill
                  ? 'border-primary bg-primary-container/10 text-primary font-bold'
                  : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
              )}
            >
              {pill === 'all' ? 'All Contacts' : pill}
            </button>
          ))}
        </div>
      </div>

      {/* Grid view containing list table and detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        
        {/* Table list view */}
        <div className="lg:col-span-8 space-y-md">
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
                    <tr
                      key={row.id}
                      onClick={() => setSelectedContact(row.original)}
                      className={cn(
                        'border-b border-outline-variant/60 hover:bg-surface-container-low/20 transition-all cursor-pointer',
                        activeContact?.id === row.original.id && 'bg-primary-container/5 border-primary/20'
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

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-md pt-sm border-t border-outline-variant/40">
              <span className="text-body-sm text-on-surface-variant">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              <div className="flex gap-xs">
                <Button
                  variant="secondary"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="rounded-xl px-md py-1"
                >
                  Prev
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="rounded-xl px-md py-1"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact detail drawer right pane */}
        <div className="lg:col-span-4">
          {activeContact ? (
            <div className="glass-card rounded-2xl p-lg border border-outline-variant/60 bg-surface-container-lowest space-y-lg relative">
              {/* Header profile cards */}
              <div className="border-b border-outline-variant pb-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                      {activeContact.name}
                    </h3>
                    <p className="text-body-sm text-on-surface-variant font-medium">
                      {activeContact.jobTitle} @ <strong>{activeContact.companyName}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="text-on-surface-variant hover:text-primary transition-colors p-xs"
                  >
                    <Icon name="close" size={20} />
                  </button>
                </div>

                {/* Status Switcher Select */}
                <div className="flex gap-sm items-center mt-md">
                  <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">Status:</span>
                  <select
                    value={activeContact.status}
                    onChange={(e) => handleStatusChange(e.target.value as ContactStatus)}
                    className="bg-surface-container text-body-sm rounded-xl border border-outline-variant px-sm py-1 outline-none focus:ring-1 focus:ring-primary capitalize"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="lead">Lead</option>
                    <option value="do-not-contact">Do Not Contact</option>
                  </select>
                </div>
              </div>

              {/* Tabs Timeline / Memos */}
              <div className="border-b border-outline-variant/30 flex gap-md">
                {(['timeline', 'notes'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDetailTab(tab)}
                    className={cn(
                      'border-b-2 pb-xs font-label-md text-label-md outline-none capitalize transition-all',
                      detailTab === tab ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant'
                    )}
                  >
                    {tab === 'timeline' ? t('timeline') : t('notes')}
                  </button>
                ))}
              </div>

              {/* Detail Contents */}
              {detailTab === 'timeline' ? (
                <div className="space-y-sm max-h-[16rem] overflow-y-auto pr-xs">
                  {activeContact.timeline.map((act) => {
                    let iconName = 'chat';
                    if (act.type === 'call') iconName = 'call';
                    if (act.type === 'email') iconName = 'mail';
                    if (act.type === 'meeting') iconName = 'groups';
                    return (
                      <div key={act.id} className="flex gap-md items-start p-sm bg-surface rounded-xl border border-outline-variant/20">
                        <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                          <Icon name={iconName} size={18} />
                        </div>
                        <div>
                          <h5 className="font-semibold text-body-sm text-on-surface">{act.title}</h5>
                          <p className="text-[11px] text-on-surface-variant mt-base">{act.description}</p>
                          <span className="text-[10px] text-on-surface-variant block mt-base">
                            {new Date(act.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-md">
                  {/* Notes List */}
                  <div className="space-y-sm max-h-[12rem] overflow-y-auto pr-xs">
                    {activeContact.notes.length === 0 ? (
                      <p className="text-body-sm text-on-surface-variant text-center py-sm italic">No memos attached yet.</p>
                    ) : (
                      activeContact.notes.map((note) => (
                        <div key={note.id} className="p-sm rounded-xl border border-outline-variant/30 bg-surface space-y-xs text-body-sm">
                          <p className="text-on-surface leading-relaxed">{note.content}</p>
                          <div className="flex justify-between text-[10px] text-on-surface-variant pt-xs border-t border-outline-variant/20">
                            <span>Author: {note.author}</span>
                            <span>{new Date(note.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Note Form */}
                  <form onSubmit={handleAddNoteSubmit} className="space-y-xs pt-sm border-t border-outline-variant/40">
                    <label className="block text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">{t('addNote')}</label>
                    <div className="flex gap-sm">
                      <input
                        type="text"
                        required
                        placeholder="Attach a memo note..."
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        className="bg-surface-container text-body-sm rounded-xl border border-outline-variant p-sm w-full outline-none focus:ring-1 focus:ring-primary"
                      />
                      <Button type="submit" variant="primary" className="rounded-xl shrink-0">
                        Add
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-lg flex flex-col items-center justify-center text-center py-24 text-on-surface-variant border border-outline-variant/60 h-full min-h-[300px]">
              <Icon name="contacts" size={36} className="text-outline-variant mb-md" />
              <p className="font-label-md text-label-md font-bold">No Contact Selected</p>
              <p className="text-body-sm text-on-surface-variant max-w-[15rem] mt-xs">
                Select any lead in the directory list to inspect timeline events and logs.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

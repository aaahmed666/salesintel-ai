'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import type { Task } from '@salesintel/types';

interface TasksChecklistCardProps {
  tasks: Task[];
  onToggleStatus: (taskId: string, completed: boolean) => void;
  onAddTask: (task: { title: string; dueDate: string; priority: 'high' | 'medium' | 'low' }) => void;
}

export function TasksChecklistCard({ tasks, onToggleStatus, onAddTask }: TasksChecklistCardProps) {
  const t = useTranslations('dealProfile.tasks');
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title,
      dueDate: dueDate || new Date(Date.now() + 86400000).toISOString(),
      priority,
    });

    setTitle('');
    setDueDate('');
    setPriority('medium');
    setIsAdding(false);
  };

  const priorityColors = {
    high: 'text-error bg-error-container/10',
    medium: 'text-secondary bg-secondary-container/10',
    low: 'text-on-surface-variant bg-surface-container-high/40',
  };

  return (
    <div className="bento-card bg-surface-container-lowest p-lg">
      <div className="mb-md flex items-center justify-between">
        <h4 className="font-label-md text-label-md font-bold uppercase tracking-widest text-on-surface-variant">
          {t('title')}
        </h4>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center text-on-surface-variant hover:text-primary transition-colors"
        >
          <Icon name="playlist_add" size={20} />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-lg p-md border border-dashed border-outline-variant rounded-xl bg-surface-container-low/30 space-y-md">
          <input
            type="text"
            placeholder={t('placeholder')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-surface-container-lowest text-label-md font-label-md rounded-lg border border-outline-variant p-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
            required
          />
          <div className="flex gap-md flex-wrap sm:flex-nowrap">
            <div className="flex-1">
              <label className="block text-label-sm text-on-surface-variant mb-xs">
                {t('due')}
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-surface-container-lowest text-label-md font-label-md rounded-lg border border-outline-variant p-sm outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-label-sm text-on-surface-variant mb-xs">
                {t('priority')}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as never)}
                className="w-full bg-surface-container-lowest text-label-md font-label-md rounded-lg border border-outline-variant p-sm outline-none"
              >
                <option value="high">{t('high')}</option>
                <option value="medium">{t('medium')}</option>
                <option value="low">{t('low')}</option>
              </select>
            </div>
          </div>
          <div className="flex gap-sm justify-end">
            <Button type="button" variant="secondary" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {t('add')}
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-sm">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-start gap-md group p-sm hover:bg-surface-container-low/20 rounded-lg transition-colors">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => onToggleStatus(task.id, e.target.checked)}
              className="mt-1 rounded text-primary focus:ring-primary border-outline-variant h-4 w-4"
            />
            <div className="flex-grow">
              <p className={`font-body-sm text-body-sm font-medium ${task.completed ? 'line-through text-on-surface-variant/50' : 'text-on-background'}`}>
                {task.title}
              </p>
              <div className="flex gap-sm items-center mt-xs">
                <span className="text-[10px] text-on-surface-variant font-semibold">
                  {t('due')}: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className={`text-[9px] px-sm py-0.5 rounded-full font-bold uppercase ${priorityColors[task.priority]}`}>
                  {t(task.priority as never)}
                </span>
              </div>
            </div>
            <button className="opacity-0 group-hover:opacity-100 material-symbols-outlined text-on-surface-variant text-base cursor-pointer">
              more_vert
            </button>
          </div>
        ))}
      </div>

      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full mt-lg py-sm border-2 border-dashed border-outline-variant rounded-xl text-on-surface-variant font-label-md text-label-md hover:border-primary hover:text-primary transition-colors flex justify-center items-center gap-xs"
        >
          <Icon name="add" size={16} />
          {t('add')}
        </button>
      )}
    </div>
  );
}

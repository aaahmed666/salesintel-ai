'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import type { Note } from '@salesintel/types';

interface NotesCardProps {
  notes: Note[];
  onAddNote: (note: { content: string; author: string }) => void;
}

export function NotesCard({ notes, onAddNote }: NotesCardProps) {
  const t = useTranslations('dealProfile.notes');
  const [content, setContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAddNote({
      content,
      author: 'Account Rep',
    });

    setContent('');
    setIsAdding(false);
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
          <Icon name="note_add" size={20} />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-lg space-y-md">
          <textarea
            rows={3}
            placeholder={t('placeholder')}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-surface-container-lowest text-body-sm rounded-lg border border-outline-variant p-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none"
            required
          />
          <div className="flex gap-sm justify-end">
            <Button type="button" variant="secondary" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {t('save')}
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-md">
        {notes.map((note) => (
          <div key={note.id} className="p-md rounded-xl border border-outline-variant bg-surface-container-low/20">
            <div className="flex justify-between items-center mb-xs">
              <span className="font-label-sm text-label-sm font-bold text-on-background">
                {note.author}
              </span>
              <span className="text-[10px] text-on-surface-variant">
                {new Date(note.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              {note.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

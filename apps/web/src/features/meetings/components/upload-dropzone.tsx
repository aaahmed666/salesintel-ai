'use client';

import { useTranslations } from 'next-intl';
import { FILE_INPUT_ACCEPT, MAX_UPLOAD_MB } from '@salesintel/config';
import { Button, cn } from '@salesintel/ui';
import { Icon } from '@/features/shell';
import { useDropzone } from '../hooks';

interface UploadDropzoneProps {
  onFiles: (files: FileList | File[]) => void;
}

/**
 * The primary drag & drop surface. Mirrors the design: dashed rounded card,
 * centered cloud glyph, supported-format copy, Browse / Import actions, and a
 * footer of trust badges. Fully keyboard accessible via the hidden input.
 */
export function UploadDropzone({ onFiles }: UploadDropzoneProps) {
  const t = useTranslations('meetings.upload');
  const { isDragging, inputRef, openFileDialog, onInputChange, dropzoneProps } = useDropzone({
    onFiles,
  });

  return (
    <div
      {...dropzoneProps}
      role="button"
      tabIndex={0}
      onClick={openFileDialog}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openFileDialog();
        }
      }}
      aria-label={t('dropTitle')}
      className={cn(
        'px-md py-xl focus-visible:shadow-focus-ring flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed text-center outline-none transition-colors',
        isDragging
          ? 'border-primary bg-primary-container/10'
          : 'border-outline-variant bg-surface-container-lowest hover:border-primary/50 hover:bg-surface-container-low/40',
      )}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={FILE_INPUT_ACCEPT}
        onChange={onInputChange}
        className="sr-only"
        tabIndex={-1}
      />

      <span className="bg-primary-container/15 text-primary flex h-20 w-20 items-center justify-center rounded-full">
        <Icon name="cloud_upload" size={40} />
      </span>

      <h2 className="mt-lg font-display text-headline-md text-on-surface">
        {isDragging ? t('dropActive') : t('dropTitle')}
      </h2>
      <p className="text-body-sm text-on-surface-variant mt-2 max-w-md">{t('dropSubtitle')}</p>
      <p className="text-body-sm text-on-surface-variant">{t('dropHint')}</p>

      <div className="mt-lg flex flex-wrap items-center justify-center gap-3">
        <Button
          type="button"
          variant="primary"
          onClick={(e) => {
            e.stopPropagation();
            openFileDialog();
          }}
        >
          {t('browse')}
        </Button>
        <Button type="button" variant="secondary" onClick={(e) => e.stopPropagation()}>
          {t('importZoom')}
        </Button>
      </div>

      <div className="mt-lg gap-x-lg text-label-md text-on-surface-variant flex flex-wrap items-center justify-center gap-y-2">
        <span className="inline-flex items-center gap-1.5">
          <Icon name="verified" size={18} className="text-success" />
          {t('highFidelity')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Icon name="shield" size={18} className="text-on-surface-variant" />
          {t('gdpr')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Icon name="database" size={18} className="text-on-surface-variant" />
          {t('maxSize', { size: MAX_UPLOAD_MB })}
        </span>
      </div>
    </div>
  );
}

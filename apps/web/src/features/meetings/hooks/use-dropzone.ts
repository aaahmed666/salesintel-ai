'use client';

import { useCallback, useRef, useState, type DragEvent } from 'react';

interface UseDropzoneOptions {
  onFiles: (files: FileList | File[]) => void;
  disabled?: boolean;
}

/**
 * Minimal, dependency-free drag & drop + click-to-browse handler. Tracks an
 * `isDragging` flag (depth-counted so nested elements don't flicker) and wires
 * a hidden file input for keyboard/click selection.
 */
export function useDropzone({ onFiles, disabled }: UseDropzoneOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const dragDepth = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDragEnter = useCallback(
    (e: DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      dragDepth.current += 1;
      setIsDragging(true);
    },
    [disabled],
  );

  const onDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setIsDragging(false);
    }
  }, []);

  const onDragOver = useCallback(
    (e: DragEvent) => {
      if (disabled) return;
      e.preventDefault();
    },
    [disabled],
  );

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      dragDepth.current = 0;
      setIsDragging(false);
      if (disabled) return;
      if (e.dataTransfer?.files?.length) onFiles(e.dataTransfer.files);
    },
    [disabled, onFiles],
  );

  const openFileDialog = useCallback(() => inputRef.current?.click(), []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) onFiles(e.target.files);
      e.target.value = '';
    },
    [onFiles],
  );

  return {
    isDragging,
    inputRef,
    openFileDialog,
    onInputChange,
    dropzoneProps: { onDragEnter, onDragLeave, onDragOver, onDrop },
  };
}

'use client';

import { useCallback, useRef, useState } from 'react';
import { validateUploadFile, meetingService } from '@salesintel/api';
import type { MeetingFileExtension, UploadItem } from '@salesintel/types';
import { MAX_UPLOAD_BATCH } from '@salesintel/config';
import { useCreateUpload } from '../queries';

function uid(): string {
  return `up_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Manages the client-side upload queue: validates incoming files, performs the
 * REAL multipart upload to the backend with live progress, then registers the
 * accepted upload as a meeting. Retry/remove/cancel controls included.
 */
export function useFileUpload() {
  const [items, setItems] = useState<UploadItem[]>([]);
  // Keep the actual File objects keyed by item id (not stored in UI state).
  const files = useRef<Map<string, File>>(new Map());
  const createUpload = useCreateUpload();

  const update = useCallback((id: string, patch: Partial<UploadItem>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }, []);

  const runUpload = useCallback(
    async (item: UploadItem) => {
      const file = files.current.get(item.id);
      if (!file) {
        update(item.id, { state: 'error', errorKey: 'errors.unknown' });
        return;
      }

      update(item.id, { state: 'uploading', progress: 0, errorKey: undefined });

      try {
        // 1) Physically upload the binary with live progress.
        const uploaded = await meetingService.uploadFile(file, (pct) =>
          update(item.id, { progress: Math.min(99, pct) }),
        );

        // 2) Register the meeting row referencing the stored file.
        const res = await createUpload.mutateAsync({
          fileName: item.fileName,
          size: item.size,
          mimeType: item.mimeType,
          fileId: uploaded.fileId,
          fileUrl: uploaded.url,
        });

        update(item.id, { state: 'success', progress: 100, meetingId: res.meetingId });
      } catch {
        update(item.id, { state: 'error', errorKey: 'errors.unknown' });
      }
    },
    [createUpload, update],
  );

  const addFiles = useCallback(
    (incomingFiles: FileList | File[]) => {
      const incoming = Array.from(incomingFiles).slice(0, MAX_UPLOAD_BATCH);

      const newItems: UploadItem[] = incoming.map((file) => {
        const result = validateUploadFile(file);
        const id = uid();
        if (result.ok) files.current.set(id, file);
        return {
          id,
          fileName: file.name,
          size: file.size,
          mimeType: file.type,
          extension: (result.extension ?? 'mp3') as MeetingFileExtension,
          state: result.ok ? 'queued' : 'error',
          progress: 0,
          errorKey: result.ok ? undefined : result.errorKey,
        };
      });

      setItems((prev) => [...newItems, ...prev]);
      newItems.filter((it) => it.state === 'queued').forEach((it) => void runUpload(it));
    },
    [runUpload],
  );

  const retry = useCallback(
    (id: string) => {
      const item = items.find((it) => it.id === id);
      if (item) void runUpload(item);
    },
    [items, runUpload],
  );

  const remove = useCallback((id: string) => {
    files.current.delete(id);
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const cancel = useCallback(
    (id: string) => {
      update(id, { state: 'canceled' });
    },
    [update],
  );

  const clearCompleted = useCallback(() => {
    setItems((prev) => {
      prev.filter((it) => it.state === 'success').forEach((it) => files.current.delete(it.id));
      return prev.filter((it) => it.state !== 'success');
    });
  }, []);

  const activeCount = items.filter(
    (it) => it.state === 'uploading' || it.state === 'queued',
  ).length;

  return { items, addFiles, retry, remove, cancel, clearCompleted, activeCount };
}

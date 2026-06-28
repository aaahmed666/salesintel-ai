import { z } from 'zod';
import { ACCEPTED_UPLOAD_TYPES, MAX_UPLOAD_BYTES } from '@salesintel/config';
import type { MeetingFileExtension } from '@salesintel/types';

/**
 * Metadata schema for an upload request. The actual binary is streamed
 * separately; the API contract only needs the descriptor. Messages are i18n
 * keys, consistent with the auth schemas.
 */
export const createUploadSchema = z.object({
  fileName: z.string().min(1, { message: 'validation.file.required' }),
  size: z
    .number()
    .positive({ message: 'validation.file.required' })
    .max(MAX_UPLOAD_BYTES, { message: 'validation.file.tooLarge' }),
  mimeType: z.string().min(1, { message: 'validation.file.required' }),
});

export type CreateUploadValues = z.infer<typeof createUploadSchema>;

/** Result of validating a browser File before it enters the upload queue. */
export interface FileValidationResult {
  ok: boolean;
  /** i18n error key when `ok === false`. */
  errorKey?: string;
  extension?: MeetingFileExtension;
}

function extensionFromName(name: string): string | undefined {
  const match = /\.([^.]+)$/.exec(name.toLowerCase());
  return match?.[1];
}

/**
 * Validate a File against the accepted extensions/MIME types and size ceiling.
 * Matching by extension first (browsers report inconsistent MIME types for
 * audio containers like m4a) then falling back to the MIME allowlist.
 */
export function validateUploadFile(file: {
  name: string;
  size: number;
  type: string;
}): FileValidationResult {
  const ext = extensionFromName(file.name) as MeetingFileExtension | undefined;
  const allowedExts = Object.keys(ACCEPTED_UPLOAD_TYPES) as MeetingFileExtension[];

  const extOk = ext !== undefined && allowedExts.includes(ext);
  const mimeOk = Object.values(ACCEPTED_UPLOAD_TYPES).some((list) => list.includes(file.type));

  if (!extOk && !mimeOk) {
    return { ok: false, errorKey: 'validation.file.unsupported' };
  }
  if (file.size <= 0) {
    return { ok: false, errorKey: 'validation.file.empty' };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, errorKey: 'validation.file.tooLarge' };
  }

  return { ok: true, extension: (ext ?? 'mp3') as MeetingFileExtension };
}

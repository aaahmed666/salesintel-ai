import { AxiosError } from 'axios';
import { AUTH_ERROR_CODES } from '@salesintel/config';
import type { ApiError } from '@salesintel/types';

interface RawErrorBody {
  code?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Convert any thrown value (Axios error, network error, or unknown) into a
 * stable {@link ApiError}. The UI/query layer can branch on `code`.
 */
export function normalizeError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const body = (error.response?.data ?? {}) as RawErrorBody;

    // No response → network / timeout.
    if (!error.response) {
      return {
        code: 'NETWORK_ERROR',
        message: 'errors.network',
        status: 0,
      };
    }

    return {
      code: body.code ?? AUTH_ERROR_CODES.UNKNOWN,
      message: body.message ?? 'errors.unknown',
      fieldErrors: body.fieldErrors,
      status,
    };
  }

  if (error instanceof Error) {
    return { code: AUTH_ERROR_CODES.UNKNOWN, message: error.message };
  }

  return { code: AUTH_ERROR_CODES.UNKNOWN, message: 'errors.unknown' };
}

export function isApiError(value: unknown): value is ApiError {
  return typeof value === 'object' && value !== null && 'code' in value && 'message' in value;
}

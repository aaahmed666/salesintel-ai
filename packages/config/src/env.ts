import { z } from 'zod';

/**
 * Centralized, validated environment management.
 *
 * Only `NEXT_PUBLIC_*` variables are available in the browser.
 */

const clientSchema = z.object({
  // Backend FastAPI mounts auth under /api/v1. Point straight at it so the
  // service layer can call relative paths like `/auth/login`.
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default('http://localhost:8000/api/v1'),
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  NEXT_PUBLIC_ENABLE_MOCKS: z
    .string()
    .optional()
    .transform((v) => v === undefined || v === 'true'),
  // Public Supabase creds — needed for Google OAuth code exchange client-side.
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
});

export type ClientEnv = z.infer<typeof clientSchema>;

function readClientEnv(): ClientEnv {
  const parsed = clientSchema.safeParse({
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_ENABLE_MOCKS: process.env.NEXT_PUBLIC_ENABLE_MOCKS,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid client environment variables:\n${issues}`);
  }

  return parsed.data;
}

export const env: ClientEnv = readClientEnv();

export const isProduction = env.NEXT_PUBLIC_APP_ENV === 'production';
export const isDevelopment = env.NEXT_PUBLIC_APP_ENV === 'development';
export const mocksEnabled = env.NEXT_PUBLIC_ENABLE_MOCKS;

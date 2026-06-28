import { z } from 'zod';
import {
  FULL_NAME_MAX_LENGTH,
  FULL_NAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  TWO_FACTOR_CODE_LENGTH,
} from '@salesintel/config';

/**
 * Shared validation schemas — single source of truth for React Hook Form and
 * (in mock mode) the in-memory handlers. Messages use i18n keys.
 */

export const emailSchema = z
  .string()
  .min(1, { message: 'validation.email.required' })
  .email({ message: 'validation.email.invalid' });

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, { message: 'validation.password.min' })
  .max(PASSWORD_MAX_LENGTH, { message: 'validation.password.max' })
  .regex(/[a-z]/, { message: 'validation.password.lowercase' })
  .regex(/[A-Z]/, { message: 'validation.password.uppercase' })
  .regex(/[0-9]/, { message: 'validation.password.number' });

export const fullNameSchema = z
  .string()
  .min(FULL_NAME_MIN_LENGTH, { message: 'validation.fullName.min' })
  .max(FULL_NAME_MAX_LENGTH, { message: 'validation.fullName.max' });

/* --------------------------------- Login --------------------------------- */

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: 'validation.password.required' }),
  rememberMe: z.boolean().optional().default(false),
});
export type LoginValues = z.infer<typeof loginSchema>;

/* -------------------------------- Register ------------------------------- */
// Two visible modes:
//   * self-signup → requires organizationName
//   * invite      → inviteToken present (hidden field, prefilled from URL)
// The form decides which fields to show; the schema validates conditionally.

export const registerSchema = z
  .object({
    fullName: fullNameSchema,
    email: emailSchema,
    password: passwordSchema,
    organizationName: z.string().optional(),
    inviteToken: z.string().optional(),
  })
  .refine(
    (data) => Boolean(data.inviteToken) || Boolean(data.organizationName?.trim()),
    {
      message: 'validation.organizationName.required',
      path: ['organizationName'],
    },
  );
export type RegisterValues = z.infer<typeof registerSchema>;

/* ----------------------------- Forgot password --------------------------- */

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

/* ----------------------------- Reset password ---------------------------- */
// `accessToken` comes from the Supabase recovery link (URL fragment), not typed.

export const resetPasswordSchema = z
  .object({
    accessToken: z.string().min(1, { message: 'validation.token.required' }),
    password: passwordSchema,
    confirmPassword: z.string().min(1, { message: 'validation.confirmPassword.required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'validation.confirmPassword.mismatch',
    path: ['confirmPassword'],
  });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

/* ----------------------------- Email verify ------------------------------ */

export const verifyEmailSchema = z.object({
  tokenHash: z.string().min(1, { message: 'validation.token.required' }),
  type: z.string().optional(),
});
export type VerifyEmailValues = z.infer<typeof verifyEmailSchema>;

/* ----------------------------- Two-factor -------------------------------- */

export const twoFactorSchema = z.object({
  challengeId: z.string().min(1),
  code: z
    .string()
    .length(TWO_FACTOR_CODE_LENGTH, { message: 'validation.code.length' })
    .regex(/^\d+$/, { message: 'validation.code.digits' }),
});
export type TwoFactorValues = z.infer<typeof twoFactorSchema>;

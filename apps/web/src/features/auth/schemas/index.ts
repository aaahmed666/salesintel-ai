/**
 * Auth validation schemas are owned by @salesintel/api so the mock backend and
 * the forms validate identically. This barrel re-exports them for ergonomic,
 * feature-local imports.
 */
export {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  twoFactorSchema,
  emailSchema,
  passwordSchema,
  fullNameSchema,
} from '@salesintel/api';

export type {
  LoginValues,
  RegisterValues,
  ForgotPasswordValues,
  ResetPasswordValues,
  VerifyEmailValues,
  TwoFactorValues,
} from '@salesintel/api';

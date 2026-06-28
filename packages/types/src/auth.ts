import type { ID, ISODateString } from './common';

/** Roles available within the Sales Intelligence platform (matches backend). */
export type UserRole = 'admin' | 'manager' | 'sales_rep';

/** Account-level status. */
export type UserStatus = 'active' | 'pending' | 'suspended';

/** The authenticated user as exposed to the client. */
export interface User {
  id: ID;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: ISODateString;
}

/** Pair of tokens returned after a successful authentication. */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

/** Full session object persisted client-side. */
export interface AuthSession {
  user: User;
  tokens: AuthTokens;
}

/* --------------------------------- Inputs -------------------------------- */

export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  /** Self-signup: creates a new organization and makes this user its admin. */
  organizationName?: string;
  /** Invite flow: org/role/team derived from the invite token. */
  inviteToken?: string;
  /** Direct flow (admin tooling): existing organization id. */
  orgId?: string;
  role?: UserRole;
  teamId?: string;
}

export interface ForgotPasswordInput {
  email: string;
  redirectTo?: string;
}

export interface ResetPasswordInput {
  /** Supabase recovery access token (from the email link fragment). */
  accessToken: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailInput {
  tokenHash: string;
  type?: string;
}

export interface TwoFactorInput {
  challengeId: string;
  code: string;
}

/* ------------------------------ Google OAuth ----------------------------- */

export interface GoogleStartInput {
  redirectTo?: string;
}

export interface GoogleCallbackInput {
  accessToken: string;
  refreshToken: string;
  organizationName?: string;
  orgId?: string;
  inviteToken?: string;
}

/* -------------------------------- Invites -------------------------------- */

export interface CreateInviteInput {
  email: string;
  role?: UserRole;
  teamId?: string;
}

export interface InvitePreview {
  email: string;
  role: UserRole;
  orgId: string;
  teamId?: string;
}

/* --------------------------------- Results ------------------------------- */

export type LoginResult =
  | { status: 'authenticated'; session: AuthSession }
  | { status: 'two_factor_required'; challengeId: string; maskedEmail: string };

export interface MessageResult {
  message: string;
}

export interface GoogleStartResult {
  url: string;
}

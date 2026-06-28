import { mocksEnabled } from '@salesintel/config';
import type {
  AuthSession,
  AuthTokens,
  CreateInviteInput,
  ForgotPasswordInput,
  GoogleCallbackInput,
  GoogleStartInput,
  GoogleStartResult,
  InvitePreview,
  LoginInput,
  LoginResult,
  MessageResult,
  RegisterInput,
  ResetPasswordInput,
  TwoFactorInput,
  User,
  UserRole,
  VerifyEmailInput,
} from '@salesintel/types';
import { apiClient, normalizeError } from './client';
import { mockAuthApi } from './mock';

/**
 * The single contract the feature layer depends on. When mocks are enabled it
 * delegates to the in-memory implementation; otherwise it calls the real
 * FastAPI backend and ADAPTS its response shape to the frontend domain model.
 */
export interface AuthService {
  login(input: LoginInput): Promise<LoginResult>;
  register(input: RegisterInput): Promise<AuthSession>;
  forgotPassword(input: ForgotPasswordInput): Promise<MessageResult>;
  resetPassword(input: ResetPasswordInput): Promise<MessageResult>;
  verifyEmail(input: VerifyEmailInput): Promise<MessageResult>;
  verifyTwoFactor(input: TwoFactorInput): Promise<AuthSession>;
  resendTwoFactor(challengeId: string): Promise<MessageResult>;
  logout(): Promise<MessageResult>;
  me(): Promise<User>;
  refresh(refreshToken: string): Promise<AuthSession>;
  googleStart(input: GoogleStartInput): Promise<GoogleStartResult>;
  googleCallback(input: GoogleCallbackInput): Promise<AuthSession>;
  createInvite(input: CreateInviteInput): Promise<{ inviteLink: string }>;
  getInvite(token: string): Promise<InvitePreview>;
}

/* ------------------------------------------------------------------------- *
 * Backend wire shapes (snake_case, tokens nested inside `user`).
 * ------------------------------------------------------------------------- */
interface BackendUser {
  user_id: string;
  email: string;
  full_name: string;
  role: string;
  two_factor_enabled?: boolean;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
}

interface BackendAuthResponse {
  success: boolean;
  message?: string;
  user?: BackendUser;
  two_factor_required?: boolean;
  challenge_id?: string;
  masked_email?: string;
}

/* ------------------------------ Adapters --------------------------------- */

function toUser(b: BackendUser): User {
  return {
    id: b.user_id,
    email: b.email,
    fullName: b.full_name,
    role: (b.role as UserRole) ?? 'sales_rep',
    // Backend confirms email on creation; surface as verified by default.
    status: 'active',
    emailVerified: true,
    twoFactorEnabled: b.two_factor_enabled ?? false,
    createdAt: new Date().toISOString(),
  };
}

function toTokens(b: BackendUser): AuthTokens {
  return {
    accessToken: b.access_token ?? '',
    refreshToken: b.refresh_token ?? '',
    expiresIn: b.expires_in ?? 3600,
    tokenType: 'Bearer',
  };
}

function toSession(b: BackendUser): AuthSession {
  return { user: toUser(b), tokens: toTokens(b) };
}

/* ------------------------------ Transport -------------------------------- */

async function rawPost<T>(url: string, body: unknown): Promise<T> {
  try {
    const { data } = await apiClient.post<T>(url, body);
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
}

async function rawGet<T>(url: string): Promise<T> {
  try {
    const { data } = await apiClient.get<T>(url);
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
}

async function rawPatch<T>(url: string, body: unknown): Promise<T> {
  try {
    const { data } = await apiClient.patch<T>(url, body);
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
}

/* ------------------------------ HTTP impl -------------------------------- */

const httpAuthApi: AuthService = {
  async login(input) {
    const res = await rawPost<BackendAuthResponse>('/auth/login', {
      email: input.email,
      password: input.password,
    });
    if (res.two_factor_required) {
      return {
        status: 'two_factor_required',
        challengeId: res.challenge_id!,
        maskedEmail: res.masked_email!,
      };
    }
    return { status: 'authenticated', session: toSession(res.user!) };
  },

  async register(input) {
    // Map camelCase inputs to the backend's snake_case contract.
    const body: Record<string, unknown> = {
      email: input.email,
      password: input.password,
      full_name: input.fullName,
    };
    if (input.inviteToken) body.invite_token = input.inviteToken;
    else if (input.organizationName) body.organization_name = input.organizationName;
    else if (input.orgId) {
      body.org_id = input.orgId;
      if (input.role) body.role = input.role;
      if (input.teamId) body.team_id = input.teamId;
    }
    const res = await rawPost<BackendAuthResponse>('/auth/register', body);
    // Register returns the user without tokens; the caller logs in next, but we
    // still hand back a session-shaped object (empty tokens) for type parity.
    return toSession(res.user!);
  },

  async forgotPassword(input) {
    const res = await rawPost<{ message: string }>('/auth/forgot-password', {
      email: input.email,
      redirect_to: input.redirectTo,
    });
    return { message: res.message };
  },

  async resetPassword(input) {
    const res = await rawPost<{ message: string }>('/auth/reset-password', {
      access_token: input.accessToken,
      new_password: input.password,
      confirm_password: input.confirmPassword,
    });
    return { message: res.message };
  },

  async verifyEmail(input) {
    const res = await rawPost<{ message: string }>('/auth/verify-email', {
      token_hash: input.tokenHash,
      type: input.type ?? 'email',
    });
    return { message: res.message };
  },

  async verifyTwoFactor(input) {
    const res = await rawPost<BackendAuthResponse>('/auth/two-factor', {
      challenge_id: input.challengeId,
      code: input.code,
    });
    return toSession(res.user!);
  },

  async resendTwoFactor(challengeId) {
    const res = await rawPost<{ message: string }>('/auth/two-factor/resend', {
      challenge_id: challengeId,
    });
    return { message: res.message };
  },

  async logout() {
    const res = await rawPost<{ message: string }>('/auth/logout', {});
    return { message: res.message };
  },

  async me() {
    const res = await rawGet<BackendAuthResponse>('/auth/me');
    return toUser(res.user!);
  },

  async refresh(refreshToken) {
    const res = await rawPost<BackendAuthResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return toSession(res.user!);
  },

  async googleStart(input) {
    const res = await rawPost<{ url: string }>('/auth/google', {
      redirect_to: input.redirectTo,
    });
    return { url: res.url };
  },

  async googleCallback(input) {
    const res = await rawPost<BackendAuthResponse>('/auth/google/callback', {
      access_token: input.accessToken,
      refresh_token: input.refreshToken,
      organization_name: input.organizationName,
      org_id: input.orgId,
      invite_token: input.inviteToken,
    });
    return toSession(res.user!);
  },

  async createInvite(input) {
    const res = await rawPost<{ invite: { invite_link: string } }>('/auth/invites', {
      email: input.email,
      role: input.role ?? 'sales_rep',
      team_id: input.teamId,
    });
    return { inviteLink: res.invite.invite_link };
  },

  async getInvite(token) {
    const res = await rawGet<{ invite: { email: string; role: string; org_id: string; team_id?: string } }>(
      `/auth/invites/${token}`,
    );
    return {
      email: res.invite.email,
      role: res.invite.role as UserRole,
      orgId: res.invite.org_id,
      teamId: res.invite.team_id,
    };
  },
};

/* ------------------------- Mock parity (dev-only) ------------------------ */
// The mock implements the original subset; wrap it so the extended interface
// still type-checks when mocks are enabled. Methods whose INPUT shape changed
// (verifyEmail, resetPassword) are overridden here so the mock's older bodies
// are never relied on for typing.
const mockAuthService: AuthService = {
  ...(mockAuthApi as unknown as AuthService),
  async verifyEmail(_input) {
    return { message: 'auth.verifyEmail.success' };
  },
  async resetPassword(_input) {
    return { message: 'auth.resetPassword.success' };
  },
  async me() {
    throw normalizeError(new Error('me() is not available in mock mode'));
  },
  async refresh() {
    throw normalizeError(new Error('refresh() is not available in mock mode'));
  },
  async googleStart() {
    return { url: '#google-mock' };
  },
  async googleCallback() {
    throw normalizeError(new Error('googleCallback() is not available in mock mode'));
  },
  async createInvite() {
    return { inviteLink: 'https://app.local/register?invite=mock-token' };
  },
  async getInvite() {
    return { email: 'invitee@example.com', role: 'sales_rep', orgId: 'org_mock' };
  },
};

export const authService: AuthService = mocksEnabled ? mockAuthService : httpAuthApi;

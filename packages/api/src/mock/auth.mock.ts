import { AUTH_ERROR_CODES } from '@salesintel/config';
import type {
  ApiError,
  AuthSession,
  ForgotPasswordInput,
  LoginInput,
  LoginResult,
  MessageResult,
  RegisterInput,
  ResetPasswordInput,
  TwoFactorInput,
  VerifyEmailInput,
} from '@salesintel/types';
import {
  challenges,
  delay,
  findUserByEmail,
  maskEmail,
  mockUsers,
  randomCode,
  randomId,
  toPublicUser,
  tokens,
} from './db';

function fail(code: string, message: string, fieldErrors?: Record<string, string>): never {
  const error: ApiError = { code, message, fieldErrors, status: 400 };
  throw error;
}

function issueSession(userId: string): AuthSession {
  const user = mockUsers.find((u) => u.id === userId)!;
  return {
    user: toPublicUser(user),
    tokens: {
      accessToken: randomId('access'),
      refreshToken: randomId('refresh'),
      expiresIn: 3600,
      tokenType: 'Bearer',
    },
  };
}

export const mockAuthApi = {
  async login(input: LoginInput): Promise<LoginResult> {
    await delay();
    const user = findUserByEmail(input.email);
    if (!user || user.password !== input.password) {
      fail(AUTH_ERROR_CODES.INVALID_CREDENTIALS, 'errors.invalidCredentials');
    }

    if (user.twoFactorEnabled) {
      const challengeId = randomId('chal');
      const code = randomCode();
      challenges.set(challengeId, { userId: user.id, code });
      // In a real backend the code is emailed; surface it in dev console.
      // eslint-disable-next-line no-console
      console.info(`[mock] 2FA code for ${user.email}: ${code}`);
      return {
        status: 'two_factor_required',
        challengeId,
        maskedEmail: maskEmail(user.email),
      };
    }

    return { status: 'authenticated', session: issueSession(user.id) };
  },

  async register(input: RegisterInput): Promise<AuthSession> {
    await delay();
    if (findUserByEmail(input.email)) {
      fail(AUTH_ERROR_CODES.EMAIL_TAKEN, 'errors.emailTaken', {
        email: 'errors.emailTaken',
      });
    }
    const id = randomId('usr');
    mockUsers.push({
      id,
      fullName: input.fullName,
      email: input.email,
      password: input.password,
      role: 'sales_rep',
      status: 'pending',
      emailVerified: false,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
    });
    return issueSession(id);
  },

  async forgotPassword(input: ForgotPasswordInput): Promise<MessageResult> {
    await delay();
    const user = findUserByEmail(input.email);
    // Always succeed to avoid leaking which emails exist (enumeration safe).
    if (user) {
      const token = randomId('reset');
      tokens.set(token, { userId: user.id, kind: 'reset' });
      // eslint-disable-next-line no-console
      console.info(`[mock] Password reset token for ${user.email}: ${token}`);
    }
    return { message: 'auth.forgotPassword.success' };
  },

  async resetPassword(input: ResetPasswordInput): Promise<MessageResult> {
    await delay();
    // Real reset uses a Supabase recovery access token; the mock just echoes
    // success and updates the matching token entry if one happens to exist.
    const entry = tokens.get(input.accessToken);
    if (entry && entry.kind === 'reset') {
      const user = mockUsers.find((u) => u.id === entry.userId);
      if (user) user.password = input.password;
      tokens.delete(input.accessToken);
    }
    return { message: 'auth.resetPassword.success' };
  },

  async verifyEmail(input: VerifyEmailInput): Promise<MessageResult> {
    await delay();
    const entry = tokens.get(input.tokenHash);
    if (entry && entry.kind === 'verify') {
      const user = mockUsers.find((u) => u.id === entry.userId);
      if (user) {
        user.emailVerified = true;
        user.status = 'active';
      }
      tokens.delete(input.tokenHash);
    }
    return { message: 'auth.verifyEmail.success' };
  },

  async verifyTwoFactor(input: TwoFactorInput): Promise<AuthSession> {
    await delay();
    const challenge = challenges.get(input.challengeId);
    if (!challenge) {
      fail(AUTH_ERROR_CODES.EXPIRED_TOKEN, 'errors.expiredToken');
    }
    // Accept the issued code, or 000000 as a developer convenience.
    if (input.code !== challenge.code && input.code !== '000000') {
      fail(AUTH_ERROR_CODES.INVALID_2FA_CODE, 'errors.invalid2faCode');
    }
    challenges.delete(input.challengeId);
    return issueSession(challenge.userId);
  },

  async resendTwoFactor(challengeId: string): Promise<MessageResult> {
    await delay(500);
    const challenge = challenges.get(challengeId);
    if (!challenge) {
      fail(AUTH_ERROR_CODES.EXPIRED_TOKEN, 'errors.expiredToken');
    }
    const code = randomCode();
    challenges.set(challengeId, { ...challenge, code });
    // eslint-disable-next-line no-console
    console.info(`[mock] New 2FA code: ${code}`);
    return { message: 'auth.twoFactor.resent' };
  },

  async logout(): Promise<MessageResult> {
    await delay(200);
    return { message: 'auth.logout.success' };
  },
};

export type MockAuthApi = typeof mockAuthApi;

import crypto from 'crypto';
import { BACKEND_URL } from '../env';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  refreshCookie: string;
}

function derivePasswordVerifier(password: string, saltHex: string): string {
  return crypto
    .pbkdf2Sync(password, Buffer.from(saltHex, 'hex'), 310000, 32, 'sha256')
    .toString('base64');
}

function getRefreshCookie(res: Response): string {
  const headers = res.headers as Headers & { getSetCookie?: () => string[] };
  const setCookieHeaders = headers.getSetCookie?.() ?? [];
  const cookie = setCookieHeaders.find((value) => value.startsWith('harmony_refresh_token='));
  if (!cookie) {
    throw new Error('Auth response did not include harmony_refresh_token cookie');
  }
  return cookie;
}

function getRefreshTokenFromCookie(cookie: string): string {
  return decodeURIComponent(cookie.split(';')[0].split('=')[1]);
}

export async function register(
  email: string,
  username: string,
  password: string,
): Promise<AuthTokens> {
  const challengeRes = await fetch(`${BACKEND_URL}/api/auth/register/challenge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  if (!challengeRes.ok) {
    throw new Error(`Register challenge failed: ${challengeRes.status}`);
  }
  const { passwordSalt } = (await challengeRes.json()) as { passwordSalt: string };
  const passwordVerifier = derivePasswordVerifier(password, passwordSalt);

  const regRes = await fetch(`${BACKEND_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, passwordSalt, passwordVerifier }),
  });
  if (!regRes.ok) {
    const body = await regRes.text();
    throw new Error(`Register failed (${regRes.status}): ${body}`);
  }
  const body = (await regRes.json()) as { accessToken: string; refreshToken?: string };
  const refreshCookie = getRefreshCookie(regRes);
  return {
    accessToken: body.accessToken,
    refreshCookie,
    refreshToken: getRefreshTokenFromCookie(refreshCookie),
  };
}

export async function login(email: string, password: string): Promise<AuthTokens> {
  const challengeRes = await fetch(`${BACKEND_URL}/api/auth/login/challenge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!challengeRes.ok) {
    throw new Error(`Login challenge failed: ${challengeRes.status}`);
  }
  const { passwordSalt } = (await challengeRes.json()) as { passwordSalt: string };

  const passwordVerifier = derivePasswordVerifier(password, passwordSalt);

  const loginRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, passwordVerifier }),
  });
  if (!loginRes.ok) {
    const body = await loginRes.text();
    throw new Error(`Login failed (${loginRes.status}): ${body}`);
  }
  const body = (await loginRes.json()) as { accessToken: string; refreshToken?: string };
  const refreshCookie = getRefreshCookie(loginRes);
  return {
    accessToken: body.accessToken,
    refreshCookie,
    refreshToken: getRefreshTokenFromCookie(refreshCookie),
  };
}

import crypto from 'crypto';
import { BACKEND_URL } from '../env';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

function derivePasswordVerifier(password: string, saltHex: string): string {
  return crypto
    .pbkdf2Sync(password, Buffer.from(saltHex, 'hex'), 310000, 32, 'sha256')
    .toString('base64');
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
  return regRes.json() as Promise<AuthTokens>;
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
  return loginRes.json() as Promise<AuthTokens>;
}

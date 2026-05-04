jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

import { cookies } from 'next/headers';

import { setSessionCookie } from '@/app/actions/session';
import { AUTH_COOKIE_NAME } from '@/lib/auth-constants';

const mockCookies = cookies as jest.MockedFunction<typeof cookies>;

describe('session actions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('sets the auth session cookie with SameSite=Strict', async () => {
    const set = jest.fn();
    mockCookies.mockResolvedValue({
      set,
    } as unknown as Awaited<ReturnType<typeof cookies>>);

    await setSessionCookie('access-token');

    expect(set).toHaveBeenCalledWith(AUTH_COOKIE_NAME, 'access-token', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });
  });

  it('sets the auth session cookie as secure in production', async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      writable: true,
      configurable: true,
    });

    const set = jest.fn();
    mockCookies.mockResolvedValue({
      set,
    } as unknown as Awaited<ReturnType<typeof cookies>>);

    try {
      await setSessionCookie('access-token');

      expect(set).toHaveBeenCalledWith(
        AUTH_COOKIE_NAME,
        'access-token',
        expect.objectContaining({
          secure: true,
        }),
      );
    } finally {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalNodeEnv,
        writable: true,
        configurable: true,
      });
    }
  });
});

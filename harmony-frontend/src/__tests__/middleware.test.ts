jest.mock('next/server', () => {
  const createResponse = (status: number, location?: string) => {
    const headerMap = new Map<string, string>();

    if (status === 200) {
      headerMap.set('x-middleware-next', '1');
    }

    if (location) {
      headerMap.set('location', location);
    }

    return {
      status,
      headers: {
        get: (name: string) => headerMap.get(name.toLowerCase()) ?? null,
      },
      cookies: {
        delete: (name: string) => {
          headerMap.set('set-cookie', `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
        },
      },
    };
  };

  return {
    NextResponse: {
      next: () => createResponse(200),
      redirect: (url: URL) => createResponse(307, url.toString()),
    },
  };
});

jest.mock('jose/jwt/verify', () => ({
  jwtVerify: jest.fn(),
}));

import { jwtVerify } from 'jose/jwt/verify';
import { TextEncoder as NodeTextEncoder } from 'node:util';
import { AUTH_COOKIE_NAME } from '../lib/auth-constants';
import { config, middleware } from '../middleware';

const mockJwtVerify = jwtVerify as jest.MockedFunction<typeof jwtVerify>;
const originalJwtAccessSecret = process.env.JWT_ACCESS_SECRET;
const testTextEncoder = NodeTextEncoder as typeof TextEncoder;

function buildRequest(pathname: string, cookieValue?: string) {
  return {
    nextUrl: { pathname },
    url: `http://localhost${pathname}`,
    cookies: {
      get: jest.fn((name: string) => {
        if (name !== AUTH_COOKIE_NAME || cookieValue === undefined) return undefined;
        return { name, value: cookieValue };
      }),
    },
  } as never;
}

function encodePayload(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function createJwt(payload: unknown) {
  return `header.${encodePayload(payload)}.signature`;
}

describe('middleware', () => {
  beforeEach(() => {
    globalThis.TextEncoder = testTextEncoder;
    process.env.JWT_ACCESS_SECRET = 'test-access-secret';
    mockJwtVerify.mockReset();
    mockJwtVerify.mockResolvedValue({
      payload: { sub: 'user-1', username: 'alice' },
      protectedHeader: { alg: 'HS256' },
    } as never);
  });

  afterAll(() => {
    process.env.JWT_ACCESS_SECRET = originalJwtAccessSecret;
  });

  it('exports the protected route matcher configuration', () => {
    expect(config.matcher).toEqual(['/channels/:path*', '/settings/:path*']);
  });

  it('passes through unprotected routes', async () => {
    const response = await middleware(buildRequest('/public'));

    expect(response.headers.get('x-middleware-next')).toBe('1');
    expect(response.headers.get('location')).toBeNull();
    expect(mockJwtVerify).not.toHaveBeenCalled();
  });

  it('redirects the exact channels route when no auth cookie is present', async () => {
    const response = await middleware(buildRequest('/channels'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'http://localhost/auth/login?returnUrl=%2Fchannels',
    );
  });

  it('redirects unauthenticated channel+slug routes to the guest /c/ path', async () => {
    const response = await middleware(buildRequest('/channels/my-server/my-channel'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost/c/my-server/my-channel');
  });

  it('redirects to login (not /c/) for server-only channel routes without a channel slug', async () => {
    const response = await middleware(buildRequest('/channels/my-server'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'http://localhost/auth/login?returnUrl=%2Fchannels%2Fmy-server',
    );
  });

  it('redirects the exact settings route when no auth cookie is present', async () => {
    const response = await middleware(buildRequest('/settings'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'http://localhost/auth/login?returnUrl=%2Fsettings',
    );
  });

  it('allows protected channel routes with a verified JWT session cookie', async () => {
    const token = createJwt({ sub: 'user-1', username: 'alice' });
    const response = await middleware(buildRequest('/channels/general', token));

    expect(response.headers.get('x-middleware-next')).toBe('1');
    expect(mockJwtVerify).toHaveBeenCalledWith(
      token,
      new TextEncoder().encode('test-access-secret'),
      { algorithms: ['HS256'] },
    );
  });

  it('allows protected settings routes with a verified JWT session cookie', async () => {
    const response = await middleware(
      buildRequest('/settings/profile', createJwt({ sub: 'user-1' })),
    );

    expect(response.headers.get('x-middleware-next')).toBe('1');
  });

  it('redirects and clears cookies when a JWT-style cookie has a forged signature', async () => {
    mockJwtVerify.mockRejectedValueOnce(new Error('signature verification failed'));

    const response = await middleware(
      buildRequest('/channels/general', createJwt({ sub: 'attacker' })),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'http://localhost/auth/login?returnUrl=%2Fchannels%2Fgeneral',
    );
    expect(response.headers.get('set-cookie')).toContain(`${AUTH_COOKIE_NAME}=;`);
  });

  it('redirects and clears cookies when the verified JWT payload is missing sub', async () => {
    mockJwtVerify.mockResolvedValueOnce({
      payload: { username: 'alice' },
      protectedHeader: { alg: 'HS256' },
    } as never);

    const response = await middleware(
      buildRequest('/channels/general', createJwt({ username: 'alice' })),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('set-cookie')).toContain(`${AUTH_COOKIE_NAME}=;`);
  });

  it('redirects and clears cookies when JWT_ACCESS_SECRET is not configured', async () => {
    delete process.env.JWT_ACCESS_SECRET;

    const response = await middleware(
      buildRequest('/channels/general', createJwt({ sub: 'user-1' })),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('set-cookie')).toContain(`${AUTH_COOKIE_NAME}=;`);
    expect(mockJwtVerify).not.toHaveBeenCalled();
  });

  it('redirects and clears cookies when the cookie is not a valid JWT', async () => {
    mockJwtVerify.mockRejectedValueOnce(new Error('invalid token'));

    const response = await middleware(buildRequest('/channels/general', 'not-base64'));

    expect(response.status).toBe(307);
    expect(response.headers.get('set-cookie')).toContain(`${AUTH_COOKIE_NAME}=;`);
  });
});

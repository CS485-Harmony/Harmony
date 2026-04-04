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

import { AUTH_COOKIE_NAME } from '../lib/auth-constants';
import { config, middleware } from '../middleware';

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
  it('exports the protected route matcher configuration', () => {
    expect(config.matcher).toEqual(['/channels/:path*', '/settings/:path*']);
  });

  it('passes through unprotected routes', () => {
    const response = middleware(buildRequest('/public'));

    expect(response.headers.get('x-middleware-next')).toBe('1');
    expect(response.headers.get('location')).toBeNull();
  });

  it('redirects the exact channels route when no auth cookie is present', () => {
    const response = middleware(buildRequest('/channels'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'http://localhost/auth/login?returnUrl=%2Fchannels',
    );
  });

  it('redirects the exact settings route when no auth cookie is present', () => {
    const response = middleware(buildRequest('/settings'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'http://localhost/auth/login?returnUrl=%2Fsettings',
    );
  });

  it('allows protected channel routes with a plain base64url session cookie', () => {
    const response = middleware(
      buildRequest('/channels/general', encodePayload({ sub: 'user-1', username: 'alice' })),
    );

    expect(response.headers.get('x-middleware-next')).toBe('1');
  });

  it('allows protected settings routes with a JWT-style session cookie', () => {
    const response = middleware(buildRequest('/settings/profile', createJwt({ sub: 'user-1' })));

    expect(response.headers.get('x-middleware-next')).toBe('1');
  });

  it('redirects and clears cookies when the decoded payload is a non-object value', () => {
    const response = middleware(buildRequest('/channels/general', encodePayload('bad-session')));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'http://localhost/auth/login?returnUrl=%2Fchannels%2Fgeneral',
    );
    expect(response.headers.get('set-cookie')).toContain(`${AUTH_COOKIE_NAME}=;`);
  });

  it('redirects and clears cookies when the decoded payload is null', () => {
    const response = middleware(buildRequest('/channels/general', encodePayload(null)));

    expect(response.status).toBe(307);
    expect(response.headers.get('set-cookie')).toContain(`${AUTH_COOKIE_NAME}=;`);
  });

  it('redirects and clears cookies when the decoded payload is missing sub', () => {
    const response = middleware(
      buildRequest('/channels/general', encodePayload({ username: 'alice' })),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('set-cookie')).toContain(`${AUTH_COOKIE_NAME}=;`);
  });

  it('redirects and clears cookies when the payload cannot be decoded as JSON', () => {
    const response = middleware(buildRequest('/channels/general', 'not-base64'));

    expect(response.status).toBe(307);
    expect(response.headers.get('set-cookie')).toContain(`${AUTH_COOKIE_NAME}=;`);
  });
});

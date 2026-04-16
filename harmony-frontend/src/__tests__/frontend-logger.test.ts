import { buildFrontendLogEntry, sanitizeLogMetadata } from '../lib/frontend-logger';

describe('frontend-logger', () => {
  it('drops sensitive and unapproved metadata fields', () => {
    const fields = sanitizeLogMetadata({
      component: 'api-client',
      feature: 'auth',
      event: 'refresh_failed',
      email: 'user@example.com',
      username: 'alice',
      content: 'secret message',
      token: 'secret-token',
      body: { password: 'secret' },
      headers: { authorization: 'Bearer secret' },
    });

    expect(fields).toEqual({
      component: 'api-client',
      feature: 'auth',
      event: 'refresh_failed',
    });
  });

  it('sanitizes route-like fields and only keeps safe error details', () => {
    const entry = buildFrontendLogEntry('error', 'Request failed', {
      component: 'trpc-client',
      route: '/channels/general?token=secret&email=user@example.com',
      target: 'https://example.com/trpc/message.send?input=%7B%22content%22%3A%22hello%22%7D',
      error: {
        name: 'TrpcHttpError',
        message: 'user@example.com should not leak',
        status: 500,
        digest: 'abc123',
        stack: 'stack trace',
      },
    });

    expect(entry.runtime).toBe('browser');
    expect(entry.fields).toEqual({
      component: 'trpc-client',
      route: '/channels/general',
      target: '/trpc/message.send',
      errorName: 'TrpcHttpError',
      statusCode: 500,
      digest: 'abc123',
    });
    expect(entry.fields).not.toHaveProperty('message');
    expect(entry.fields).not.toHaveProperty('stack');
  });
});

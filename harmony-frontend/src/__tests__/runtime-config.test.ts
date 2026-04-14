import {
  getApiBaseUrl,
  getChannelUrl,
  getPublicBaseUrl,
  getPublicMetadataBase,
} from '@/lib/runtime-config';

describe('runtime-config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('uses localhost fallbacks when env vars are unset', () => {
    delete process.env.NEXT_PUBLIC_BASE_URL;
    delete process.env.NEXT_PUBLIC_API_URL;

    expect(getPublicBaseUrl()).toBe('http://localhost:3000');
    expect(getApiBaseUrl()).toBe('http://localhost:4000');
    expect(getPublicMetadataBase().toString()).toBe('http://localhost:3000/');
  });

  it('normalizes configured base URLs by trimming trailing slashes', () => {
    process.env.NEXT_PUBLIC_BASE_URL = 'https://harmony.chat/';
    process.env.NEXT_PUBLIC_API_URL = 'https://api.harmony.chat///';

    expect(getPublicBaseUrl()).toBe('https://harmony.chat');
    expect(getApiBaseUrl()).toBe('https://api.harmony.chat');
  });

  it('builds absolute, encoded public channel URLs', () => {
    process.env.NEXT_PUBLIC_BASE_URL = 'https://harmony.chat/';

    expect(getChannelUrl('server slug', 'general chat')).toBe(
      'https://harmony.chat/c/server%20slug/general%20chat',
    );
  });

  it('throws when a configured public base URL is malformed', () => {
    process.env.NEXT_PUBLIC_BASE_URL = 'harmony.chat';

    expect(() => getPublicBaseUrl()).toThrow('Invalid NEXT_PUBLIC_BASE_URL value');
  });

  it('throws when a configured API base URL is malformed', () => {
    process.env.NEXT_PUBLIC_API_URL = 'api.harmony.chat';

    expect(() => getApiBaseUrl()).toThrow('Invalid NEXT_PUBLIC_API_URL value');
  });
});

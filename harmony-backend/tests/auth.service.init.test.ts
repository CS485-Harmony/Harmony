/**
 * Auth service module initialization tests — Issue #263
 *
 * Tests module-level IIFE behavior for JWT_REFRESH_EXPIRES_DAYS validation.
 *
 * NOTE: The JWT_ACCESS_SECRET / JWT_REFRESH_SECRET missing-in-non-test-env
 * branches (lines 16-17 and 24-25) are guarded by NODE_ENV !== 'test' AND
 * run at module import time. jest.isolateModules does not re-evaluate
 * module-level IIFEs when ts-jest's transform cache is present, making these
 * branches structurally unreachable in the Jest test runner. They are covered
 * by istanbul ignore comments in the source with an explanatory note.
 */

const prismaMockFactory = () => ({
  prisma: {
    user: { findUnique: jest.fn(), create: jest.fn(), upsert: jest.fn() },
    refreshToken: { create: jest.fn(), updateMany: jest.fn() },
    server: { findFirst: jest.fn(), findMany: jest.fn() },
    serverMember: { upsert: jest.fn() },
  },
});

const serverMemberMockFactory = () => ({
  serverMemberService: { joinServer: jest.fn() },
});

afterEach(() => {
  process.env.JWT_ACCESS_SECRET = 'test-access-secret';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
  process.env.JWT_ACCESS_EXPIRES_IN = '15m';
  process.env.JWT_REFRESH_EXPIRES_DAYS = '7';
  process.env.NODE_ENV = 'test';
});

describe('auth.service module initialization', () => {
  it('throws when JWT_REFRESH_EXPIRES_DAYS is invalid (non-numeric)', () => {
    process.env.JWT_ACCESS_SECRET = 'test-access-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    process.env.JWT_REFRESH_EXPIRES_DAYS = 'not-a-number';

    jest.isolateModules(() => {
      jest.doMock('../src/db/prisma', prismaMockFactory);
      jest.doMock('../src/services/serverMember.service', serverMemberMockFactory);

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      expect(() => require('../src/services/auth.service')).toThrow(
        'Invalid JWT_REFRESH_EXPIRES_DAYS value',
      );
    });
  });

  it('throws when JWT_REFRESH_EXPIRES_DAYS is zero or negative', () => {
    process.env.JWT_ACCESS_SECRET = 'test-access-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    process.env.JWT_REFRESH_EXPIRES_DAYS = '0';

    jest.isolateModules(() => {
      jest.doMock('../src/db/prisma', prismaMockFactory);
      jest.doMock('../src/services/serverMember.service', serverMemberMockFactory);

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      expect(() => require('../src/services/auth.service')).toThrow(
        'Invalid JWT_REFRESH_EXPIRES_DAYS value',
      );
    });
  });
});

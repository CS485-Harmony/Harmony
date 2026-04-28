import { UserStatus } from '@prisma/client';
import { presenceService, PRESENCE_LEASE_TTL_MS } from '../src/services/presence.service';
import { redis } from '../src/db/redis';
import { userRepository } from '../src/repositories/user.repository';
import { userService } from '../src/services/user.service';

jest.mock('../src/db/redis', () => ({
  redis: {
    zadd: jest.fn(),
    zrangebyscore: jest.fn(),
    eval: jest.fn(),
  },
}));

jest.mock('../src/repositories/user.repository', () => ({
  userRepository: {
    findSelf: jest.fn(),
  },
}));

jest.mock('../src/services/user.service', () => ({
  userService: {
    updateUser: jest.fn().mockResolvedValue({}),
  },
}));

const mockRedis = redis as unknown as {
  zadd: jest.Mock;
  zrangebyscore: jest.Mock;
  eval: jest.Mock;
};
const mockFindSelf = userRepository.findSelf as jest.Mock;
const mockUpdateUser = userService.updateUser as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Date, 'now').mockReturnValue(1_000);
  mockFindSelf.mockResolvedValue({ id: 'user-1', status: UserStatus.OFFLINE });
  mockUpdateUser.mockResolvedValue({});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('presenceService.renewLease', () => {
  it('stores a shared Redis lease and updates status when it changed', async () => {
    await presenceService.renewLease('user-1', UserStatus.ONLINE);

    expect(mockRedis.zadd).toHaveBeenCalledWith(
      'presence:leases',
      1_000 + PRESENCE_LEASE_TTL_MS,
      'user-1',
    );
    expect(mockUpdateUser).toHaveBeenCalledWith('user-1', { status: UserStatus.ONLINE });
  });

  it('does not rebroadcast when renewing the same status', async () => {
    mockFindSelf.mockResolvedValue({ id: 'user-1', status: UserStatus.ONLINE });

    await presenceService.renewLease('user-1', UserStatus.ONLINE);

    expect(mockRedis.zadd).toHaveBeenCalled();
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it('does not update status when the user no longer exists', async () => {
    mockFindSelf.mockResolvedValue(null);

    await presenceService.renewLease('deleted-user', UserStatus.ONLINE);

    expect(mockRedis.zadd).toHaveBeenCalled();
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });
});

describe('presenceService.expireStaleLeases', () => {
  it('marks users offline after winning conditional lease removal', async () => {
    mockRedis.zrangebyscore.mockResolvedValue(['user-1']);
    mockRedis.eval.mockResolvedValue(1);
    mockFindSelf.mockResolvedValue({ id: 'user-1', status: UserStatus.ONLINE });

    const expiredCount = await presenceService.expireStaleLeases(2_000);

    expect(expiredCount).toBe(1);
    expect(mockUpdateUser).toHaveBeenCalledWith('user-1', { status: UserStatus.OFFLINE });
  });

  it('does not mark offline when another replica renewed the lease first', async () => {
    mockRedis.zrangebyscore.mockResolvedValue(['user-1']);
    mockRedis.eval.mockResolvedValue(0);

    const expiredCount = await presenceService.expireStaleLeases(2_000);

    expect(expiredCount).toBe(0);
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });
});

import request from 'supertest';
import { createApp } from '../src/app';
import { authService } from '../src/services/auth.service';
import { presenceService } from '../src/services/presence.service';

jest.mock('../src/services/auth.service', () => ({
  authService: {
    verifyAccessToken: jest.fn(),
  },
}));

jest.mock('../src/services/presence.service', () => ({
  presenceService: {
    renewLease: jest.fn().mockResolvedValue(undefined),
    startSweeper: jest.fn(),
  },
}));

jest.mock('../src/middleware/rate-limit.middleware', () => ({
  createPublicRateLimiter: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

const app = createApp();
const mockVerifyAccessToken = authService.verifyAccessToken as jest.Mock;
const mockRenewLease = presenceService.renewLease as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockVerifyAccessToken.mockReturnValue({ sub: 'user-1' });
  mockRenewLease.mockResolvedValue(undefined);
});

describe('POST /api/presence/status', () => {
  it('updates authenticated users to ONLINE', async () => {
    const res = await request(app)
      .post('/api/presence/status')
      .set('Authorization', 'Bearer valid-token')
      .send({ status: 'ONLINE' });

    expect(res.status).toBe(204);
    expect(mockVerifyAccessToken).toHaveBeenCalledWith('valid-token');
    expect(mockRenewLease).toHaveBeenCalledWith('user-1', 'ONLINE');
  });

  it('updates authenticated users to IDLE', async () => {
    const res = await request(app)
      .post('/api/presence/status')
      .set('Authorization', 'Bearer valid-token')
      .send({ status: 'IDLE' });

    expect(res.status).toBe(204);
    expect(mockRenewLease).toHaveBeenCalledWith('user-1', 'IDLE');
  });

  it('rejects DND because automatic presence only owns online and idle leases', async () => {
    const res = await request(app)
      .post('/api/presence/status')
      .set('Authorization', 'Bearer valid-token')
      .send({ status: 'DND' });

    expect(res.status).toBe(400);
    expect(mockRenewLease).not.toHaveBeenCalled();
  });

  it('rejects explicit OFFLINE updates because stale leases expire server-side', async () => {
    const res = await request(app)
      .post('/api/presence/status')
      .set('Authorization', 'Bearer valid-token')
      .send({ status: 'OFFLINE' });

    expect(res.status).toBe(400);
    expect(mockRenewLease).not.toHaveBeenCalled();
  });

  it('rejects missing bearer token', async () => {
    const res = await request(app).post('/api/presence/status').send({ status: 'ONLINE' });

    expect(res.status).toBe(401);
    expect(mockRenewLease).not.toHaveBeenCalled();
  });

  it('rejects invalid bearer token', async () => {
    mockVerifyAccessToken.mockImplementation(() => {
      throw new Error('expired');
    });

    const res = await request(app)
      .post('/api/presence/status')
      .set('Authorization', 'Bearer expired-token')
      .send({ status: 'ONLINE' });

    expect(res.status).toBe(401);
    expect(mockRenewLease).not.toHaveBeenCalled();
  });
});

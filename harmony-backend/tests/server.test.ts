import request from 'supertest';
import { createApp } from '../src/app';
import { ServerService } from '../src/services/server.service';
import type { Express } from 'express';

// ─── Unit tests: slug generation ─────────────────────────────────────────────

describe('ServerService.generateSlug', () => {
  const service = new ServerService();

  it('converts name to lowercase kebab-case', () => {
    expect(service.generateSlug('My Cool Server')).toBe('my-cool-server');
  });

  it('strips special characters', () => {
    expect(service.generateSlug('Game Dev!!! @#$')).toBe('game-dev');
  });

  it('collapses multiple spaces and hyphens', () => {
    expect(service.generateSlug('a   b---c')).toBe('a-b-c');
  });

  it('trims leading and trailing hyphens', () => {
    expect(service.generateSlug(' --hello-- ')).toBe('hello');
  });

  it('handles unicode by stripping non-ascii', () => {
    expect(service.generateSlug('café lounge')).toBe('caf-lounge');
  });

  it('returns empty string for fully special-char names', () => {
    expect(service.generateSlug('!@#$%')).toBe('');
  });
});

// ─── tRPC router integration tests ──────────────────────────────────────────

describe('server tRPC router', () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  it('server.getServers returns a result (even if empty)', async () => {
    const getServersSpy = jest
      .spyOn(ServerService.prototype, 'getServers')
      .mockResolvedValue([]);

    const res = await request(app).get('/trpc/server.getServers');

    expect(res.status).toBe(200);
    expect(res.body.result).toBeDefined();
    expect(getServersSpy).toHaveBeenCalled();

    getServersSpy.mockRestore();
  });

  it('server.createServer requires authentication', async () => {
    const res = await request(app)
      .post('/trpc/server.createServer')
      .send({ name: 'Test Server' })
      .set('Content-Type', 'application/json');
    // tRPC returns 401 for unauthenticated mutations
    expect(res.status).toBe(401);
  });

  it('server.updateServer requires authentication', async () => {
    const res = await request(app)
      .post('/trpc/server.updateServer')
      .send({ id: '00000000-0000-0000-0000-000000000000', name: 'New Name' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(401);
  });

  it('server.deleteServer requires authentication', async () => {
    const res = await request(app)
      .post('/trpc/server.deleteServer')
      .send({ id: '00000000-0000-0000-0000-000000000000' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(401);
  });
});

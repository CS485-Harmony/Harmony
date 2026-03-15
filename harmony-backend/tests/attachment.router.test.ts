/**
 * attachment.router.test.ts — Issue #112
 *
 * Integration tests for POST /api/attachments/upload.
 * Uses mocked auth, storage provider, and attachment service — no DB or disk I/O required.
 */

import request from 'supertest';
import { createApp } from '../src/app';
import type { Express } from 'express';

const VALID_TOKEN = 'valid-test-token';
const TEST_USER_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('../src/services/auth.service', () => ({
  authService: {
    verifyAccessToken: jest.fn((token: string) => {
      if (token === VALID_TOKEN) return { sub: TEST_USER_ID };
      throw new Error('Invalid token');
    }),
  },
}));

// Mock the storage provider so tests don't write to disk
jest.mock('../src/lib/storage', () => ({
  storageProvider: {
    upload: jest.fn().mockResolvedValue({
      url: 'http://localhost:4000/api/attachments/files/uuid-test.png',
      filename: 'uuid-test.png',
    }),
    delete: jest.fn().mockResolvedValue(undefined),
  },
}));

// ─── Tests ────────────────────────────────────────────────────────────────────

let app: Express;

beforeAll(() => {
  app = createApp();
});

describe('POST /api/attachments/upload', () => {
  it('returns 401 when no auth token is provided', async () => {
    const res = await request(app)
      .post('/api/attachments/upload')
      .attach('file', Buffer.from('hello'), { filename: 'test.png', contentType: 'image/png' });

    expect(res.status).toBe(401);
  });

  it('returns 400 when no file is attached', async () => {
    const res = await request(app)
      .post('/api/attachments/upload')
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .send();

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/no file/i);
  });

  it('returns 400 for a disallowed content type', async () => {
    const res = await request(app)
      .post('/api/attachments/upload')
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .attach('file', Buffer.from('#!/bin/bash\nrm -rf /'), {
        filename: 'evil.sh',
        contentType: 'application/x-sh',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/unsupported content type/i);
  });

  it('returns 201 with attachment metadata for a valid image upload', async () => {
    const fileBuffer = Buffer.from('fake-png-data');

    const res = await request(app)
      .post('/api/attachments/upload')
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .attach('file', fileBuffer, { filename: 'photo.png', contentType: 'image/png' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      url: expect.stringContaining('/api/attachments/files/'),
      filename: expect.any(String),
      contentType: 'image/png',
      sizeBytes: fileBuffer.length,
    });
  });

  it('returns 201 for a valid PDF upload', async () => {
    const pdfBuffer = Buffer.from('%PDF-1.4 fake content');

    const res = await request(app)
      .post('/api/attachments/upload')
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .attach('file', pdfBuffer, {
        filename: 'document.pdf',
        contentType: 'application/pdf',
      });

    expect(res.status).toBe(201);
    expect(res.body.contentType).toBe('application/pdf');
  });
});

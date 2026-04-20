/**
 * ATT-1 through ATT-6: Attachment Upload and Retrieval
 * Classification:
 *   ATT-2:           cloud-safe (unauthenticated rejection; no write)
 *   ATT-3, ATT-4,
 *   ATT-6:           cloud-safe when CLOUD_TEST_ACCESS_TOKEN is provisioned
 *                    (validation rejects before storage write)
 *   ATT-1, ATT-5:    local-only (successful uploads create durable objects and
 *                    there is no public cleanup endpoint for shared cloud envs)
 */

import { BACKEND_URL, LOCAL_SEEDS, isCloud, localOnlyDescribe, cloudTokenTest } from './env';
import { login } from './helpers/auth';

describe('Attachments Smoke (cloud-safe)', () => {
  let accessToken = '';

  beforeAll(async () => {
    if (isCloud) {
      accessToken = process.env.CLOUD_TEST_ACCESS_TOKEN ?? '';
      return;
    }

    const tokens = await login(LOCAL_SEEDS.alice.email, LOCAL_SEEDS.alice.password);
    accessToken = tokens.accessToken;
  });

  function buildFormData(content: Buffer | string, filename: string, mimeType: string): FormData {
    const form = new FormData();
    const blobContent = typeof content === 'string' ? content : new Uint8Array(content);
    const blob = new Blob([blobContent], { type: mimeType });
    form.append('file', blob, filename);
    return form;
  }

  function minimalPng(): Buffer {
    // 1x1 transparent PNG (67 bytes)
    return Buffer.from(
      '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c6260000000020001e221bc330000000049454e44ae426082',
      'hex',
    );
  }

  test('ATT-2: upload without authentication returns 401', async () => {
    const form = buildFormData(minimalPng(), 'test.png', 'image/png');
    const res = await fetch(`${BACKEND_URL}/api/attachments/upload`, {
      method: 'POST',
      body: form,
    });
    expect(res.status).toBe(401);
  });

  cloudTokenTest('ATT-3: upload of a disallowed file type returns 400', async () => {
    const form = buildFormData(Buffer.from('MZ'), 'test.exe', 'application/octet-stream');
    const res = await fetch(`${BACKEND_URL}/api/attachments/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error?: string };
    expect(body.error).toBeTruthy();
  });

  cloudTokenTest('ATT-4: upload of a file exceeding 25 MB returns 400 or 413', async () => {
    // 26 MB of zeros declared as PNG (size validation fires before magic-byte check)
    const bigBuffer = Buffer.alloc(26 * 1024 * 1024, 0);
    const form = buildFormData(bigBuffer, 'big.png', 'image/png');
    const res = await fetch(`${BACKEND_URL}/api/attachments/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
    });
    expect([400, 413]).toContain(res.status);
  }, 30000);

  cloudTokenTest('ATT-6: magic-byte mismatch is rejected - text file renamed to .png', async () => {
    const textContent = Buffer.from('This is not a PNG file\n');
    const form = buildFormData(textContent, 'fake.png', 'image/png');
    const res = await fetch(`${BACKEND_URL}/api/attachments/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error?: string };
    expect(body.error).toBeTruthy();
  });
});

localOnlyDescribe('Attachments (local-only)', () => {
  let accessToken: string;

  beforeAll(async () => {
    const tokens = await login(LOCAL_SEEDS.alice.email, LOCAL_SEEDS.alice.password);
    accessToken = tokens.accessToken;
  });

  function buildFormData(content: Buffer | string, filename: string, mimeType: string): FormData {
    const form = new FormData();
    const blobContent = typeof content === 'string' ? content : new Uint8Array(content);
    const blob = new Blob([blobContent], { type: mimeType });
    form.append('file', blob, filename);
    return form;
  }

  function minimalPng(): Buffer {
    // 1x1 transparent PNG (67 bytes)
    return Buffer.from(
      '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c6260000000020001e221bc330000000049454e44ae426082',
      'hex',
    );
  }

  test('ATT-1: authenticated user can upload a valid PNG image', async () => {
    const form = buildFormData(minimalPng(), 'test.png', 'image/png');
    const res = await fetch(`${BACKEND_URL}/api/attachments/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
    });
    expect(res.status).toBe(201);
    const body = (await res.json()) as {
      url?: string;
      filename?: string;
      contentType?: string;
      sizeBytes?: number;
    };
    expect(typeof body.url).toBe('string');
    expect(typeof body.filename).toBe('string');
    expect(body.contentType).toMatch(/image\/png/i);
    expect(typeof body.sizeBytes).toBe('number');
  });

  test('ATT-5: uploaded file is retrievable via the returned URL', async () => {
    const form = buildFormData(minimalPng(), 'retrieve-test.png', 'image/png');
    const uploadRes = await fetch(`${BACKEND_URL}/api/attachments/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
    });
    expect(uploadRes.status).toBe(201);
    const { url } = (await uploadRes.json()) as { url: string };

    const downloadRes = await fetch(url);
    expect(downloadRes.status).toBe(200);
    expect(downloadRes.headers.get('content-type')).toMatch(/image\/png/i);
  });
});

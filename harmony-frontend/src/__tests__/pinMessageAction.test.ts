/**
 * pinMessageAction.test.ts — Issue #236
 *
 * Verifies that pinMessageAction returns a typed error result when the backend
 * refuses with 403 (MEMBER lacking message:pin), instead of letting the
 * TrpcHttpError propagate unhandled and cause Next.js to return a 500.
 *
 * The action is tested in isolation: trpc-client is mocked so no real HTTP
 * calls or Next.js server context is required.
 */

import { TrpcHttpError } from '../lib/trpc-errors';

// ─── Mocks ─────────────────────────────────────────────────────────────────────

const mockTrpcMutate = jest.fn();

jest.mock('../lib/trpc-client', () => ({
  trpcMutate: (...args: unknown[]) => mockTrpcMutate(...args),
}));

// ─── Tests ─────────────────────────────────────────────────────────────────────

import { pinMessageAction } from '../app/actions/pinMessage';

const MESSAGE_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const SERVER_ID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

describe('pinMessageAction — permission error handling (issue #236)', () => {
  beforeEach(() => {
    mockTrpcMutate.mockReset();
  });

  it('returns { error } instead of throwing when the backend returns 403', async () => {
    mockTrpcMutate.mockRejectedValue(
      new TrpcHttpError('message.pinMessage', 403, '{"error":{"code":"FORBIDDEN"}}'),
    );

    // Should resolve, not reject — a thrown error here causes Next.js to 500
    const result = await pinMessageAction(MESSAGE_ID, SERVER_ID);

    expect(result).toEqual(
      expect.objectContaining({ error: expect.any(String) }),
    );
  });

  it('does not suppress unexpected errors (non-403)', async () => {
    mockTrpcMutate.mockRejectedValue(
      new TrpcHttpError('message.pinMessage', 500, 'Internal Server Error'),
    );

    await expect(pinMessageAction(MESSAGE_ID, SERVER_ID)).rejects.toThrow(TrpcHttpError);
  });
});

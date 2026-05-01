import { TRPCError } from '@trpc/server';

const mockRequirePermission = jest.fn();
const mockSendMessage = jest.fn();

jest.mock('../src/services/permission.service', () => ({
  permissionService: {
    requirePermission: (...args: unknown[]) => mockRequirePermission(...args),
  },
}));

jest.mock('../src/services/message.service', () => ({
  messageService: {
    sendMessage: (...args: unknown[]) => mockSendMessage(...args),
  },
}));

import { createCallerFactory, type TRPCContext } from '../src/trpc/init';
import { messageRouter } from '../src/trpc/routers/message.router';

const createCaller = createCallerFactory(messageRouter);

function callerAs(userId: string | null) {
  const ctx: TRPCContext = { userId, ip: '127.0.0.1', userAgent: 'jest' };
  return createCaller(ctx);
}

const VALID_INPUT = {
  serverId: '01cca9d4-77e6-40e3-a94b-9e3a73b8cdc8',
  channelId: '65029c74-f956-4512-86d9-4e0555d760ae',
  content: '',
  attachments: [
    {
      filename: '347325_tiny.mp4',
      url: 'https://cdn.pixabay.com/video/2026/04/17/347325_tiny.mp4',
      contentType: 'video/mp4',
      sizeBytes: 12345,
    },
  ],
};

describe('messageRouter.sendMessage attachment URL validation', () => {
  const originalStorageProvider = process.env.STORAGE_PROVIDER;
  const originalR2PublicUrl = process.env.R2_PUBLIC_URL;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.STORAGE_PROVIDER = 's3';
    process.env.R2_PUBLIC_URL = 'https://uploads.harmony.example';
    mockRequirePermission.mockResolvedValue(undefined);
    mockSendMessage.mockResolvedValue({ id: 'msg-1' });
  });

  afterAll(() => {
    process.env.STORAGE_PROVIDER = originalStorageProvider;
    process.env.R2_PUBLIC_URL = originalR2PublicUrl;
  });

  it('accepts trusted Pixabay CDN URLs for GIF picker video attachments', async () => {
    await expect(callerAs('user-1').sendMessage(VALID_INPUT)).resolves.toEqual({ id: 'msg-1' });
    expect(mockSendMessage).toHaveBeenCalledWith({
      serverId: VALID_INPUT.serverId,
      channelId: VALID_INPUT.channelId,
      authorId: 'user-1',
      content: '',
      attachments: VALID_INPUT.attachments,
    });
  });

  it('rejects lookalike Pixabay origins that only share the prefix text', async () => {
    await expect(
      callerAs('user-1').sendMessage({
        ...VALID_INPUT,
        attachments: [
          {
            ...VALID_INPUT.attachments[0],
            url: 'https://cdn.pixabay.com.evil.example/video/2026/04/17/347325_tiny.mp4',
          },
        ],
      }),
    ).rejects.toMatchObject<Partial<TRPCError>>({
      code: 'BAD_REQUEST',
      message: 'Invalid attachment URL',
    });
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it('still accepts project-owned uploaded attachments', async () => {
    await expect(
      callerAs('user-1').sendMessage({
        ...VALID_INPUT,
        attachments: [
          {
            ...VALID_INPUT.attachments[0],
            url: 'https://uploads.harmony.example/4d4dbfce-1f1f-4ffa-9d24-e23f8f3e723b.mp4',
          },
        ],
      }),
    ).resolves.toEqual({ id: 'msg-1' });
  });
});

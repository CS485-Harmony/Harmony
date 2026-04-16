import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma';

type Client = Prisma.TransactionClient | typeof prisma;

export const attachmentRepository = {
  findMessageForAttachmentList(messageId: string, client: Client = prisma) {
    return client.message.findUnique({
      where: { id: messageId },
      select: {
        id: true,
        isDeleted: true,
        channel: { select: { serverId: true } },
      },
    });
  },

  findByMessageId(messageId: string, client: Client = prisma) {
    return client.attachment.findMany({
      where: { messageId },
      select: {
        id: true,
        filename: true,
        url: true,
        contentType: true,
        // sizeBytes (BigInt) intentionally excluded — tRPC default JSON
        // transformer cannot serialize BigInt.
      },
    });
  },
};

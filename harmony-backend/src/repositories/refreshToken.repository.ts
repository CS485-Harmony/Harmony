import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma';

type Client = Prisma.TransactionClient | typeof prisma;

export const refreshTokenRepository = {
  create(data: Prisma.RefreshTokenUncheckedCreateInput, client: Client = prisma) {
    return client.refreshToken.create({ data });
  },

  revokeByHash(tokenHash: string, client: Client = prisma) {
    return client.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  },

  rotateByHash(tokenHash: string, client: Client = prisma) {
    return client.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
      data: { revokedAt: new Date() },
    });
  },
};

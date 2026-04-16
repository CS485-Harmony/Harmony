import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma';

type Client = Prisma.TransactionClient | typeof prisma;

export const PUBLIC_PROFILE_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
  publicProfile: true,
  status: true,
  createdAt: true,
} as const;

export const SELF_PROFILE_SELECT = {
  id: true,
  email: true,
  username: true,
  displayName: true,
  avatarUrl: true,
  publicProfile: true,
  status: true,
  createdAt: true,
} as const;

export const userRepository = {
  findById(id: string, client: Client = prisma) {
    return client.user.findUnique({ where: { id }, select: PUBLIC_PROFILE_SELECT });
  },

  findSelf(id: string, client: Client = prisma) {
    return client.user.findUnique({ where: { id }, select: SELF_PROFILE_SELECT });
  },

  findByEmail(email: string, client: Client = prisma) {
    return client.user.findUnique({ where: { email } });
  },

  findByEmailSelect(email: string, client: Client = prisma) {
    return client.user.findUnique({ where: { email }, select: { passwordHash: true } });
  },

  findByUsername(username: string, client: Client = prisma) {
    return client.user.findUnique({ where: { username } });
  },

  create(data: Prisma.UserCreateInput, client: Client = prisma) {
    return client.user.create({ data });
  },

  upsert(
    where: Prisma.UserWhereUniqueInput,
    update: Prisma.UserUpdateInput,
    create: Prisma.UserCreateInput,
    client: Client = prisma,
  ) {
    return client.user.upsert({ where, update, create });
  },

  update(id: string, data: Prisma.UserUpdateInput, client: Client = prisma) {
    return client.user.update({ where: { id }, select: SELF_PROFILE_SELECT, data });
  },
};

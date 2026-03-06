import { Server } from '@prisma/client';
import { prisma } from '../lib/prisma';

export class ServerRepository {
  async findById(id: string): Promise<Server | null> {
    return prisma.server.findUnique({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Server | null> {
    return prisma.server.findUnique({ where: { slug } });
  }

  async findAll(): Promise<Server[]> {
    return prisma.server.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    iconUrl?: string;
    isPublic?: boolean;
    ownerId: string;
  }): Promise<Server> {
    return prisma.server.create({ data });
  }

  async update(
    id: string,
    data: Partial<Pick<Server, 'name' | 'slug' | 'description' | 'iconUrl' | 'isPublic'>>,
  ): Promise<Server> {
    return prisma.server.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Server> {
    return prisma.server.delete({ where: { id } });
  }

  async slugExists(slug: string): Promise<boolean> {
    const count = await prisma.server.count({ where: { slug } });
    return count > 0;
  }

  async incrementMemberCount(id: string, delta: number): Promise<Server> {
    return prisma.server.update({
      where: { id },
      data: { memberCount: { increment: delta } },
    });
  }

  async getPublicInfo(serverId: string): Promise<Server | null> {
    return prisma.server.findFirst({
      where: { id: serverId, isPublic: true },
    });
  }
}

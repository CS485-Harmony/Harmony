import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma';

type Client = Prisma.TransactionClient | typeof prisma;

export type MetaTagCreateData = Prisma.GeneratedMetaTagsUncheckedCreateInput;

export type GeneratedFieldsUpdate = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string | null;
  twitterCard: string;
  keywords: string;
  structuredData: Prisma.InputJsonValue;
  contentHash: string;
  needsRegeneration: boolean;
  generatedAt: Date;
  schemaVersion?: number;
};

export const metaTagRepository = {
  findByChannelId(channelId: string, client: Client = prisma) {
    return client.generatedMetaTags.findUnique({ where: { channelId } });
  },

  create(data: MetaTagCreateData, client: Client = prisma) {
    return client.generatedMetaTags.create({ data });
  },

  /**
   * Persist custom override fields as-is. Does NOT sanitize inputs.
   * Callers must go through metaTagService.setCustomOverrides to satisfy AC-8 / §12.3.
   */
  updateCustomOverrides(
    channelId: string,
    overrides: {
      customTitle?: string | null;
      customDescription?: string | null;
      customOgImage?: string | null;
    },
    client: Client = prisma,
  ) {
    return client.generatedMetaTags.update({
      where: { channelId },
      data: overrides,
    });
  },

  /**
   * Persist background-generated tag fields.
   * AC-7: Never overwrites non-null customTitle or customDescription.
   * Uses a conditional UPDATE where-clause so the constraint is enforced at the DB level.
   */
  saveGeneratedFields(channelId: string, fields: GeneratedFieldsUpdate, client: Client = prisma) {
    return client.generatedMetaTags
      .updateMany({
        where: {
          channelId,
          customTitle: null,
          customDescription: null,
        },
        data: {
          title: fields.title,
          description: fields.description,
          ogTitle: fields.ogTitle,
          ogDescription: fields.ogDescription,
          twitterCard: fields.twitterCard,
          keywords: fields.keywords,
          structuredData: fields.structuredData,
          contentHash: fields.contentHash,
          needsRegeneration: fields.needsRegeneration,
          generatedAt: fields.generatedAt,
          ...(fields.ogImage !== undefined ? { ogImage: fields.ogImage } : {}),
          ...(fields.schemaVersion !== undefined ? { schemaVersion: fields.schemaVersion } : {}),
        },
      })
      .then(({ count }) => count);
  },

  upsert(
    where: Prisma.GeneratedMetaTagsWhereUniqueInput,
    update: Prisma.GeneratedMetaTagsUpdateInput,
    create: MetaTagCreateData,
    client: Client = prisma,
  ) {
    return client.generatedMetaTags.upsert({ where, update, create });
  },

  deleteByChannelId(channelId: string, client: Client = prisma) {
    return client.generatedMetaTags.delete({ where: { channelId } });
  },
};

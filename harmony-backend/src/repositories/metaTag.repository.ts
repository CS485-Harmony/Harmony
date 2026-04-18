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
  structuredData: Record<string, unknown>;
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
   * Uses a conditional UPDATE so the constraint is enforced at the DB level.
   */
  saveGeneratedFields(channelId: string, fields: GeneratedFieldsUpdate, client: Client = prisma) {
    return (client as typeof prisma).$executeRaw`
      UPDATE "generated_meta_tags"
      SET
        title               = ${fields.title},
        description         = ${fields.description},
        og_title            = ${fields.ogTitle},
        og_description      = ${fields.ogDescription},
        og_image            = ${fields.ogImage ?? null},
        twitter_card        = ${fields.twitterCard},
        keywords            = ${fields.keywords},
        structured_data     = ${fields.structuredData}::jsonb,
        content_hash        = ${fields.contentHash},
        needs_regeneration  = ${fields.needsRegeneration},
        generated_at        = ${fields.generatedAt},
        schema_version      = COALESCE(${fields.schemaVersion ?? null}, schema_version),
        updated_at          = NOW()
      WHERE channel_id = ${channelId}::uuid
        AND custom_title IS NULL
        AND custom_description IS NULL
    `;
  },

  upsert(data: MetaTagCreateData, client: Client = prisma) {
    const { channelId, ...rest } = data;
    return client.generatedMetaTags.upsert({
      where: { channelId },
      create: data,
      update: rest,
    });
  },

  deleteByChannelId(channelId: string, client: Client = prisma) {
    return client.generatedMetaTags.delete({ where: { channelId } });
  },
};

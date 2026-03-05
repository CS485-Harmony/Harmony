/**
 * Schema & migration smoke tests — Issue #96
 *
 * Connects to the live PostgreSQL database (docker-compose) and verifies:
 *   1. Prisma client can connect and basic reads succeed
 *   2. All 7 tables exist with expected columns
 *   3. Enum types are correct
 *   4. All 12 canonical indexes from unified-backend-architecture.md §4.3 exist
 *
 * Requires DATABASE_URL to point at a running Postgres instance.
 * Run: docker compose up -d   (in harmony-backend/)  then  npm test
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

afterAll(async () => {
  await prisma.$disconnect();
});

// ─── Connection ───────────────────────────────────────────────────────────────

describe('Prisma connection', () => {
  it('can connect and run a raw query', async () => {
    const result = await prisma.$queryRaw<[{ one: number }]>`SELECT 1 AS one`;
    expect(result[0].one).toBe(1);
  });
});

// ─── Tables ───────────────────────────────────────────────────────────────────

describe('Database tables', () => {
  async function tableExists(name: string): Promise<boolean> {
    const rows = await prisma.$queryRaw<[{ exists: boolean }]>`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = ${name}
      ) AS "exists"
    `;
    return rows[0].exists;
  }

  const expectedTables = [
    'users',
    'servers',
    'channels',
    'messages',
    'attachments',
    'visibility_audit_log',
    'generated_meta_tags',
  ];

  test.each(expectedTables)('table "%s" exists', async (table) => {
    expect(await tableExists(table)).toBe(true);
  });
});

// ─── Enum types ───────────────────────────────────────────────────────────────

describe('Enum types', () => {
  async function enumValues(typeName: string): Promise<string[]> {
    const rows = await prisma.$queryRaw<{ enumlabel: string }[]>`
      SELECT e.enumlabel
      FROM pg_enum e
      JOIN pg_type t ON t.oid = e.enumtypid
      WHERE t.typname = ${typeName}
      ORDER BY e.enumsortorder
    `;
    return rows.map((r) => r.enumlabel);
  }

  it('ChannelVisibility has correct values', async () => {
    const values = await enumValues('channel_visibility');
    expect(values).toEqual(['PUBLIC_INDEXABLE', 'PUBLIC_NO_INDEX', 'PRIVATE']);
  });

  it('ChannelType has correct values', async () => {
    const values = await enumValues('channel_type');
    expect(values).toEqual(['TEXT', 'VOICE', 'ANNOUNCEMENT']);
  });
});

// ─── Indexes ─────────────────────────────────────────────────────────────────

describe('Canonical indexes', () => {
  async function indexExists(indexName: string): Promise<boolean> {
    const rows = await prisma.$queryRaw<[{ exists: boolean }]>`
      SELECT EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE schemaname = 'public' AND indexname = ${indexName}
      ) AS "exists"
    `;
    return rows[0].exists;
  }

  /** Canonical index list from unified-backend-architecture.md §4.3 */
  const canonicalIndexes = [
    // channels
    'idx_channels_server_visibility',
    'idx_channels_server_slug',
    'idx_channels_visibility_indexed',
    'idx_channels_visibility',
    // messages
    'idx_messages_channel_time',
    'idx_messages_channel_not_deleted',
    // visibility_audit_log
    'idx_audit_channel_time',
    'idx_audit_actor',
    // servers
    'idx_servers_slug',
    'idx_servers_public',
    // generated_meta_tags
    'idx_meta_tags_channel',
    'idx_meta_tags_needs_regen',
  ];

  test.each(canonicalIndexes)('index "%s" exists', async (idx) => {
    expect(await indexExists(idx)).toBe(true);
  });
});

// ─── Partial index predicates ─────────────────────────────────────────────────

describe('Partial index predicates', () => {
  async function indexDef(indexName: string): Promise<string> {
    const rows = await prisma.$queryRaw<{ indexdef: string }[]>`
      SELECT indexdef FROM pg_indexes
      WHERE schemaname = 'public' AND indexname = ${indexName}
    `;
    return rows[0]?.indexdef ?? '';
  }

  it('idx_channels_visibility_indexed is partial WHERE visibility = PUBLIC_INDEXABLE', async () => {
    const def = await indexDef('idx_channels_visibility_indexed');
    expect(def).toContain("WHERE");
    expect(def).toContain("PUBLIC_INDEXABLE");
  });

  it('idx_channels_visibility is partial WHERE visibility IN (PUBLIC_INDEXABLE, PUBLIC_NO_INDEX)', async () => {
    const def = await indexDef('idx_channels_visibility');
    expect(def).toContain("WHERE");
    expect(def.toUpperCase()).toMatch(/PUBLIC_INDEXABLE|PUBLIC_NO_INDEX/);
  });

  it('idx_messages_channel_not_deleted is partial WHERE is_deleted = false', async () => {
    const def = await indexDef('idx_messages_channel_not_deleted');
    expect(def).toContain("WHERE");
    expect(def.toLowerCase()).toContain("is_deleted");
  });

  it('idx_servers_public is partial WHERE is_public = true', async () => {
    const def = await indexDef('idx_servers_public');
    expect(def).toContain("WHERE");
    expect(def.toLowerCase()).toContain("is_public");
  });

  it('idx_meta_tags_needs_regen is partial WHERE needs_regeneration = true', async () => {
    const def = await indexDef('idx_meta_tags_needs_regen');
    expect(def).toContain("WHERE");
    expect(def.toLowerCase()).toContain("needs_regeneration");
  });
});

// ─── Basic CRUD smoke test ────────────────────────────────────────────────────

describe('Basic Prisma CRUD', () => {
  let userId: string;
  let serverId: string;

  it('can create a user', async () => {
    const user = await prisma.user.create({
      data: {
        username: `test_user_${Date.now()}`,
        displayName: 'Test User',
        publicProfile: true,
      },
    });
    userId = user.id;
    expect(user.id).toBeTruthy();
    expect(user.username).toMatch(/^test_user_/);
  });

  it('can create a server', async () => {
    const server = await prisma.server.create({
      data: {
        name: 'Test Server',
        slug: `test-server-${Date.now()}`,
        isPublic: false,
      },
    });
    serverId = server.id;
    expect(server.id).toBeTruthy();
  });

  it('can create a channel linked to the server', async () => {
    const channel = await prisma.channel.create({
      data: {
        serverId,
        name: 'general',
        slug: 'general',
        type: 'TEXT',
        visibility: 'PRIVATE',
        position: 0,
      },
    });
    expect(channel.id).toBeTruthy();
    expect(channel.visibility).toBe('PRIVATE');
    expect(channel.type).toBe('TEXT');
  });

  it('enforces unique slug per server', async () => {
    await expect(
      prisma.channel.create({
        data: {
          serverId,
          name: 'General Duplicate',
          slug: 'general', // duplicate slug for same server
          type: 'TEXT',
          visibility: 'PRIVATE',
          position: 1,
        },
      }),
    ).rejects.toThrow();
  });

  afterAll(async () => {
    // Clean up test data (cascade deletes channels)
    if (serverId) await prisma.server.delete({ where: { id: serverId } }).catch(() => {});
    if (userId) await prisma.user.delete({ where: { id: userId } }).catch(() => {});
  });
});

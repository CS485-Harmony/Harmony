import { ChannelType, ChannelVisibility, Prisma, PrismaClient, RoleType } from '@prisma/client';
import { createHash } from 'node:crypto';
import rawSnapshot from './mock-seed-data.json';

type RawUser = {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  status: string;
  role: string;
};

type RawServer = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  ownerId: string;
  description: string;
  bannerUrl?: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
};

type RawChannel = {
  id: string;
  serverId: string;
  name: string;
  slug: string;
  type: string;
  visibility: string;
  topic?: string;
  position: number;
  createdAt: string;
};

type RawMessage = {
  id: string;
  channelId: string;
  authorId: string;
  content: string;
  timestamp: string;
};

export type RawSnapshot = {
  users: RawUser[];
  servers: RawServer[];
  channels: RawChannel[];
  messages: RawMessage[];
};

type BuiltMockSeedData = {
  users: Prisma.UserCreateManyInput[];
  servers: Prisma.ServerCreateManyInput[];
  channels: Prisma.ChannelCreateManyInput[];
  messages: Prisma.MessageCreateManyInput[];
  serverMembers: Prisma.ServerMemberCreateManyInput[];
};

type SeedCounts = {
  reconciled: {
    users: number;
    servers: number;
    channels: number;
    messages: number;
    serverMembers: number;
  };
};

const snapshot = rawSnapshot as RawSnapshot;

const VALID_CHANNEL_TYPES = new Set<string>(Object.values(ChannelType));
const VALID_CHANNEL_VISIBILITIES = new Set<string>(Object.values(ChannelVisibility));
const MOCK_SEED_NAMESPACE = 'harmony:mock-seed';

// user-001 (alice_admin) is the only loginable mock account — keep in sync with
// the assertion in mock-seed.test.ts that looks up this user by username.
const ALICE_ADMIN_HASH =
  'v1$00112233445566778899aabbccddeeff$$2b$12$7dsAhX/sljIDw06Uqxs/WeqI0pnUJn.IcWyoSbO29nuvXbepdwGrq';

export function legacyIdToUuid(legacyId: string): string {
  const hash = createHash('sha1').update(`${MOCK_SEED_NAMESPACE}:${legacyId}`).digest();
  const bytes = Buffer.from(hash.subarray(0, 16));
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = bytes.toString('hex');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-');
}

export function assertMockSeedAllowed(env: NodeJS.ProcessEnv = process.env): void {
  if (env.NODE_ENV === 'production' && env.HARMONY_ALLOW_MOCK_SEED !== 'true') {
    throw new Error(
      'Mock seed is disabled in production. Set HARMONY_ALLOW_MOCK_SEED=true to opt in intentionally.',
    );
  }
}

function parseDate(value: string, fieldName: string): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid ${fieldName} date: ${value}`);
  }

  return date;
}

function parseChannelType(value: string): ChannelType {
  if (!VALID_CHANNEL_TYPES.has(value)) {
    throw new Error(`Unsupported channel type in mock snapshot: ${value}`);
  }

  return value as ChannelType;
}

function parseChannelVisibility(value: string): ChannelVisibility {
  if (!VALID_CHANNEL_VISIBILITIES.has(value)) {
    throw new Error(`Unsupported channel visibility in mock snapshot: ${value}`);
  }

  return value as ChannelVisibility;
}

function buildIdMap(legacyIds: Iterable<string>): Map<string, string> {
  const mapping = new Map<string, string>();
  for (const legacyId of legacyIds) {
    mapping.set(legacyId, legacyIdToUuid(legacyId));
  }

  return mapping;
}

export function buildMockSeedData(raw: RawSnapshot = snapshot): BuiltMockSeedData {
  const userIds = buildIdMap(raw.users.map((user) => user.id));
  const serverIds = buildIdMap(raw.servers.map((server) => server.id));
  const channelIds = buildIdMap(raw.channels.map((channel) => channel.id));
  const messageIds = buildIdMap(raw.messages.map((message) => message.id));

  const channelsByLegacyId = new Map(raw.channels.map((channel) => [channel.id, channel] as const));
  const nonPrivateServerIds = new Set(
    raw.channels
      .filter((channel) => parseChannelVisibility(channel.visibility) !== ChannelVisibility.PRIVATE)
      .map((channel) => channel.serverId),
  );

  // user-001 is alice_admin — the only loginable mock account (see ALICE_ADMIN_HASH above).
  // All other mock users keep '!' (invalid hash — login intentionally disabled).
  const users = raw.users.map<Prisma.UserCreateManyInput>((user, index) => ({
    id: userIds.get(user.id)!,
    username: user.username,
    displayName: user.displayName,
    avatarUrl: user.avatar,
    publicProfile: true,
    email: `${user.username}@mock.harmony.test`,
    passwordHash: user.id === 'user-001' ? ALICE_ADMIN_HASH : '!',
    createdAt: new Date(Date.UTC(2024, 0, 1, 0, index, 0)),
  }));

  const servers = raw.servers.map<Prisma.ServerCreateManyInput>((server) => {
    if (!userIds.has(server.ownerId)) {
      throw new Error(`Server ${server.id} references unknown snapshot owner ${server.ownerId}`);
    }

    return {
      id: serverIds.get(server.id)!,
      name: server.name,
      slug: server.slug,
      description: server.description,
      iconUrl: server.icon,
      isPublic: nonPrivateServerIds.has(server.id),
      memberCount: server.memberCount,
      ownerId: userIds.get(server.ownerId)!,
      createdAt: parseDate(server.createdAt, `server ${server.id} createdAt`),
    };
  });

  const channels = raw.channels.map<Prisma.ChannelCreateManyInput>((channel) => {
    const type = parseChannelType(channel.type);
    const visibility = parseChannelVisibility(channel.visibility);
    const createdAt = parseDate(channel.createdAt, `channel ${channel.id} createdAt`);

    if (type === ChannelType.VOICE && visibility === ChannelVisibility.PUBLIC_INDEXABLE) {
      throw new Error(`VOICE channel ${channel.id} cannot be PUBLIC_INDEXABLE`);
    }

    if (!serverIds.has(channel.serverId)) {
      throw new Error(`Channel ${channel.id} references unknown server ${channel.serverId}`);
    }

    return {
      id: channelIds.get(channel.id)!,
      serverId: serverIds.get(channel.serverId)!,
      name: channel.name,
      slug: channel.slug,
      type,
      visibility,
      topic: channel.topic ?? null,
      position: channel.position,
      indexedAt: visibility === ChannelVisibility.PUBLIC_INDEXABLE ? createdAt : null,
      createdAt,
      updatedAt: createdAt,
    };
  });

  const messages = raw.messages.map<Prisma.MessageCreateManyInput>((message) => {
    const channel = channelsByLegacyId.get(message.channelId);
    if (!channel) {
      throw new Error(`Message ${message.id} references unknown channel ${message.channelId}`);
    }

    if (!userIds.has(message.authorId)) {
      throw new Error(`Message ${message.id} references unknown author ${message.authorId}`);
    }

    if (parseChannelType(channel.type) === ChannelType.VOICE) {
      throw new Error(`Message ${message.id} cannot target voice channel ${message.channelId}`);
    }

    return {
      id: messageIds.get(message.id)!,
      channelId: channelIds.get(message.channelId)!,
      authorId: userIds.get(message.authorId)!,
      content: message.content,
      createdAt: parseDate(message.timestamp, `message ${message.id} timestamp`),
      editedAt: null,
      isDeleted: false,
    };
  });

  // Derive ServerMember records from message authorship and server ownership.
  // Server owners get OWNER role; message authors in a server get MEMBER role.
  // The channelId → serverId map lets us look up server from message's channelId.
  const channelToServerLegacy = new Map<string, string>(
    raw.channels.map((c) => [c.id, c.serverId]),
  );

  // Key: `${legacyServerId}:${legacyUserId}` → member record
  const membershipMap = new Map<string, Prisma.ServerMemberCreateManyInput>();

  for (const server of raw.servers) {
    const key = `${server.id}:${server.ownerId}`;
    membershipMap.set(key, {
      userId: userIds.get(server.ownerId)!,
      serverId: serverIds.get(server.id)!,
      role: 'OWNER' as RoleType,
      joinedAt: parseDate(server.createdAt, `server ${server.id} createdAt`),
    });
  }

  for (const message of raw.messages) {
    const legacyServerId = channelToServerLegacy.get(message.channelId);
    if (!legacyServerId) continue;
    const key = `${legacyServerId}:${message.authorId}`;
    if (!membershipMap.has(key)) {
      membershipMap.set(key, {
        userId: userIds.get(message.authorId)!,
        serverId: serverIds.get(legacyServerId)!,
        role: 'MEMBER' as RoleType,
        joinedAt: parseDate(message.timestamp, `message ${message.id} timestamp`),
      });
    }
  }

  const serverMembers = Array.from(membershipMap.values());

  return { users, servers, channels, messages, serverMembers };
}

async function getPrismaClient(): Promise<PrismaClient> {
  return (await import('../db/prisma')).prisma;
}

export async function assertNoUniqueConflicts(
  prismaClient: PrismaClient,
  raw: RawSnapshot,
  data: BuiltMockSeedData,
): Promise<void> {
  const expectedUserIdsByUsername = new Map(
    raw.users.map((user) => [user.username, legacyIdToUuid(user.id)] as const),
  );
  const expectedUserIdsByEmail = new Map<string, string>(
    raw.users.map((user) => [`${user.username}@mock.harmony.test`, legacyIdToUuid(user.id)]),
  );

  const [existingUsers, existingUsersByEmail] = await Promise.all([
    prismaClient.user.findMany({
      where: { username: { in: raw.users.map((user) => user.username) } },
      select: { id: true, username: true },
    }),
    prismaClient.user.findMany({
      where: { email: { in: raw.users.map((user) => `${user.username}@mock.harmony.test`) } },
      select: { id: true, email: true },
    }),
  ]);

  const conflictingUsers = existingUsers.filter(
    (user) => expectedUserIdsByUsername.get(user.username) !== user.id,
  );
  const conflictingUsersByEmail = existingUsersByEmail.filter(
    (user) => expectedUserIdsByEmail.get(user.email) !== user.id,
  );

  const expectedServerIdsBySlug = new Map(
    raw.servers.map((server) => [server.slug, legacyIdToUuid(server.id)] as const),
  );
  const existingServers = await prismaClient.server.findMany({
    where: { slug: { in: raw.servers.map((server) => server.slug) } },
    select: { id: true, slug: true },
  });

  const conflictingServers = existingServers.filter(
    (server) => expectedServerIdsBySlug.get(server.slug) !== server.id,
  );

  const existingChannels = await prismaClient.channel.findMany({
    where: {
      OR: data.channels.map((channel) => ({
        serverId: channel.serverId,
        slug: channel.slug,
      })),
    },
    select: { id: true, serverId: true, slug: true },
  });

  const expectedChannelIdsByKey = new Map(
    data.channels.map((channel) => [`${channel.serverId}:${channel.slug}`, channel.id] as const),
  );
  const conflictingChannels = existingChannels.filter(
    (channel) => expectedChannelIdsByKey.get(`${channel.serverId}:${channel.slug}`) !== channel.id,
  );

  if (
    conflictingUsers.length === 0 &&
    conflictingUsersByEmail.length === 0 &&
    conflictingServers.length === 0 &&
    conflictingChannels.length === 0
  ) {
    return;
  }

  const details = [
    ...conflictingUsers.map(
      (user) => `user username "${user.username}" already exists with a different id (${user.id})`,
    ),
    ...conflictingUsersByEmail.map(
      (user) => `user email "${user.email}" already exists with a different id (${user.id})`,
    ),
    ...conflictingServers.map(
      (server) => `server slug "${server.slug}" already exists with a different id (${server.id})`,
    ),
    ...conflictingChannels.map(
      (channel) =>
        `channel "${channel.slug}" for server ${channel.serverId} already exists with a different id (${channel.id})`,
    ),
  ];

  throw new Error(
    `Mock seed conflicts with existing unique rows. Clear or reconcile these rows before seeding:\n- ${details.join('\n- ')}`,
  );
}

export async function seedMockData(db?: PrismaClient, allowMockSeed = false): Promise<SeedCounts> {
  if (!allowMockSeed) {
    assertMockSeedAllowed();
  }
  const data = buildMockSeedData();
  const prismaClient = db ?? (await getPrismaClient());

  // Note: intentional pre-flight check; not atomic with the upserts below.
  // This is a TOCTOU trade-off acceptable for a dev/seed tool.
  await assertNoUniqueConflicts(prismaClient, snapshot, data);

  await prismaClient.$transaction(async (tx) => {
    await Promise.all(
      data.users.map((user) =>
        tx.user.upsert({
          where: { id: user.id },
          update: {
            username: user.username,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl,
            publicProfile: user.publicProfile,
            passwordHash: user.passwordHash,
            createdAt: user.createdAt,
          },
          create: user,
        }),
      ),
    );

    await Promise.all(
      data.servers.map((server) =>
        tx.server.upsert({
          where: { id: server.id },
          update: {
            name: server.name,
            slug: server.slug,
            description: server.description,
            iconUrl: server.iconUrl,
            isPublic: server.isPublic,
            memberCount: server.memberCount,
            createdAt: server.createdAt,
          },
          create: server,
        }),
      ),
    );

    await Promise.all(
      data.channels.map((channel) =>
        tx.channel.upsert({
          where: { id: channel.id },
          update: {
            serverId: channel.serverId,
            name: channel.name,
            slug: channel.slug,
            type: channel.type,
            visibility: channel.visibility,
            topic: channel.topic,
            position: channel.position,
            indexedAt: channel.indexedAt,
            createdAt: channel.createdAt,
            updatedAt: channel.updatedAt,
          },
          create: channel,
        }),
      ),
    );

    await Promise.all(
      data.messages.map((message) =>
        tx.message.upsert({
          where: { id: message.id },
          update: {
            channelId: message.channelId,
            authorId: message.authorId,
            content: message.content,
            createdAt: message.createdAt,
            editedAt: message.editedAt,
            isDeleted: message.isDeleted,
          },
          create: message,
        }),
      ),
    );

    await Promise.all(
      data.serverMembers.map((member) =>
        tx.serverMember.upsert({
          where: { userId_serverId: { userId: member.userId, serverId: member.serverId } },
          update: { role: member.role, joinedAt: member.joinedAt },
          create: member,
        }),
      ),
    );
  });

  return {
    reconciled: {
      users: data.users.length,
      servers: data.servers.length,
      channels: data.channels.length,
      messages: data.messages.length,
      serverMembers: data.serverMembers.length,
    },
  };
}

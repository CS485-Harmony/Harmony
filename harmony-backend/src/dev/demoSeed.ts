import { seedMockData } from './mockSeed';

export function assertDemoSeedAllowed(env: NodeJS.ProcessEnv = process.env): void {
  if (env.HARMONY_DEMO_MODE !== 'true') {
    throw new Error(
      'Demo seed is disabled. Set HARMONY_DEMO_MODE=true to run the demo seed path.',
    );
  }
}

async function getPrismaClient() {
  return (await import('../db/prisma')).prisma;
}

async function main(): Promise<void> {
  assertDemoSeedAllowed();

  const prisma = await getPrismaClient();
  try {
    const counts = await seedMockData(prisma, true);
    console.log(
      `Reconciled demo dataset (${counts.reconciled.users} users, ${counts.reconciled.servers} servers, ${counts.reconciled.channels} channels, ${counts.reconciled.messages} messages).`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  void main()
    .catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
}

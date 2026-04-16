import { seedMockData } from './mockSeed';
import { createLogger } from '../lib/logger';

const logger = createLogger({ component: 'demo-seed' });

export function assertDemoSeedAllowed(env: NodeJS.ProcessEnv = process.env): void {
  if (env.HARMONY_DEMO_MODE !== 'true') {
    throw new Error('Demo seed is disabled. Set HARMONY_DEMO_MODE=true to run the demo seed path.');
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
    logger.info(
      {
        users: counts.reconciled.users,
        servers: counts.reconciled.servers,
        channels: counts.reconciled.channels,
        messages: counts.reconciled.messages,
      },
      'Reconciled demo dataset',
    );
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  void main().catch((error: unknown) => {
    logger.error({ err: error }, 'Demo seed failed');
    process.exitCode = 1;
  });
}

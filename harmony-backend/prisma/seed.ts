// Prisma db seed entry point. Lives in prisma/ per Prisma convention so it is
// excluded from production bundles. Delegates all logic to the exported
// seedMockData function — no business logic lives here.
import { prisma } from '../src/db/prisma';
import { seedMockData } from '../src/dev/mockSeed';

async function main(): Promise<void> {
  try {
    const counts = await seedMockData(prisma);
    console.log(
      `Reconciled mock dataset (${counts.reconciled.users} users, ${counts.reconciled.servers} servers, ${counts.reconciled.channels} channels, ${counts.reconciled.messages} messages).`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});

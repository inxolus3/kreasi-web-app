import { afterAll, beforeEach } from 'vitest';
import prisma from '../utils/prisma';

const testDatabaseUrl = process.env.TEST_DATABASE_URL;
const integrationEnabled = Boolean(testDatabaseUrl);

if (integrationEnabled && !/test/i.test(testDatabaseUrl!)) {
  throw new Error('TEST_DATABASE_URL must point to a database whose name contains "test".');
}

export const usingTestDatabase = integrationEnabled;
export const cleanDatabase = async () => {
  if (!integrationEnabled) return;
  await prisma.$transaction([
    prisma.post.deleteMany(), prisma.category.deleteMany(), prisma.tag.deleteMany(),
    prisma.billboard.deleteMany(), prisma.setting.deleteMany(), prisma.image.deleteMany(), prisma.user.deleteMany(),
  ]);
};

beforeEach(async () => cleanDatabase());
afterAll(async () => { if (integrationEnabled) await prisma.$disconnect(); });

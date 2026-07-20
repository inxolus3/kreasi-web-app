import bcrypt from 'bcryptjs';
import type { Role } from '@prisma/client';
let sequence = 0;
export const buildUser = async (overrides: Partial<{ email: string; name: string; password: string; role: Role }> = {}) => {
  sequence += 1;
  return { email: overrides.email ?? `user-${sequence}@example.test`, name: overrides.name ?? `Test User ${sequence}`, password: await bcrypt.hash(overrides.password ?? 'Password123!', 10), role: overrides.role ?? 'USER' };
};
export const createUser = buildUser;

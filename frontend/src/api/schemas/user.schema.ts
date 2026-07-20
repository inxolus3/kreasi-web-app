/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Mirrors backend/src/routes/users.ts request validation
 */

import { z } from 'zod';

export const userRoleSchema = z.enum(['ADMIN', 'USER']);

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: userRoleSchema.optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: userRoleSchema.optional(),
  password: z.string().min(6).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { UserRole } from './user';

export interface AuthUser {
  id: number;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  user: Pick<AuthUser, 'id' | 'email' | 'role'>;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

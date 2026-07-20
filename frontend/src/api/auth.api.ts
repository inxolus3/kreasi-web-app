/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { authClient } from './client';
import type { ApiSuccessResponse } from './types/common';
import type { AuthUser, LoginPayload, LoginResponseData, RegisterPayload } from './types/auth';
import { loginSchema, registerSchema } from './schemas/auth.schema';

export const authApi = {
  login: async (credentials: LoginPayload): Promise<ApiSuccessResponse<LoginResponseData>> => {
    loginSchema.parse(credentials);
    const response = await authClient.post<ApiSuccessResponse<LoginResponseData>>('/login', credentials);
    return response.data;
  },

  logout: async (): Promise<ApiSuccessResponse<{ message: string }>> => {
    const response = await authClient.post<ApiSuccessResponse<{ message: string }>>('/logout');
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiSuccessResponse<AuthUser>> => {
    const response = await authClient.get<ApiSuccessResponse<AuthUser>>('/me');
    return response.data;
  },

  register: async (data: RegisterPayload): Promise<ApiSuccessResponse<AuthUser>> => {
    registerSchema.parse(data);
    const response = await authClient.post<ApiSuccessResponse<AuthUser>>('/register', data);
    return response.data;
  },
};

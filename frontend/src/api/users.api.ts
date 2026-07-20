/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiV1Client } from './client';
import type { ApiMessageResponse, ApiSuccessResponse } from './types/common';
import type { CreateUserPayload, UpdateUserPayload, User } from './types/user';
import { createUserSchema, updateUserSchema } from './schemas/user.schema';

export type { User, UserRole, CreateUserPayload, UpdateUserPayload } from './types/user';

export const usersApi = {
  getUsers: async (): Promise<ApiSuccessResponse<User[]>> => {
    const response = await apiV1Client.get<ApiSuccessResponse<User[]>>('/users');
    return response.data;
  },

  createUser: async (payload: CreateUserPayload): Promise<ApiSuccessResponse<User>> => {
    createUserSchema.parse(payload);
    const response = await apiV1Client.post<ApiSuccessResponse<User>>('/users', payload);
    return response.data;
  },

  updateUser: async (id: number, payload: UpdateUserPayload): Promise<ApiSuccessResponse<User>> => {
    updateUserSchema.parse(payload);
    const response = await apiV1Client.put<ApiSuccessResponse<User>>(`/users/${id}`, payload);
    return response.data;
  },

  deleteUser: async (id: number): Promise<ApiMessageResponse> => {
    const response = await apiV1Client.delete<ApiMessageResponse>(`/users/${id}`);
    return response.data;
  },
};

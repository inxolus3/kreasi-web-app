/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { authClient } from './client';

export const authApi = {
  login: async (credentials: any) => {
    const response = await authClient.post('/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await authClient.post('/logout');
    localStorage.removeItem('kreasi_auth_token');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await authClient.get('/me');
    return response.data;
  },

  getMe: async () => {
    const response = await authClient.get('/me');
    return response.data;
  },

  register: async (data: any) => {
    const response = await authClient.post('/register', data);
    return response.data;
  },
};


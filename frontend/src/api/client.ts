/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const getHostUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    if (url.endsWith('/api/v1')) {
      return url.substring(0, url.length - 7);
    }
    return '';
  }
};

const hostUrl = getHostUrl(apiBaseUrl);

// 1. Client for /api/v1 (Billboards, Settings, Uploads)
export const apiV1Client = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Client for /api/auth
export const authClient = axios.create({
  baseURL: hostUrl ? `${hostUrl}/api/auth` : '/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Client for /api/blog
export const blogClient = axios.create({
  baseURL: hostUrl ? `${hostUrl}/api/blog` : '/api/blog',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to add JWT Auth tokens automatically
const addAuthToken = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

[apiV1Client, authClient, blogClient].forEach((client) => {
  client.interceptors.request.use(addAuthToken);
});

const handleResponseError = (error: AxiosError) => {
  const url = error.config?.url || 'unknown';
  safeLogError(`API Error ${url}`, error);
  return Promise.reject(error);
};

apiV1Client.interceptors.response.use((res) => res, handleResponseError);
authClient.interceptors.response.use((res) => res, handleResponseError);
blogClient.interceptors.response.use((res) => res, handleResponseError);

export default apiV1Client;
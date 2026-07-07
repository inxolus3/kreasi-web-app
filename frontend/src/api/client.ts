/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios, { InternalAxiosRequestConfig } from 'axios';

// Dynamically use VITE_API_URL or default to localhost
const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

/**
 * Extracts the base host from the API URL to correctly map
 * backend endpoint prefixes like /api/auth and /api/blog
 */
const getHostUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    // Fallback for relative paths
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
  const token = localStorage.getItem('kreasi_auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

apiV1Client.interceptors.request.use(addAuthToken);
authClient.interceptors.request.use(addAuthToken);
blogClient.interceptors.request.use(addAuthToken);

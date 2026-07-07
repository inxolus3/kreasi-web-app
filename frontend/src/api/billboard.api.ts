/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiV1Client } from './client';
import { Billboard } from '../types';

export interface BillboardListResponse {
  status: string;
  data: Billboard[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BillboardDetailResponse {
  status: string;
  data: Billboard;
}

export const billboardApi = {
  getBillboards: async (params?: {
    search?: string;
    province?: string;
    city?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<BillboardListResponse> => {
    const response = await apiV1Client.get('/public/billboards', { params });
    return response.data;
  },

  getBillboardBySlug: async (slug: string): Promise<BillboardDetailResponse> => {
    const response = await apiV1Client.get(`/public/billboards/${slug}`);
    return response.data;
  },

  getCities: async (): Promise<{ status: string; data: string[] }> => {
    const response = await apiV1Client.get('/public/billboards/cities');
    return response.data;
  },

  getTypes: async (): Promise<{ status: string; data: string[] }> => {
    const response = await apiV1Client.get('/public/billboards/types');
    return response.data;
  },

  getLightings: async (): Promise<{ status: string; data: string[] }> => {
    const response = await apiV1Client.get('/public/billboards/lightings');
    return response.data;
  },
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiV1Client } from './client';
import type {
  AdminBillboardListResponse,
  AdminBillboardResponse,
  BillboardDetailResponse,
  BillboardListResponse,
  CreateBillboardPayload,
  GetBillboardsParams,
  UpdateBillboardPayload,
} from './types/billboard';
import type { ApiSuccessResponse } from './types/common';
import {
  createBillboardSchema,
  getBillboardsQuerySchema,
  updateBillboardSchema,
} from './schemas/billboard.schema';

export type {
  AdminBillboard,
  BillboardDetail,
  BillboardMarker,
  CreateBillboardPayload,
  UpdateBillboardPayload,
} from './types/billboard';

export const billboardApi = {
  getBillboards: async (params?: GetBillboardsParams): Promise<BillboardListResponse> => {
    const queryParams = params ? getBillboardsQuerySchema.parse(params) : undefined;
    const response = await apiV1Client.get<BillboardListResponse>('/public/billboards', { params: queryParams });
    return response.data;
  },

  getBillboardBySlug: async (slug: string): Promise<BillboardDetailResponse> => {
    const response = await apiV1Client.get<BillboardDetailResponse>(`/public/billboards/${slug}`);
    return response.data;
  },

  getCities: async (): Promise<ApiSuccessResponse<string[]>> => {
    const response = await apiV1Client.get<ApiSuccessResponse<string[]>>('/public/billboards/cities');
    return response.data;
  },

  getTypes: async (): Promise<ApiSuccessResponse<string[]>> => {
    const response = await apiV1Client.get<ApiSuccessResponse<string[]>>('/public/billboards/types');
    return response.data;
  },

  getLightings: async (): Promise<ApiSuccessResponse<string[]>> => {
    const response = await apiV1Client.get<ApiSuccessResponse<string[]>>('/public/billboards/lightings');
    return response.data;
  },

  getAdminBillboards: async (params?: GetBillboardsParams): Promise<AdminBillboardListResponse> => {
    const queryParams = params ? getBillboardsQuerySchema.parse(params) : undefined;
    const response = await apiV1Client.get<AdminBillboardListResponse>('/admin/billboards', { params: queryParams });
    return response.data;
  },

  getAdminBillboardById: async (id: number): Promise<AdminBillboardResponse> => {
    const response = await apiV1Client.get<AdminBillboardResponse>(`/admin/billboards/${id}`);
    return response.data;
  },

  createBillboard: async (payload: CreateBillboardPayload): Promise<AdminBillboardResponse> => {
    createBillboardSchema.parse(payload);
    const response = await apiV1Client.post<AdminBillboardResponse>('/admin/billboards', payload);
    return response.data;
  },

  updateBillboard: async (id: number, payload: UpdateBillboardPayload): Promise<AdminBillboardResponse> => {
    updateBillboardSchema.parse(payload);
    const response = await apiV1Client.patch<AdminBillboardResponse>(`/admin/billboards/${id}`, payload);
    return response.data;
  },

  deleteBillboard: async (id: number): Promise<void> => {
    await apiV1Client.delete(`/admin/billboards/${id}`);
  },
};

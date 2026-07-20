/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiSuccessResponse<T> {
  status: 'success';
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface ApiMessageResponse {
  status: 'success';
  message: string;
}

export interface ApiFailResponse {
  status: 'fail' | 'error';
  message: string;
  errors?: unknown;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiFailResponse;

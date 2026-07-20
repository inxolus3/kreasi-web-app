/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { PaginationMeta } from './common';

export type BillboardType = 'Baliho' | 'Billboard' | 'Neon Box' | 'Spanduk';
export type BillboardOrientation = 'Satu Sisi' | 'Dua Sisi' | 'Tiga Sisi' | 'Empat Sisi';
export type BillboardLighting = 'Back Light' | 'Front Light' | 'Non Light' | 'LED';

/** Subset returned by GET /api/v1/public/billboards */
export interface BillboardMarker {
  id: number;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  province: string;
  city: string;
  district: string;
  address: string;
  traffic?: string | null;
  thumbnail: string | null;
  thumbnailId: number | null;
  type: string;
  lighting: string;
  gallery: string[];
  galleryImageIds: number[];
}

/** Returned by GET /api/v1/public/billboards/:slug */
export interface BillboardDetail extends BillboardMarker {
  size: string;
  orientation: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/** Full record from admin endpoints */
export interface AdminBillboard extends BillboardDetail {
  code: string;
  status: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  ogImage?: string | null;
}

export interface BillboardListResponse {
  status: 'success';
  data: BillboardMarker[];
}

export interface AdminBillboardListResponse {
  status: 'success';
  data: AdminBillboard[];
  meta?: PaginationMeta;
}

export interface BillboardDetailResponse {
  status: 'success';
  data: BillboardDetail;
}

export interface AdminBillboardResponse {
  status: 'success';
  data: AdminBillboard;
}

export interface GetBillboardsParams {
  search?: string;
  province?: string;
  city?: string;
  district?: string;
  type?: BillboardType;
  orientation?: BillboardOrientation;
  lighting?: BillboardLighting;
  page?: number;
  limit?: number;
}

export interface CreateBillboardPayload {
  code: string;
  name: string;
  slug: string;
  province: string;
  city: string;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  size: string;
  type: BillboardType;
  orientation: BillboardOrientation;
  lighting: BillboardLighting;
  traffic?: string | null;
  status?: string;
  description?: string | null;
  thumbnailImageId?: number | null;
  galleryImageIds?: number[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  ogImage?: string | null;
}

export type UpdateBillboardPayload = Partial<CreateBillboardPayload>;

export interface UpdateBillboardStatusPayload {
  status: string;
}

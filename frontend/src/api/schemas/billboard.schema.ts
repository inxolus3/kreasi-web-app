/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Mirrors backend/src/modules/billboards/billboard.validation.ts
 */

import { z } from 'zod';

const BillboardTypeEnum = z.enum(['Baliho', 'Billboard', 'Neon Box', 'Spanduk']);
const BillboardOrientationEnum = z.enum(['Satu Sisi', 'Dua Sisi', 'Tiga Sisi', 'Empat Sisi']);
const BillboardLightingEnum = z.enum(['Back Light', 'Front Light', 'Non Light', 'LED']);

export const createBillboardSchema = z.object({
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  province: z.string().min(1).max(100),
  city: z.string().min(1).max(100),
  district: z.string().min(1).max(100),
  address: z.string().min(1).max(1000),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  size: z.string().min(1).max(50),
  type: BillboardTypeEnum,
  orientation: BillboardOrientationEnum,
  lighting: BillboardLightingEnum,
  traffic: z.string().max(255).optional().nullable(),
  status: z.string().max(100).optional(),
  description: z.string().max(5000).optional().nullable(),
  thumbnailImageId: z.number().int().positive().optional().nullable(),
  galleryImageIds: z.array(z.number().int().positive()).optional(),
  metaTitle: z.string().max(255).optional().nullable(),
  metaDescription: z.string().max(5000).optional().nullable(),
  metaKeywords: z.string().max(500).optional().nullable(),
  ogImage: z.string().max(1000).optional().nullable(),
});

export const updateBillboardSchema = createBillboardSchema.partial();

export const updateBillboardStatusSchema = z.object({
  status: z.string().min(1).max(100),
});

export const getBillboardsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  search: z.string().max(100).optional(),
  province: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  type: BillboardTypeEnum.optional(),
  orientation: BillboardOrientationEnum.optional(),
  lighting: BillboardLightingEnum.optional(),
});

export type CreateBillboardInput = z.infer<typeof createBillboardSchema>;
export type UpdateBillboardInput = z.infer<typeof updateBillboardSchema>;
export type GetBillboardsQueryInput = z.infer<typeof getBillboardsQuerySchema>;

import { z } from 'zod';

const BillboardStatusSchema = z.string().min(1).max(100);
const BillboardTypeEnum = z.enum(['Baliho', 'Billboard']);
const BillboardOrientationEnum = z.enum(['Satu Sisi', 'Dua Sisi']);
const BillboardLightingEnum = z.enum(['Back Light', 'Front Light', 'Non Light']);

export const createBillboardSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Code is required').max(50),
    name: z.string().min(1, 'Name is required').max(255),
    slug: z.string().min(1, 'Slug is required').max(255),
    province: z.string().min(1, 'Province is required').max(100),
    city: z.string().min(1, 'City is required').max(100),
    district: z.string().min(1, 'District is required').max(100),
    address: z.string().min(1, 'Address is required').max(1000),
    latitude: z.coerce.number({ invalid_type_error: 'Latitude must be a number' }),
    longitude: z.coerce.number({ invalid_type_error: 'Longitude must be a number' }),
    size: z.string().min(1, 'Size is required').max(50),
    type: BillboardTypeEnum,
    orientation: BillboardOrientationEnum,
    lighting: BillboardLightingEnum,
    traffic: z.string().max(255).optional().nullable(),
    price: z.coerce.number().nonnegative('Price must be a non-negative number'),
    status: BillboardStatusSchema.optional().default('AVAILABLE'),
    description: z.string().max(5000).optional().nullable(),
    thumbnail: z.string().max(1000).optional().nullable(),
    gallery: z.array(z.string().max(1000)).optional(),
    availableFrom: z.preprocess((val) => (val === '' ? undefined : val), z.coerce.date().optional()),
    availableUntil: z.preprocess((val) => (val === '' ? undefined : val), z.coerce.date().optional()),
  }),
});

export const updateBillboardSchema = z.object({
  body: z.object({
    code: z.string().min(1).max(50).optional(),
    name: z.string().min(1).max(255).optional(),
    slug: z.string().min(1).max(255).optional(),
    province: z.string().min(1).max(100).optional(),
    city: z.string().min(1).max(100).optional(),
    district: z.string().min(1).max(100).optional(),
    address: z.string().min(1).max(1000).optional(),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    size: z.string().min(1).max(50).optional(),
    type: BillboardTypeEnum.optional(),
    orientation: BillboardOrientationEnum.optional(),
    lighting: BillboardLightingEnum.optional(),
    traffic: z.string().max(255).optional().nullable(),
    price: z.coerce.number().nonnegative().optional(),
    status: BillboardStatusSchema.optional(),
    description: z.string().max(5000).optional().nullable(),
    thumbnail: z.string().max(1000).optional().nullable(),
    gallery: z.array(z.string().max(1000)).optional(),
    availableFrom: z.preprocess((val) => (val === '' ? undefined : val), z.coerce.date().optional()),
    availableUntil: z.preprocess((val) => (val === '' ? undefined : val), z.coerce.date().optional()),
  }),
});

export const updateBillboardStatusSchema = z.object({
  body: z.object({
    status: BillboardStatusSchema,
  }),
});

export const getBillboardsQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).max(6).optional(),
    limit: z.string().regex(/^\d+$/).max(3).optional(),
    search: z.string().max(100).optional(),
    province: z.string().max(100).optional(),
    city: z.string().max(100).optional(),
    district: z.string().max(100).optional(),
    status: BillboardStatusSchema.optional(),
    type: BillboardTypeEnum.optional(),
    orientation: BillboardOrientationEnum.optional(),
    lighting: BillboardLightingEnum.optional(),
    minPrice: z.string().regex(/^\d+(\.\d+)?$/).max(15).optional(),
    maxPrice: z.string().regex(/^\d+(\.\d+)?$/).max(15).optional(),
  }),
});

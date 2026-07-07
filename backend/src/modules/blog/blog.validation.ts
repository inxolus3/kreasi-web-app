import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    slug: z.string().min(1).max(100),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    slug: z.string().min(1).max(100).optional(),
  }),
});

export const createTagSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    slug: z.string().min(1).max(100),
  }),
});

export const updateTagSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    slug: z.string().min(1).max(100).optional(),
  }),
});

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255),
    slug: z.string().min(1).max(255),
    content: z.string().min(1).max(100000), // Protect against memory exhaustion
    thumbnail: z.string().url().max(1000).optional().nullable(),
    gallery: z.array(z.string().url().max(1000)).optional(),
    metaTitle: z.string().max(255).optional().nullable(),
    metaDescription: z.string().max(1000).optional().nullable(),
    status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
    featured: z.boolean().optional(),
    categoryId: z.number().int().positive(),
    tagIds: z.array(z.number().int().positive()).optional(),
  }),
});

export const updatePostSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    slug: z.string().min(1).max(255).optional(),
    content: z.string().min(1).max(100000).optional(),
    thumbnail: z.string().url().max(1000).optional().nullable(),
    gallery: z.array(z.string().url().max(1000)).optional(),
    metaTitle: z.string().max(255).optional().nullable(),
    metaDescription: z.string().max(1000).optional().nullable(),
    status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
    featured: z.boolean().optional(),
    categoryId: z.number().int().positive().optional(),
    tagIds: z.array(z.number().int().positive()).optional(),
  }),
});

export const getPostsQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).max(6).optional(),
    limit: z.string().regex(/^\d+$/).max(3).optional(),
    search: z.string().max(100).optional(),
    categoryId: z.string().regex(/^\d+$/).max(10).optional(),
    tagId: z.string().regex(/^\d+$/).max(10).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
    featured: z.string().max(5).optional(), // 'true' or 'false'
  })
});

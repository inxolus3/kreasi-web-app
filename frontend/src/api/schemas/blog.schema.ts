/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Mirrors backend/src/modules/blog/blog.validation.ts
 */

import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  content: z.string().min(1).max(100000),
  thumbnailImageId: z.number().int().positive().optional().nullable(),
  galleryImageIds: z.array(z.number().int().positive()).optional(),
  metaTitle: z.string().max(255).optional().nullable(),
  metaDescription: z.string().max(1000).optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  featured: z.boolean().optional(),
  categoryId: z.number().int().positive(),
  tagIds: z.array(z.number().int().positive()).optional(),
  authorId: z.number().int().positive().optional(),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).optional(),
  content: z.string().min(1).max(100000).optional(),
  thumbnailImageId: z.number().int().positive().optional().nullable(),
  galleryImageIds: z.array(z.number().int().positive()).optional(),
  metaTitle: z.string().max(255).optional().nullable(),
  metaDescription: z.string().max(1000).optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  featured: z.boolean().optional(),
  categoryId: z.number().int().positive().optional(),
  tagIds: z.array(z.number().int().positive()).optional(),
  authorId: z.number().int().positive().optional(),
});

export const getPostsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  search: z.string().max(100).optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  tagId: z.coerce.number().int().positive().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  featured: z.coerce.boolean().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type GetPostsQueryInput = z.infer<typeof getPostsQuerySchema>;

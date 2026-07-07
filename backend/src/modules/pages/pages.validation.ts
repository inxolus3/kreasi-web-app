import { z } from 'zod';

export const createPageSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(255),
    slug: z.string().min(1, 'Slug is required').max(255),
    metaTitle: z.string().max(255).optional().nullable(),
    metaDescription: z.string().max(1000).optional().nullable(),
    featuredImage: z.string().max(1000).optional().nullable(),
  }),
});

export const updatePageSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    slug: z.string().min(1).max(255).optional(),
    metaTitle: z.string().max(255).optional().nullable(),
    metaDescription: z.string().max(1000).optional().nullable(),
    featuredImage: z.string().max(1000).optional().nullable(),
    status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']).optional(),
  }),
});

export const saveBuilderSchema = z.object({
  body: z.object({
    sections: z.array(z.any()).max(100, 'Too many sections in a single page'),
  }),
});

export const updateThemeSettingSchema = z.object({
  body: z.object({
    key: z.string().min(1).max(100),
    value: z.string().max(100000), // Max JSON styling block size
  }),
});

export const createGlobalComponentSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255),
    type: z.string().min(1).max(100),
    props: z.string().max(50000).optional(),
    styles: z.string().max(50000).optional(),
  }),
});

export const updateGlobalComponentSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    props: z.string().max(50000).optional(),
    styles: z.string().max(50000).optional(),
  }),
});

export const getPagesQuerySchema = z.object({
  query: z.object({
    skip: z.string().regex(/^\d+$/).max(6).optional(),
    take: z.string().regex(/^\d+$/).max(3).optional(),
    search: z.string().max(100).optional(),
    status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']).optional(),
  }),
});

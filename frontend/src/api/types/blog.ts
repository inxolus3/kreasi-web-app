/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { UserRole } from './user';
import type { PaginationMeta } from './common';

export type PostStatus = 'DRAFT' | 'PUBLISHED';

export interface BlogAuthor {
  id: number;
  name: string | null;
  role: UserRole;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail: string | null;
  thumbnailId: number | null;
  gallery: string[];
  galleryImageIds: number[];
  metaTitle: string | null;
  metaDescription: string | null;
  status: PostStatus;
  featured: boolean;
  categoryId: number;
  authorId: number;
  createdAt: string;
  updatedAt?: string;
  category?: BlogCategory;
  author?: BlogAuthor;
}

export interface BlogListResponse {
  status: 'success';
  data: BlogPost[];
  meta?: PaginationMeta;
}

export interface BlogPostResponse {
  status: 'success';
  data: BlogPost;
}

export interface GetPostsParams {
  search?: string;
  categoryId?: number;
  tagId?: number;
  status?: PostStatus;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateBlogPayload {
  title: string;
  slug: string;
  content: string;
  categoryId: number;
  status?: PostStatus;
  featured?: boolean;
  thumbnailImageId?: number | null;
  galleryImageIds?: number[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  tagIds?: number[];
  /** Ignored by backend; author is taken from the authenticated user */
  authorId?: number;
}

export interface UpdateBlogPayload {
  title?: string;
  slug?: string;
  content?: string;
  status?: PostStatus;
  featured?: boolean;
  categoryId?: number;
  thumbnailImageId?: number | null;
  galleryImageIds?: number[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  tagIds?: number[];
}

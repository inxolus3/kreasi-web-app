/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { blogClient } from './client';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string | null;
  gallery: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  status: 'DRAFT' | 'PUBLISHED';
  featured: boolean;
  categoryId: number;
  authorId: number;
  createdAt: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  author?: {
    id: number;
    username: string;
    role: string;
  };
}

export interface BlogResponse {
  status: string;
  data: BlogPost[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SingleBlogResponse {
  status: string;
  data: BlogPost;
}

export const blogApi = {
  getPosts: async (params?: {
    search?: string;
    categoryId?: number;
    tagId?: number;
    status?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
  }): Promise<BlogResponse> => {
    // Map status: we usually only want PUBLISHED posts on the public blog
    const queryParams = { status: 'PUBLISHED', ...params };
    const response = await blogClient.get('/posts', { params: queryParams });
    return response.data;
  },

  getPostBySlug: async (slug: string): Promise<SingleBlogResponse> => {
    const response = await blogClient.get(`/posts/slug/${slug}`);
    return response.data;
  },
};

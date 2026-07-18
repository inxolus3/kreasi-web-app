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

export interface CreateBlogPayload {
  title: string;
  slug: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED';
  featured: boolean;
  categoryId: number;
  authorId: number;
  thumbnail?: string | null;
  gallery?: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export interface UpdateBlogPayload {
  title?: string;
  slug?: string;
  content?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  featured?: boolean;
  categoryId?: number;
  thumbnail?: string | null;
  gallery?: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
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
    const queryParams = { status: 'PUBLISHED', ...params };
    const response = await blogClient.get('/posts', { params: queryParams });
    return response.data;
  },

  getPostBySlug: async (slug: string): Promise<SingleBlogResponse> => {
    const response = await blogClient.get(`/posts/slug/${slug}`);
    return response.data;
  },

  // ✅ FIX: Tambahin createPost
  createPost: async (payload: CreateBlogPayload): Promise<SingleBlogResponse> => {
    const response = await blogClient.post('/posts', payload);
    return response.data;
  },

  // ✅ FIX: Tambahin updatePost (PATCH)
  updatePost: async (id: number, payload: UpdateBlogPayload): Promise<SingleBlogResponse> => {
    const response = await blogClient.patch(`/posts/${id}`, payload);
    return response.data;
  },

  // ✅ FIX: Tambahin deletePost
  deletePost: async (id: number): Promise<{ status: string; message: string }> => {
    const response = await blogClient.delete(`/posts/${id}`);
    return response.data;
  },
};
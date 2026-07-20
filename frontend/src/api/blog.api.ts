/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { blogClient } from './client';
import type {
  BlogListResponse,
  BlogPostResponse,
  CreateBlogPayload,
  GetPostsParams,
  UpdateBlogPayload,
} from './types/blog';
import type { ApiMessageResponse } from './types/common';
import { createPostSchema, getPostsQuerySchema, updatePostSchema } from './schemas/blog.schema';

export type { BlogPost, BlogAuthor, BlogCategory, CreateBlogPayload, UpdateBlogPayload } from './types/blog';

export const blogApi = {
  getPosts: async (params?: GetPostsParams): Promise<BlogListResponse> => {
    const queryParams = getPostsQuerySchema.parse({ status: 'PUBLISHED', ...params });
    const response = await blogClient.get<BlogListResponse>('/posts', { params: queryParams });
    return response.data;
  },

  getAllPosts: async (params?: GetPostsParams): Promise<BlogListResponse> => {
    const queryParams = params ? getPostsQuerySchema.parse(params) : undefined;
    const response = await blogClient.get<BlogListResponse>('/posts', { params: queryParams });
    return response.data;
  },

  getPostBySlug: async (slug: string): Promise<BlogPostResponse> => {
    const response = await blogClient.get<BlogPostResponse>(`/posts/slug/${slug}`);
    return response.data;
  },

  getPostById: async (id: number): Promise<BlogPostResponse> => {
    const response = await blogClient.get<BlogPostResponse>(`/posts/${id}`);
    return response.data;
  },

  createPost: async (payload: CreateBlogPayload): Promise<BlogPostResponse> => {
    createPostSchema.parse(payload);
    const response = await blogClient.post<BlogPostResponse>('/posts', payload);
    return response.data;
  },

  updatePost: async (id: number, payload: UpdateBlogPayload): Promise<BlogPostResponse> => {
    updatePostSchema.parse(payload);
    const response = await blogClient.patch<BlogPostResponse>(`/posts/${id}`, payload);
    return response.data;
  },

  deletePost: async (id: number): Promise<ApiMessageResponse> => {
    const response = await blogClient.delete<ApiMessageResponse>(`/posts/${id}`);
    return response.data;
  },
};

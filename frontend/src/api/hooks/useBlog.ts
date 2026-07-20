/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useQuery } from '@tanstack/react-query';
import { blogApi } from '../blog.api';
import type { GetPostsParams } from '../types/blog';

export const blogKeys = {
  all: ['blogPosts'] as const,
  list: (params?: GetPostsParams) => [...blogKeys.all, 'list', params] as const,
  adminList: (params?: GetPostsParams) => [...blogKeys.all, 'admin', params] as const,
  detail: (slug: string) => [...blogKeys.all, 'detail', slug] as const,
};

export function useBlogPosts(params?: GetPostsParams) {
  return useQuery({
    queryKey: blogKeys.list(params),
    queryFn: () => blogApi.getPosts(params),
  });
}

export function useAdminBlogPosts(params?: GetPostsParams) {
  return useQuery({
    queryKey: blogKeys.adminList(params),
    queryFn: () => blogApi.getAllPosts(params),
  });
}

export function useBlogPostDetail(slug: string | null) {
  return useQuery({
    queryKey: blogKeys.detail(slug ?? ''),
    queryFn: () => blogApi.getPostBySlug(slug!),
    enabled: !!slug,
  });
}

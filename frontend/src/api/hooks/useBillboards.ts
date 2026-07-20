/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useQuery } from '@tanstack/react-query';
import { billboardApi } from '../billboard.api';
import type { GetBillboardsParams } from '../types/billboard';

export const billboardKeys = {
  all: ['billboards'] as const,
  list: (params?: GetBillboardsParams) => [...billboardKeys.all, 'list', params] as const,
  adminList: (params?: GetBillboardsParams) => [...billboardKeys.all, 'admin', params] as const,
  detail: (slug: string) => [...billboardKeys.all, 'detail', slug] as const,
  cities: () => [...billboardKeys.all, 'cities'] as const,
  types: () => [...billboardKeys.all, 'types'] as const,
  lightings: () => [...billboardKeys.all, 'lightings'] as const,
};

export function usePublicBillboards(params?: GetBillboardsParams) {
  return useQuery({
    queryKey: billboardKeys.list(params),
    queryFn: () => billboardApi.getBillboards(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

export function useAdminBillboards(params?: GetBillboardsParams) {
  return useQuery({
    queryKey: billboardKeys.adminList(params),
    queryFn: () => billboardApi.getAdminBillboards(params),
  });
}

export function useBillboardDetail(slug: string | null) {
  return useQuery({
    queryKey: billboardKeys.detail(slug ?? ''),
    queryFn: () => billboardApi.getBillboardBySlug(slug!),
    enabled: !!slug,
  });
}

export function useBillboardCities() {
  return useQuery({
    queryKey: billboardKeys.cities(),
    queryFn: () => billboardApi.getCities(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useBillboardTypes() {
  return useQuery({
    queryKey: billboardKeys.types(),
    queryFn: () => billboardApi.getTypes(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useBillboardLightings() {
  return useQuery({
    queryKey: billboardKeys.lightings(),
    queryFn: () => billboardApi.getLightings(),
    staleTime: 10 * 60 * 1000,
  });
}

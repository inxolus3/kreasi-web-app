/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '../settings.api';

export const settingsKeys = {
  all: ['siteSettings'] as const,
  detail: () => [...settingsKeys.all, 'detail'] as const,
  group: (group: string) => [...settingsKeys.all, 'group', group] as const,
};

export function useSettings() {
  return useQuery({
    queryKey: settingsKeys.detail(),
    queryFn: () => settingsApi.getSettings(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSettingsByGroup(group: string) {
  return useQuery({
    queryKey: settingsKeys.group(group),
    queryFn: () => settingsApi.getSettingsByGroup(group),
    enabled: !!group,
  });
}

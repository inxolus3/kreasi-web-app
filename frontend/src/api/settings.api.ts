/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiV1Client } from './client';
import type { SettingsResponse, SettingsData, UpdateSettingsPayload } from './types/settings';
import { updateSettingsSchema } from './schemas/settings.schema';

export type { SettingsData, UpdateSettingsPayload } from './types/settings';

export const settingsApi = {
  getSettings: async (): Promise<SettingsResponse> => {
    const response = await apiV1Client.get<SettingsResponse>('/public/settings');
    return response.data;
  },

  getSettingsByGroup: async (group: string): Promise<SettingsResponse> => {
    const response = await apiV1Client.get<SettingsResponse>(`/public/settings/${group}`);
    return response.data;
  },

  updateSettings: async (payload: UpdateSettingsPayload): Promise<SettingsResponse> => {
    updateSettingsSchema.parse(payload);
    const response = await apiV1Client.patch<SettingsResponse>('/admin/settings', payload);
    return response.data;
  },
};

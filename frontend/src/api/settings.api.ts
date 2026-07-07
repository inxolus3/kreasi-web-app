/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiV1Client } from './client';

export interface SettingsData {
  siteName: string;
  siteDescription: string;
  siteLogo: string;
  siteFavicon: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  socialFacebook: string;
  socialInstagram: string;
  socialTwitter: string;
  officeAddress: string;
  officeMapIframe: string;
  footerCopyright: string;
  footerDisclaimer: string;
  maintenanceMode: string;
}

export interface SettingsResponse {
  status: string;
  data: SettingsData;
}

export const settingsApi = {
  getSettings: async (): Promise<SettingsResponse> => {
    const response = await apiV1Client.get('/public/settings');
    return response.data;
  },
};

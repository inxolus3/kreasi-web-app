/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  maintenanceMode: 'true' | 'false' | string;
}

export type UpdateSettingsPayload = Partial<SettingsData>;

export interface SettingsResponse {
  status: 'success';
  data: SettingsData;
}

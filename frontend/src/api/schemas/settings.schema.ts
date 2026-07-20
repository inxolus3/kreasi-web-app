/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Mirrors backend/src/modules/settings/setting.validation.ts
 */

import { z } from 'zod';

export const updateSettingsSchema = z.object({
  siteName: z.string().min(1).max(100).optional(),
  siteDescription: z.string().max(500).optional(),
  siteLogo: z.string().url().max(1000).optional().nullable().or(z.literal('')),
  siteFavicon: z.string().url().max(1000).optional().nullable().or(z.literal('')),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
  metaKeywords: z.string().max(500).optional(),
  googleAnalyticsId: z.string().max(50).optional(),
  googleTagManagerId: z.string().max(50).optional(),
  contactEmail: z.string().email().max(255).optional().nullable().or(z.literal('')),
  contactPhone: z.string().max(30).optional(),
  contactWhatsapp: z.string().max(30).optional(),
  socialFacebook: z.string().url().max(1000).optional().nullable().or(z.literal('')),
  socialInstagram: z.string().url().max(1000).optional().nullable().or(z.literal('')),
  socialTwitter: z.string().url().max(1000).optional().nullable().or(z.literal('')),
  officeAddress: z.string().max(1000).optional(),
  officeMapIframe: z.string().max(5000).optional(),
  footerCopyright: z.string().max(255).optional(),
  footerDisclaimer: z.string().max(1000).optional(),
  maintenanceMode: z.coerce.string().transform((val) => val.toLowerCase()).pipe(z.enum(['true', 'false'])).optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;

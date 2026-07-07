import { z } from 'zod';

export const updateSettingsSchema = z.object({
  body: z.object({
    // Website Identity
    siteName: z.string().min(1, 'Site name is required').max(100).optional(),
    siteDescription: z.string().max(500).optional(),
    siteLogo: z.string().url('Site logo must be a valid URL').max(1000).optional().nullable().or(z.literal('')),
    siteFavicon: z.string().url('Favicon must be a valid URL').max(1000).optional().nullable().or(z.literal('')),

    // SEO
    metaTitle: z.string().max(255).optional(),
    metaDescription: z.string().max(500).optional(),
    metaKeywords: z.string().max(500).optional(),

    // Analytics
    googleAnalyticsId: z.string().max(50).optional(),
    googleTagManagerId: z.string().max(50).optional(),

    // Contact
    contactEmail: z.string().email('Contact email must be a valid email').max(255).optional().nullable().or(z.literal('')),
    contactPhone: z.string().max(30).optional(),
    contactWhatsapp: z.string().max(30).optional(),

    // Social Media
    socialFacebook: z.string().url('Facebook link must be a valid URL').max(1000).optional().nullable().or(z.literal('')),
    socialInstagram: z.string().url('Instagram link must be a valid URL').max(1000).optional().nullable().or(z.literal('')),
    socialTwitter: z.string().url('Twitter link must be a valid URL').max(1000).optional().nullable().or(z.literal('')),

    // Office Address
    officeAddress: z.string().max(1000).optional(),
    officeMapIframe: z.string().max(5000).optional(),

    // Footer
    footerCopyright: z.string().max(255).optional(),
    footerDisclaimer: z.string().max(1000).optional(),

    // General Settings
    maintenanceMode: z.coerce.string().transform((val) => val.toLowerCase()).pipe(z.enum(['true', 'false'])).optional(),
  }),
});

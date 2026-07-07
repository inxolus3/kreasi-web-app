import { SettingRepository } from './setting.repository';

export interface SettingDefinition {
  value: string;
  group: string;
}

export const DEFAULT_SETTINGS: Record<string, SettingDefinition> = {
  // Website Identity
  siteName: { value: 'CMS Portal', group: 'identity' },
  siteDescription: { value: 'Robust Admin and Content Management System', group: 'identity' },
  siteLogo: { value: '', group: 'identity' },
  siteFavicon: { value: '', group: 'identity' },

  // SEO
  metaTitle: { value: 'CMS Portal - Home', group: 'seo' },
  metaDescription: { value: 'Explore professional content and managed billboards.', group: 'seo' },
  metaKeywords: { value: 'cms, billboard, platform, ad, portal', group: 'seo' },

  // Analytics
  googleAnalyticsId: { value: 'UA-00000000-0', group: 'analytics' },
  googleTagManagerId: { value: 'GTM-0000000', group: 'analytics' },

  // Contact
  contactEmail: { value: 'info@example.com', group: 'contact' },
  contactPhone: { value: '+6281234567890', group: 'contact' },
  contactWhatsapp: { value: 'https://wa.me/6281234567890', group: 'contact' },

  // Social Media
  socialFacebook: { value: 'https://facebook.com', group: 'social' },
  socialInstagram: { value: 'https://instagram.com', group: 'social' },
  socialTwitter: { value: 'https://twitter.com', group: 'social' },

  // Office Address
  officeAddress: { value: 'Sudirman Avenue No. 42, Jakarta, Indonesia', group: 'address' },
  officeMapIframe: { value: '', group: 'address' },

  // Footer
  footerCopyright: { value: '© 2026 CMS Portal. All Rights Reserved.', group: 'footer' },
  footerDisclaimer: { value: 'Disclaimer: Prices and availability of billboards are subject to change without prior notice.', group: 'footer' },

  // General Settings
  maintenanceMode: { value: 'false', group: 'general' },
};

export class SettingService {
  private settingRepository: SettingRepository;

  constructor() {
    this.settingRepository = new SettingRepository();
  }

  /**
   * Helper to format a list of db settings as a flat key-value object
   */
  private formatSettings(dbSettings: any[]): Record<string, string> {
    const settingsMap: Record<string, string> = {};
    
    // Set system-wide defaults first
    for (const [key, def] of Object.entries(DEFAULT_SETTINGS)) {
      settingsMap[key] = def.value;
    }

    // Override with DB values
    for (const s of dbSettings) {
      settingsMap[s.key] = s.value;
    }

    return settingsMap;
  }

  /**
   * Fetches all settings, merged with defaults
   */
  async getAllSettings(): Promise<Record<string, string>> {
    const dbSettings = await this.settingRepository.findMany();
    return this.formatSettings(dbSettings);
  }

  /**
   * Fetches settings in a particular group, merged with defaults
   */
  async getSettingsByGroup(group: string): Promise<Record<string, string>> {
    const dbSettings = await this.settingRepository.findByGroup(group);
    
    const settingsMap: Record<string, string> = {};
    
    // Filter defaults for this group
    for (const [key, def] of Object.entries(DEFAULT_SETTINGS)) {
      if (def.group === group) {
        settingsMap[key] = def.value;
      }
    }

    // Override with DB values for this group
    for (const s of dbSettings) {
      settingsMap[s.key] = s.value;
    }

    return settingsMap;
  }

  /**
   * Updates multiple settings at once
   */
  async updateSettings(settingsData: Record<string, any>): Promise<Record<string, string>> {
    const settingsToUpsert: { key: string; value: string; group: string }[] = [];

    for (const [key, value] of Object.entries(settingsData)) {
      // Only update known settings or match group dynamically
      const definition = DEFAULT_SETTINGS[key];
      const group = definition ? definition.group : 'general';
      
      if (value !== undefined) {
        // Convert null/undefined to empty string for db storage consistency
        const stringValue = value === null ? '' : String(value);
        settingsToUpsert.push({ key, value: stringValue, group });
      }
    }

    if (settingsToUpsert.length > 0) {
      await this.settingRepository.upsertMany(settingsToUpsert);
    }

    return this.getAllSettings();
  }
}

import { apiV1Client } from './client';

export interface PageBlockData {
  id: string;
  parentId: string | null;
  order: number;
  type: string;
  props: any;
  styles: any;
}

export interface PageSectionData {
  id?: number;
  order: number;
  type: string;
  props: any;
  styles: any;
  blocks: PageBlockData[];
}

export interface PageData {
  id: number;
  title: string;
  slug: string;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  structuredData?: string;
  featuredImage?: string;
  publishedAt?: string;
  author?: {
    id: number;
    name: string;
    email: string;
  };
  sections?: PageSectionData[];
  createdAt: string;
  updatedAt: string;
}

export interface PageVersionData {
  id: number;
  pageId: number;
  version: number;
  data: string; // JSON string representing sections
  createdAt: string;
}

export interface PageTemplateData {
  id: number;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  sections?: PageSectionData[];
}

export interface GlobalComponentData {
  id: number;
  name: string;
  type: string;
  props: any;
  styles: any;
}

export const pagesApi = {
  // Page CRUD
  getPages: async (params?: { search?: string; status?: string }) => {
    const res = await apiV1Client.get<{ status: string; data: { pages: PageData[]; total: number } }>('/pages', { params });
    return res.data.data;
  },

  getPage: async (id: number) => {
    const res = await apiV1Client.get<{ status: string; data: { page: PageData } }>(`/pages/${id}`);
    return res.data.data.page;
  },

  getPageBySlug: async (slug: string) => {
    const res = await apiV1Client.get<{ status: string; data: { page: PageData } }>(`/pages/slug/${slug}`);
    return res.data.data.page;
  },

  createPage: async (data: { title: string; slug: string; metaTitle?: string; metaDescription?: string; featuredImage?: string }) => {
    const res = await apiV1Client.post<{ status: string; data: { page: PageData } }>('/pages', data);
    return res.data.data.page;
  },

  updatePage: async (id: number, data: Partial<PageData>) => {
    const res = await apiV1Client.patch<{ status: string; data: { page: PageData } }>(`/pages/${id}`, data);
    return res.data.data.page;
  },

  deletePage: async (id: number) => {
    await apiV1Client.delete(`/pages/${id}`);
  },

  // Save builder sections and blocks
  saveBuilder: async (id: number, sections: PageSectionData[]) => {
    const res = await apiV1Client.post<{ status: string; data: { page: PageData } }>(`/pages/${id}/builder`, { sections });
    return res.data.data.page;
  },

  // Publish a page
  publishPage: async (id: number) => {
    const res = await apiV1Client.post<{ status: string; data: { page: PageData } }>(`/pages/${id}/publish`);
    return res.data.data.page;
  },

  // Autosave current progress
  autosave: async (id: number, sections: PageSectionData[]) => {
    const res = await apiV1Client.post<{ status: string; data: { page: PageData; version: number } }>(`/pages/${id}/autosave`, { sections });
    return res.data.data;
  },

  // Version Control
  getVersions: async (id: number) => {
    const res = await apiV1Client.get<{ status: string; data: { versions: PageVersionData[] } }>(`/pages/${id}/versions`);
    return res.data.data.versions;
  },

  restoreVersion: async (pageId: number, versionId: number) => {
    const res = await apiV1Client.post<{ status: string; data: { page: PageData } }>(`/pages/${pageId}/versions/${versionId}/restore`);
    return res.data.data.page;
  },

  // Templates
  getTemplates: async () => {
    const res = await apiV1Client.get<{ status: string; data: { templates: PageTemplateData[] } }>('/pages/templates');
    return res.data.data.templates;
  },

  // Global Components
  getGlobalComponents: async () => {
    const res = await apiV1Client.get<{ status: string; data: { components: GlobalComponentData[] } }>('/pages/global-components');
    return res.data.data.components;
  },

  createGlobalComponent: async (data: { name: string; type: string; props: any; styles: any }) => {
    const res = await apiV1Client.post<{ status: string; data: { component: GlobalComponentData } }>('/pages/global-components', data);
    return res.data.data.component;
  },

  updateGlobalComponent: async (id: number, data: Partial<GlobalComponentData>) => {
    const res = await apiV1Client.patch<{ status: string; data: { component: GlobalComponentData } }>(`/pages/global-components/${id}`, data);
    return res.data.data.component;
  },

  deleteGlobalComponent: async (id: number) => {
    await apiV1Client.delete(`/pages/global-components/${id}`);
  },

  // Global Theme Settings
  getThemeSettings: async () => {
    const res = await apiV1Client.get<{ status: string; data: { settings: any } }>('/pages/theme-settings');
    return res.data.data.settings;
  },

  updateThemeSetting: async (key: string, value: any) => {
    const res = await apiV1Client.put<{ status: string; data: { setting: any } }>('/pages/theme-settings', { key, value });
    return res.data.data.setting;
  },
};

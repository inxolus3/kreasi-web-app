/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TabType = 'home' | 'layanan' | 'portfolio' | 'locations' | 'tentang' | 'kontak' | 'blog';

export interface Project {
  id: string;
  title: string;
  client: string;
  location: string;
  category: 'Billboard' | 'Spanduk' | 'Neon Box' | 'Branding';
  image: string;
  featured: boolean;
  stats?: string;
  desc?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  features: string[];
  impact: string;
  visibility: string;
}

export interface ValueProp {
  id: string;
  num: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  id: string;
  num: string;
  title: string;
  description: string;
}

export interface Billboard {
  id: number;
  code: string;
  name: string;
  slug: string;
  province: string;
  city: string;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  size: string;
  type: 'Baliho' | 'Billboard';
  orientation: 'Satu Sisi' | 'Dua Sisi';
  lighting: 'Back Light' | 'Front Light' | 'Non Light';
  traffic?: string | null;
  code?: string;
  price?: number;
  status?: string | null;
  description?: string | null;
  thumbnail?: string | null;
  gallery: string[];
  availableFrom?: string | null;
  availableUntil?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

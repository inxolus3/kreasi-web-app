/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type { BillboardDetail as Billboard, BillboardMarker } from './api/types/billboard';

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

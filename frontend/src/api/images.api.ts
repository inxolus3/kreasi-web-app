/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiV1Client } from './client';
import type { ImageUploadResponse, MultipleImageUploadResponse, UploadedImage } from './types/image';

export type { UploadedImage } from './types/image';

export const imagesApi = {
  uploadSingle: async (file: File): Promise<UploadedImage> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiV1Client.post<ImageUploadResponse>('/images/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  uploadMultiple: async (files: File[]): Promise<UploadedImage[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    const response = await apiV1Client.post<MultipleImageUploadResponse>('/images/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};

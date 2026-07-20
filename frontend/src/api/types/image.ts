/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UploadedImage {
  id: number;
  url: string;
  filename: string;
  size: number;
}

export interface ImageUploadResponse {
  status: 'success';
  data: UploadedImage;
}

export interface MultipleImageUploadResponse {
  status: 'success';
  data: UploadedImage[];
}

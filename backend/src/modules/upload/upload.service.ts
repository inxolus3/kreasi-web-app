import sharp from 'sharp';
import path from 'path';
import { getStorageProvider, IStorageProvider } from './storage.provider';
import { validateImageFile } from '../../utils/fileValidator';

export interface CompressionOptions {
  compress?: boolean;
  format?: 'webp' | 'jpeg' | 'png' | 'original';
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface UploadResult {
  url: string;
  key: string;
  thumbnailUrl?: string;
  thumbnailKey?: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
}

export class UploadService {
  private storageProvider: IStorageProvider;

  constructor(storageProvider?: IStorageProvider) {
    this.storageProvider = storageProvider || getStorageProvider();
  }

  /**
   * Generates a safe, clean, and unique filename.
   */
  private generateUniqueFilename(originalName: string, targetExt?: string): string {
    const ext = targetExt || path.extname(originalName).toLowerCase();
    const baseName = path.basename(originalName, path.extname(originalName))
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-') // Replace non-alphanumeric chars with dashes
      .replace(/-+/g, '-')          // Collapse consecutive dashes
      .replace(/^-|-$/g, '');       // Trim leading/trailing dashes

    const timestamp = Date.now();
    const randomSuffix = Math.round(Math.random() * 1e6);
    
    return `${baseName}-${timestamp}-${randomSuffix}${ext}`;
  }

  /**
   * Generates date-based folder path: YYYY/MM
   */
  private getDateBasedFolder(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}/${month}`;
  }

  /**
   * Validates file size and type.
   */
  private validateFile(file: Express.Multer.File, allowedMimeTypes: string[], maxSizeBytes: number): void {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(`Invalid file type: ${file.mimetype}. Allowed types: ${allowedMimeTypes.join(', ')}`);
    }

    if (file.size > maxSizeBytes) {
      const sizeInMb = (maxSizeBytes / (1024 * 1024)).toFixed(1);
      throw new Error(`File size exceeds limit. Maximum allowed size is ${sizeInMb}MB.`);
    }
  }

  /**
   * Compresses and resizes an image buffer using sharp.
   */
  public async compressImage(
    buffer: Buffer,
    mimeType: string,
    options: CompressionOptions = {}
  ): Promise<{ buffer: Buffer; mimeType: string; ext: string }> {
    const {
      compress = true,
      format = 'webp',
      quality = 80,
      maxWidth = 1920,
      maxHeight = 1920,
    } = options;

    if (!compress) {
      return {
        buffer,
        mimeType,
        ext: mimeType.split('/')[1] === 'jpeg' ? '.jpg' : `.${mimeType.split('/')[1]}`,
      };
    }

    try {
      let transformer = sharp(buffer);
      const metadata = await transformer.metadata();

      // Resize if dimensions exceed maximum bounds
      if (metadata.width && metadata.height && (metadata.width > maxWidth || metadata.height > maxHeight)) {
        transformer = transformer.resize({
          width: maxWidth,
          height: maxHeight,
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      let targetMimeType = mimeType;
      let targetExt = mimeType.split('/')[1] === 'jpeg' ? '.jpg' : `.${mimeType.split('/')[1]}`;

      // Handle output formats
      if (format === 'webp') {
        transformer = transformer.webp({ quality });
        targetMimeType = 'image/webp';
        targetExt = '.webp';
      } else if (format === 'jpeg') {
        transformer = transformer.jpeg({ quality });
        targetMimeType = 'image/jpeg';
        targetExt = '.jpg';
      } else if (format === 'png') {
        transformer = transformer.png({ quality, compressionLevel: 8 });
        targetMimeType = 'image/png';
        targetExt = '.png';
      } else {
        // Keep original format but compress
        if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
          transformer = transformer.jpeg({ quality });
        } else if (mimeType === 'image/webp') {
          transformer = transformer.webp({ quality });
        } else if (mimeType === 'image/png') {
          transformer = transformer.png({ quality, compressionLevel: 8 });
        }
      }

      const compressedBuffer = await transformer.toBuffer();
      return {
        buffer: compressedBuffer,
        mimeType: targetMimeType,
        ext: targetExt,
      };
    } catch (error: any) {
      console.error('Image compression failed, falling back to original buffer:', error.message);
      return {
        buffer,
        mimeType,
        ext: mimeType.split('/')[1] === 'jpeg' ? '.jpg' : `.${mimeType.split('/')[1]}`,
      };
    }
  }

  /**
   * Uploads a single file, compressing it if it's an image.
   */
  async uploadSingle(
    file: Express.Multer.File,
    options: {
      allowedMimeTypes?: string[];
      maxSizeBytes?: number;
      folder?: string;
      compression?: CompressionOptions;
    } = {}
  ): Promise<UploadResult> {
    const allowedMimeTypes = options.allowedMimeTypes || [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ];
    // Default max size: 5MB
    const maxSizeBytes = options.maxSizeBytes || 5 * 1024 * 1024;
    
    // 1. Validate raw file size and mime types
    this.validateFile(file, allowedMimeTypes, maxSizeBytes);

    // Validate real content via sharp
    const isValidImage = await validateImageFile(file.buffer);
    if (!isValidImage) {
      throw new Error('Invalid file content: The file is not a valid image.');
    }

    let finalBuffer = file.buffer;
    let finalMimeType = file.mimetype;
    let fileExt = path.extname(file.originalname).toLowerCase();
    let thumbnailUrl: string | undefined = undefined;
    let thumbnailKey: string | undefined = undefined;

    // 2. Compress if it's an image
    const isImage = file.mimetype.startsWith('image/') && file.mimetype !== 'image/gif';
    if (isImage) {
      const compressionResult = await this.compressImage(file.buffer, file.mimetype, options.compression);
      finalBuffer = compressionResult.buffer;
      finalMimeType = compressionResult.mimeType;
      fileExt = compressionResult.ext;
    }

    // 3. Generate unique automatic name
    const uniqueFileName = this.generateUniqueFilename(file.originalname, fileExt);

    // 4. Folder organization (date-based by default)
    const folder = options.folder || this.getDateBasedFolder();

    // 5. Store file via Provider
    const { url, key } = await this.storageProvider.uploadFile(finalBuffer, uniqueFileName, finalMimeType, folder);

    // 6. Generate and upload thumbnail if it is a valid non-gif image
    if (isImage) {
      try {
        const thumbnailBuffer = await sharp(file.buffer)
          .resize(400, 300, { fit: 'cover' })
          .webp({ quality: 70 })
          .toBuffer();
        
        const thumbExt = '.webp';
        const nameWithoutExt = path.basename(uniqueFileName, path.extname(uniqueFileName));
        const thumbFileName = `${nameWithoutExt}-thumb${thumbExt}`;
        
        const thumbResult = await this.storageProvider.uploadFile(
          thumbnailBuffer,
          thumbFileName,
          'image/webp',
          folder
        );
        thumbnailUrl = thumbResult.url;
        thumbnailKey = thumbResult.key;
      } catch (thumbError) {
        console.error('Thumbnail generation failed:', thumbError);
      }
    }

    return {
      url,
      key,
      thumbnailUrl,
      thumbnailKey,
      originalName: file.originalname,
      fileName: uniqueFileName,
      mimeType: finalMimeType,
      size: finalBuffer.length,
    };
  }

  /**
   * Uploads multiple files, compressing images.
   */
  async uploadMultiple(
    files: Express.Multer.File[],
    options: {
      allowedMimeTypes?: string[];
      maxSizeBytes?: number;
      folder?: string;
      compression?: CompressionOptions;
    } = {}
  ): Promise<UploadResult[]> {
    if (!files || files.length === 0) {
      throw new Error('No files provided for upload.');
    }

    const uploadPromises = files.map((file) => this.uploadSingle(file, options));
    return Promise.all(uploadPromises);
  }

  /**
   * Deletes a file using its storage key.
   */
  async deleteFile(key: string): Promise<void> {
    if (!key) {
      throw new Error('Storage key is required for deletion.');
    }
    await this.storageProvider.deleteFile(key);
  }
}

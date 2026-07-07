import { Request, Response, NextFunction } from 'express';
import { UploadService, CompressionOptions } from './upload.service';

export class UploadController {
  private uploadService: UploadService;

  constructor() {
    this.uploadService = new UploadService();
  }

  /**
   * Helper to parse compression options from query parameters
   */
  private parseCompressionOptions(req: Request): CompressionOptions {
    const { compress, format, quality, maxWidth, maxHeight } = req.query;

    const options: CompressionOptions = {};

    if (compress !== undefined) {
      options.compress = compress === 'true';
    }

    if (format && typeof format === 'string' && ['webp', 'jpeg', 'png', 'original'].includes(format)) {
      options.format = format as 'webp' | 'jpeg' | 'png' | 'original';
    }

    if (quality && typeof quality === 'string') {
      const parsedQuality = parseInt(quality, 10);
      if (!isNaN(parsedQuality) && parsedQuality >= 1 && parsedQuality <= 100) {
        options.quality = parsedQuality;
      }
    }

    if (maxWidth && typeof maxWidth === 'string') {
      const parsedWidth = parseInt(maxWidth, 10);
      if (!isNaN(parsedWidth) && parsedWidth > 0) {
        options.maxWidth = parsedWidth;
      }
    }

    if (maxHeight && typeof maxHeight === 'string') {
      const parsedHeight = parseInt(maxHeight, 10);
      if (!isNaN(parsedHeight) && parsedHeight > 0) {
        options.maxHeight = parsedHeight;
      }
    }

    return options;
  }

  /**
   * Handles a single file upload
   */
  uploadSingleFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          status: 'fail',
          message: 'No file uploaded. Make sure key is "file".',
        });
        return;
      }

      const folder = typeof req.body.folder === 'string' ? req.body.folder : undefined;
      const compression = this.parseCompressionOptions(req);

      const result = await this.uploadService.uploadSingle(req.file, {
        folder,
        compression,
      });

      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error: any) {
      if (error.message.includes('Invalid file type') || error.message.includes('File size exceeds')) {
        res.status(400).json({
          status: 'fail',
          message: error.message,
        });
        return;
      }
      next(error);
    }
  };

  /**
   * Handles uploading multiple files
   */
  uploadMultipleFiles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        res.status(400).json({
          status: 'fail',
          message: 'No files uploaded. Make sure key is "files".',
        });
        return;
      }

      const folder = typeof req.body.folder === 'string' ? req.body.folder : undefined;
      const compression = this.parseCompressionOptions(req);

      const results = await this.uploadService.uploadMultiple(files, {
        folder,
        compression,
      });

      res.status(201).json({
        status: 'success',
        data: results,
      });
    } catch (error: any) {
      if (error.message.includes('Invalid file type') || error.message.includes('File size exceeds')) {
        res.status(400).json({
          status: 'fail',
          message: error.message,
        });
        return;
      }
      next(error);
    }
  };

  /**
   * Delete file using storage key
   */
  deleteFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { key } = req.body;
      if (!key) {
        res.status(400).json({
          status: 'fail',
          message: 'Storage key is required for deletion.',
        });
        return;
      }

      await this.uploadService.deleteFile(key);

      res.status(200).json({
        status: 'success',
        message: 'File deleted successfully.',
      });
    } catch (error: any) {
      next(error);
    }
  };
}

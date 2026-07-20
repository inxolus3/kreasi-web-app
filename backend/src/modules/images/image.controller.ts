import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import { ImageRepository } from './image.repository';
import { AppError } from '../../errors/AppError';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export class ImageController {
  constructor(private readonly imageRepository = new ImageRepository()) {}

  private async convertToWebp(file: any) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      throw new AppError('Invalid file type. Only JPEG, PNG, GIF, and WEBP images are allowed.', 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new AppError('File size exceeds limit. Maximum allowed size is 5MB.', 400);
    }

    const webpBuffer = await sharp(file.buffer)
      .webp({ quality: 85, force: true })
      .toBuffer();

    return {
      buffer: webpBuffer,
      mimeType: 'image/webp',
      filename: `${file.originalname.replace(/\.[^/.]+$/, '')}.webp`,
      size: webpBuffer.length,
    };
  }

  uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = req.file;
      if (!file) {
        throw new AppError('No file uploaded. Make sure the field name is "file".', 400);
      }

      const converted = await this.convertToWebp(file);
      const image = await this.imageRepository.create({
        filename: converted.filename,
        mimeType: converted.mimeType,
        data: converted.buffer,
        size: converted.size,
      });

      res.status(201).json({
        status: 'success',
        data: {
          id: image.id,
          url: `/api/v1/images/${image.id}`,
          filename: image.filename,
          size: image.size,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  uploadMultipleImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        throw new AppError('No files uploaded. Make sure the field name is "files".', 400);
      }
      if (files.length > 10) {
        throw new AppError('Too many files uploaded. Maximum is 10.', 400);
      }

      const results = await Promise.all(
        files.map(async (file) => {
          const converted = await this.convertToWebp(file);
          const image = await this.imageRepository.create({
            filename: converted.filename,
            mimeType: converted.mimeType,
            data: converted.buffer,
            size: converted.size,
          });
          return {
            id: image.id,
            url: `/api/v1/images/${image.id}`,
            filename: image.filename,
            size: image.size,
          };
        })
      );

      res.status(201).json({ status: 'success', data: results });
    } catch (error) {
      next(error);
    }
  };

  serveImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id) || id <= 0) {
        throw new AppError('Invalid image ID.', 400);
      }
      const image = await this.imageRepository.findById(id);
      if (!image) {
        throw new AppError('Image not found.', 404);
      }
      res.setHeader('Content-Type', image.mimeType);
      res.setHeader('Content-Length', image.size.toString());
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.send(image.data);
    } catch (error) {
      next(error);
    }
  };
}

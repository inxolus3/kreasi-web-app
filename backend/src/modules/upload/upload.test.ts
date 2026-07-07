import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import fs from 'fs';
import app from '../../app';
import { generateToken } from '../../utils/jwt.util';
import { UploadService } from './upload.service';

// Mock fs.promises to prevent writing files to local disk during testing
vi.mock('fs', async () => {
  const mockPromises = {
    writeFile: vi.fn().mockResolvedValue(undefined),
    unlink: vi.fn().mockResolvedValue(undefined),
  };
  const mockExistsSync = vi.fn().mockReturnValue(true);
  const mockMkdirSync = vi.fn();

  return {
    existsSync: mockExistsSync,
    mkdirSync: mockMkdirSync,
    promises: mockPromises,
    default: {
      existsSync: mockExistsSync,
      mkdirSync: mockMkdirSync,
      promises: mockPromises,
    },
  };
});

// Mock sharp image manipulation
vi.mock('sharp', () => {
  const sharpMock = vi.fn().mockReturnValue({
    metadata: vi.fn().mockResolvedValue({ width: 2000, height: 1500 }),
    resize: vi.fn().mockReturnThis(),
    webp: vi.fn().mockReturnThis(),
    jpeg: vi.fn().mockReturnThis(),
    png: vi.fn().mockReturnThis(),
    toBuffer: vi.fn().mockResolvedValue(Buffer.from('mocked-compressed-data')),
  });
  return { default: sharpMock };
});

describe('Upload Module', () => {
  let adminToken: string;

  beforeEach(() => {
    vi.clearAllMocks();
    adminToken = generateToken({ userId: 1, role: 'ADMIN' });
  });

  describe('UploadService Unit Tests', () => {
    it('should generate date-based folders YYYY/MM', () => {
      const service = new UploadService();
      const folder = (service as any).getDateBasedFolder();
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      expect(folder).toBe(`${year}/${month}`);
    });

    it('should clean and secure filenames during automatic filename generation', () => {
      const service = new UploadService();
      const originalName = 'My Super Photo #1 & Final!.PNG';
      const uniqueName = (service as any).generateUniqueFilename(originalName, '.webp');
      
      expect(uniqueName).toContain('my-super-photo-1-final');
      expect(uniqueName.endsWith('.webp')).toBe(true);
      expect(uniqueName.split('-').length).toBeGreaterThan(4); // original terms + timestamp + random
    });

    it('should enforce MIME type validations and reject unsupported files', async () => {
      const service = new UploadService();
      const mockFile = {
        fieldname: 'file',
        originalname: 'document.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        buffer: Buffer.from('pdf-contents'),
        size: 1024,
      } as Express.Multer.File;

      await expect(service.uploadSingle(mockFile)).rejects.toThrow('Invalid file type');
    });

    it('should enforce maximum size validations and reject oversized files', async () => {
      const service = new UploadService();
      const mockFile = {
        fieldname: 'file',
        originalname: 'huge-image.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('large-image'),
        size: 20 * 1024 * 1024, // 20MB
      } as Express.Multer.File;

      await expect(service.uploadSingle(mockFile, { maxSizeBytes: 5 * 1024 * 1024 })).rejects.toThrow(
        'File size exceeds limit'
      );
    });
  });

  describe('POST /api/v1/upload/single', () => {
    it('should block unauthenticated upload requests with 401', async () => {
      const response = await request(app)
        .post('/api/v1/upload/single')
        .attach('file', Buffer.from('image-bytes'), 'test.jpg');

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('fail');
    });

    it('should successfully upload and compress a single image with JWT token', async () => {
      const response = await request(app)
        .post('/api/v1/upload/single')
        .set('Authorization', `Bearer ${adminToken}`)
        .attach('file', Buffer.from('raw-jpeg-data'), 'vacation.jpg');

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('url');
      expect(response.body.data).toHaveProperty('key');
      expect(response.body.data.mimeType).toBe('image/webp'); // sharp compresses to webp by default
      expect(response.body.data.originalName).toBe('vacation.jpg');
    });

    it('should allow custom storage folder organization passed in the request body', async () => {
      const response = await request(app)
        .post('/api/v1/upload/single')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('folder', 'avatars/users')
        .attach('file', Buffer.from('avatar-bytes'), 'face.png');

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.key).toContain('avatars/users/');
    });

    it('should reject non-image file uploads with 400', async () => {
      const response = await request(app)
        .post('/api/v1/upload/single')
        .set('Authorization', `Bearer ${adminToken}`)
        .attach('file', Buffer.from('text-data'), 'notes.txt');

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('Only images are allowed');
    });
  });

  describe('POST /api/v1/upload/multiple', () => {
    it('should upload multiple files simultaneously, compress each, and return array', async () => {
      const response = await request(app)
        .post('/api/v1/upload/multiple')
        .set('Authorization', `Bearer ${adminToken}`)
        .attach('files', Buffer.from('img1'), 'one.png')
        .attach('files', Buffer.from('img2'), 'two.jpg');

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0].originalName).toBe('one.png');
      expect(response.body.data[1].originalName).toBe('two.jpg');
    });
  });

  describe('DELETE /api/v1/upload', () => {
    it('should successfully delete a stored file from key', async () => {
      const response = await request(app)
        .delete('/api/v1/upload')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ key: '2026/07/test-image.webp' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(fs.promises.unlink).toHaveBeenCalled();
    });

    it('should return 400 if key is omitted in delete payload', async () => {
      const response = await request(app)
        .delete('/api/v1/upload')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('fail');
    });
  });
});

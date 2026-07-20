import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app';
import prisma from '../../utils/prisma';

vi.mock('../../utils/prisma', () => ({
  default: {
    billboard: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('Billboard API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/public/billboards', () => {
    it('should return lightweight markers of billboards successfully', async () => {
      const mockBillboards = [
        {
          id: 1,
          code: 'BB-001',
          name: 'Main Street Billboard',
          slug: 'main-street-billboard',
          province: 'Jakarta',
          city: 'Jakarta Selatan',
          district: 'Kebayoran Baru',
          address: 'Jl. Jenderal Sudirman No. 1',
          latitude: -6.2182,
          longitude: 106.8024,
          price: 15000000,
          status: 'AVAILABLE',
          thumbnail: 'http://example.com/thumb.jpg',
          gallery: ['http://example.com/gallery1.jpg'],
          size: '4x8m',
          type: 'Baliho',
          orientation: 'Satu Sisi',
          lighting: 'Front Light',
          traffic: 'HIGH',
          availableFrom: new Date(),
          availableUntil: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(prisma.billboard.findMany).mockResolvedValue(mockBillboards as any);
      vi.mocked(prisma.billboard.count).mockResolvedValue(1);

      const response = await request(app)
        .get('/api/v1/public/billboards')
        .query({ search: 'Main' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data[0]).not.toHaveProperty('code');
      expect(response.body.data[0]).not.toHaveProperty('status');
      expect(response.body.data[0]).not.toHaveProperty('price');
      expect(response.body.data[0]).toHaveProperty('latitude', -6.2182);
      expect(response.body.data[0]).not.toHaveProperty('gallery');
      expect(response.body.data[0]).not.toHaveProperty('size');
    });
  });

  describe('GET /api/v1/public/billboards/:slug', () => {
    it('should return complete billboard information by slug', async () => {
      const mockBillboard = {
        id: 1,
        code: 'BB-001',
        name: 'Main Street Billboard',
        slug: 'main-street-billboard',
        province: 'Jakarta',
        city: 'Jakarta Selatan',
        district: 'Kebayoran Baru',
        address: 'Jl. Jenderal Sudirman No. 1',
        latitude: -6.2182,
        longitude: 106.8024,
        price: 15000000,
        status: 'AVAILABLE',
        thumbnail: 'http://example.com/thumb.jpg',
        gallery: ['http://example.com/gallery1.jpg'],
        size: '4x8m',
        type: 'Baliho',
        orientation: 'Satu Sisi',
        lighting: 'Front Light',
        traffic: 'HIGH',
        availableFrom: new Date(),
        availableUntil: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.billboard.findUnique).mockResolvedValue(mockBillboard as any);

      const response = await request(app).get('/api/v1/public/billboards/main-street-billboard');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('slug', 'main-street-billboard');
      expect(response.body.data).toHaveProperty('gallery');
      expect(response.body.data).toHaveProperty('size');
      expect(response.body.data).not.toHaveProperty('code');
      expect(response.body.data).not.toHaveProperty('status');
      expect(response.body.data).not.toHaveProperty('price');
    });

    it('should return 404 if billboard does not exist', async () => {
      vi.mocked(prisma.billboard.findUnique).mockResolvedValue(null);

      const response = await request(app).get('/api/v1/public/billboards/non-existent-slug');

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Billboard not found');
    });
  });
});

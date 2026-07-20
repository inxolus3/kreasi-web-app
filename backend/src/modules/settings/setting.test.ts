import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app';
import prisma from '../../utils/prisma';
import { generateToken } from '../../utils/jwt.util';

vi.mock('../../utils/prisma', () => ({
  default: {
    setting: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    $transaction: vi.fn((callback: any) => {
      // If callback is a function, execute it
      if (typeof callback === 'function') {
        return callback();
      }
      // If callback is an array of promises, execute them
      if (Array.isArray(callback)) {
        return Promise.all(callback);
      }
      return Promise.resolve(callback);
    }),
  },
}));

describe('Settings API', () => {
  let adminToken: string;
  let userToken: string;

  beforeEach(() => {
    vi.clearAllMocks();
    adminToken = generateToken({ userId: 1, role: 'ADMIN' });
    userToken = generateToken({ userId: 2, role: 'USER' });
  });

  describe('GET /api/v1/public/settings', () => {
    it('should return all settings, overriding system defaults with DB values', async () => {
      const mockDbSettings = [
        {
          id: 1,
          key: 'siteName',
          value: 'My Awesome Custom Site',
          group: 'identity',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          key: 'maintenanceMode',
          value: 'true',
          group: 'general',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(prisma.setting.findMany).mockResolvedValue(mockDbSettings as any);

      const response = await request(app).get('/api/v1/public/settings');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.siteName).toBe('My Awesome Custom Site');
      expect(response.body.data.maintenanceMode).toBe('true');
      // Should still contain defaults for other values
      expect(response.body.data.siteDescription).toBe('Robust Admin and Content Management System');
    });
  });

  describe('GET /api/v1/public/settings/:group', () => {
    it('should return only settings belonging to the specified group', async () => {
      const mockDbSettings = [
        {
          id: 1,
          key: 'contactEmail',
          value: 'custom@example.com',
          group: 'contact',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(prisma.setting.findMany).mockResolvedValue(mockDbSettings as any);

      const response = await request(app).get('/api/v1/public/settings/contact');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.contactEmail).toBe('custom@example.com');
      expect(response.body.data.contactPhone).toBe('+6281234567890'); // Default
      expect(response.body.data.siteName).toBeUndefined(); // Should not belong to contact group
    });
  });

  describe('PATCH /api/v1/admin/settings', () => {
    it('should reject unauthenticated requests with 401', async () => {
      const response = await request(app)
        .patch('/api/v1/admin/settings')
        .send({ siteName: 'Denied' });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('fail');
    });

    it('should reject requests from regular non-admin users with 403', async () => {
      const response = await request(app)
        .patch('/api/v1/admin/settings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ siteName: 'Denied' });

      expect(response.status).toBe(403);
      expect(response.body.status).toBe('fail');
    });

    it('should successfully update settings with valid fields', async () => {
      vi.mocked(prisma.setting.upsert).mockResolvedValue({
        id: 1,
        key: 'siteName',
        value: 'New Site Title',
        group: 'identity',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.mocked(prisma.setting.findMany).mockResolvedValue([
        {
          id: 1,
          key: 'siteName',
          value: 'New Site Title',
          group: 'identity',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const response = await request(app)
        .patch('/api/v1/admin/settings')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          siteName: 'New Site Title',
          maintenanceMode: 'true',
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.siteName).toBe('New Site Title');
      expect(prisma.setting.upsert).toHaveBeenCalledTimes(2);
    });

    it('should fail validation when passing an invalid URL or email address', async () => {
      const response = await request(app)
        .patch('/api/v1/admin/settings')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          siteLogo: 'not-a-url',
          contactEmail: 'invalid-email',
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('Validation Error');
      expect(JSON.stringify(response.body.errors)).toContain('must be a valid URL');
      expect(JSON.stringify(response.body.errors)).toContain('must be a valid email');
    });
  });
});

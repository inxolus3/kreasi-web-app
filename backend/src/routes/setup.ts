import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { logger } from '../utils/logger';

const router = Router();

// POST /api/v1/admin/setup — Create first admin (one-time use)
router.post('/setup', async (req: Request, res: Response) => {
  try {
    // Cek apakah sudah ada admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      return res.status(403).json({
        status: 'fail',
        message: 'Admin already exists. Use regular login.'
      });
    }

    const { email, password, name } = req.body;

    // Validasi
    if (!email || !password || !name) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email, password, and name are required'
      });
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid email format'
      });
    }

    // Validasi password strength
    if (password.length < 6) {
      return res.status(400).json({
        status: 'fail',
        message: 'Password must be at least 6 characters'
      });
    }

    // Cek email sudah ada (non-admin)
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    if (existingUser) {
      return res.status(409).json({
        status: 'fail',
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        password: hashedPassword,
        role: 'ADMIN',
        refreshToken: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    });

    logger.info({ adminId: admin.id }, 'First admin created via setup');

    res.status(201).json({
      status: 'success',
      message: 'Admin created successfully',
      data: admin
    });

  } catch (error: any) {
    logger.error({ error }, 'Admin setup failed');
    res.status(500).json({
      status: 'error',
      message: 'Setup failed: ' + error.message
    });
  }
});

export default router;
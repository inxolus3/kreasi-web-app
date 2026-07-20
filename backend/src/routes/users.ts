import { Router } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = Router();

// GET /api/v1/users — List all users (admin only)
router.get('/', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json({ status: 'success', data: users });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ POST /api/v1/users — Create new user (admin only)
router.post('/', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ status: 'fail', message: 'Name, email, and password are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ status: 'fail', message: 'Password must be at least 6 characters' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'editor',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({ status: 'success', data: user });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ status: 'fail', message: 'Email already exists' });
      return;
    }
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ PUT /api/v1/users/:id — Update user (admin only)
router.put('/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const id = Number(req.params.id);

    const data: any = { name, email, role };
    if (password && password.trim() !== '') {
      if (password.length < 6) {
        res.status(400).json({ status: 'fail', message: 'Password must be at least 6 characters' });
        return;
      }
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ status: 'success', data: user });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ status: 'fail', message: 'Email already exists' });
      return;
    }
    if (error.code === 'P2025') {
      res.status(404).json({ status: 'fail', message: 'User not found' });
      return;
    }
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ DELETE /api/v1/users/:id — Delete user (admin only)
router.delete('/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Prevent deleting self or default admin
    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      res.status(404).json({ status: 'fail', message: 'User not found' });
      return;
    }

    await prisma.user.delete({ where: { id } });

    res.json({ status: 'success', message: 'User deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ status: 'fail', message: 'User not found' });
      return;
    }
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
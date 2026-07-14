import { Router } from 'express';
import prisma from '../utils/prisma';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/v1/pages — List all pages
router.get('/', async (req, res) => {
  try {
    const pages = await prisma.page.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        createdAt: true,
      },
    });
    res.json({ status: 'success', data: pages });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
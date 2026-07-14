import { Router } from 'express';
import prisma from '../utils/prisma';

const router = Router();

// GET /api/v1/categories — List all categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json({ status: 'success', data: categories });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
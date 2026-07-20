import { Router } from 'express';
import prisma from '../utils/prisma';

const router = Router();

// GET /api/v1/tags — List all tags
router.get('/', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany();
    res.json({ status: 'success', data: tags });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
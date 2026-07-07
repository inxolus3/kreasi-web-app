import { Router, Request, Response } from 'express';
import os from 'os';

const router = Router();

const getMetrics = () => {
  return {
    memory: {
      used: process.memoryUsage().heapUsed / 1024 / 1024, // in MB
      total: process.memoryUsage().heapTotal / 1024 / 1024, // in MB
      rss: process.memoryUsage().rss / 1024 / 1024, // in MB
    },
    cpu: os.loadavg(),
    uptime: process.uptime(),
    timestamp: Date.now(),
  };
};

const handleMetricsRequest = (_req: Request, res: Response) => {
  res.json(getMetrics());
};

// Support both base route and sub-route for robustness
router.get('/', handleMetricsRequest);
router.get('/metrics', handleMetricsRequest);

export default router;

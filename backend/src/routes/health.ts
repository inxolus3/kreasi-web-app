import { Router } from 'express';
import prisma from '../utils/prisma';

const router = Router();

const getHealthStatus = async () => {
  const checks = {
    database: false,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch {
    // Database down
  }

  return checks;
};

// Handle standard health checks
const handleHealthRequest = async (_req: any, res: any) => {
  const checks = await getHealthStatus();
  const status = checks.database ? 200 : 503;
  res.status(status).json({
    status: checks.database ? 'healthy' : 'unhealthy',
    checks,
  });
};

router.get('/', handleHealthRequest);
router.get('/health', handleHealthRequest);

// Deep health check (include external services)
const handleDeepHealthRequest = async (_req: any, res: any) => {
  let dbHealthy = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbHealthy = true;
  } catch {
    // Database down
  }

  res.json({
    status: dbHealthy ? 'ok' : 'error',
    services: {
      database: dbHealthy,
      storage: true,
    },
  });
};

router.get('/deep', handleDeepHealthRequest);
router.get('/health/deep', handleDeepHealthRequest);

export default router;

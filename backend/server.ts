import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'http';
import app from './src/app';
import { env } from './src/config/env';
import { logger } from './src/utils/logger';
import prisma from './src/utils/prisma';
import { scheduleBackups } from './scripts/cron-backup';

// Helper to safely get directory name in both ES modules and bundled CommonJS environments
const getDirname = (): string => {
  try {
    if (typeof __dirname !== 'undefined') return __dirname;
    const filename = fileURLToPath(import.meta.url);
    return path.dirname(filename);
  } catch {
    return process.cwd();
  }
};

const baseDir = getDirname();

const PORT = parseInt(env.PORT || '3000', 10);

interface RouteLayer {
  route?: {
    path: string;
    methods: Record<string, boolean>;
  };
  name?: string;
  handle?: {
    stack?: RouteLayer[];
  };
  regexp: {
    source: string;
  };
}

interface ExpressWithRouter {
  _router?: {
    stack: RouteLayer[];
  };
}

function ensureUploadsDirectory() {
  const uploadsPath = path.resolve(baseDir, 'uploads');
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
    logger.info(`Created uploads directory at: ${uploadsPath}`);
  } else {
    logger.info(`Uploads directory verified at: ${uploadsPath}`);
  }
}

function logRegisteredRoutes() {
  const routes: { method: string; path: string }[] = [];

  function traverseStack(stack: RouteLayer[], prefix = '') {
    stack.forEach((layer) => {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods)
          .map((m) => m.toUpperCase())
          .join(', ');
        const pathStr = `${prefix}${layer.route.path}`.replace(/\/+/g, '/');
        routes.push({ method: methods, path: pathStr });
      } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
        let routerPrefix = layer.regexp.source
          .replace('\\/?$', '')
          .replace('(?=\\/|$)', '')
          .replace('^', '')
          .replace(/\\\//g, '/')
          .replace(/\/\?$/, '')
          .replace(/\?$/, '');
        
        if (!routerPrefix.startsWith('/')) {
          routerPrefix = '/' + routerPrefix;
        }
        traverseStack(layer.handle.stack, `${prefix}${routerPrefix}`);
      }
    });
  }

  const expressApp = app as unknown as ExpressWithRouter;
  if (expressApp._router && expressApp._router.stack) {
    traverseStack(expressApp._router.stack);
  }

  if (routes.length > 0) {
    logger.info('Registered API Routes:');
    routes.forEach((r) => {
      logger.info(`  [${r.method}] ${r.path}`);
    });
  }
}

async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database connection verified successfully.');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.warn(`Database connection check failed: ${message}`);
  }
}

let server: Server | null = null;

async function startServer() {
  // 1. Ensure uploads folder exists
  ensureUploadsDirectory();

  // 2. Check Database Connection
  await checkDatabaseConnection();

  // 3. Listen to Port
  server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`===================================================`);
    logger.info(`🚀 Server running on port: ${PORT}`);
    logger.info(`🌍 Environment mode: ${env.NODE_ENV}`);
    logger.info(`🔗 Local Address: http://localhost:${PORT}`);
    logger.info(`===================================================`);
    
    // 4. List all registered routes
    logRegisteredRoutes();

    // 5. Start automated backup scheduler
    scheduleBackups();
  });

  // 6. Setup Graceful Shutdown
  setupGracefulShutdown();
}

function setupGracefulShutdown() {
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down server gracefully...`);
    if (server) {
      server.close(async () => {
        logger.info('HTTP server closed.');
        try {
          await prisma.$disconnect();
          logger.info('Database client disconnected.');
          process.exit(0);
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : String(err);
          logger.error(`Error disconnecting database client: ${errMsg}`);
          process.exit(1);
        }
      });
    } else {
      process.exit(0);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((err: unknown) => {
  logger.error(err instanceof Error ? err : new Error(String(err)), 'Failed to start server');
  process.exit(1);
});


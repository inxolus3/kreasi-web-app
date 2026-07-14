import express from 'express';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

import cors from 'cors';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { env } from './config/env';

// Initialize Sentry before any middleware or route definitions
if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    integrations: [
      nodeProfilingIntegration(),
      Sentry.httpIntegration(),
      Sentry.expressIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    environment: env.NODE_ENV || 'development',
  });
}

import healthRouter from './routes/health';
import diagnosticsRouter from './routes/diagnostics';
import metricsRouter from './routes/metrics';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './utils/logger';
import { apiLimiter } from './middlewares/rateLimiter';
import { verifyToken } from './utils/jwt.util';
import { sanitizeResponseMiddleware } from './middlewares/sanitizeResponse';

import authRouter from './modules/auth/auth.routes';
import blogRouter from './modules/blog/blog.routes';
import billboardRouter from './modules/billboards/billboard.routes';
import uploadRouter from './modules/upload/upload.routes';
import settingRouter from './modules/settings/setting.routes';
import pagesRouter from './modules/pages/pages.routes';
import adminRouter from './routes/admin';
import usersRouter from './routes/users';
import categoriesRouter from './routes/categories';
import tagsRouter from './routes/tags';
import sitemapRouter from './routes/sitemap';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';

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

const app = express();

// Helmet Security Headers with safer CSP defaults
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        // Disallow unsafe-inline / unsafe-eval for scripts to reduce XSS risk
        scriptSrc: ["'self'"],
        // Styles often need inline for some frameworks; keep only when necessary
        styleSrc: ["'self'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        // Restrict images to self, data and blob only
        imgSrc: ["'self'", "data:", "blob:"],
        // Restrict connect sources to self by default
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Configure CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman, etc.)
      if (!origin) return callback(null, true);

      // In production, do NOT treat '*' as permissive. Only allow '*' in non-prod dev.
      const allowedOrigins = env.FRONTEND_URL === '*' ? (env.NODE_ENV === 'production' ? [] : '*') : env.FRONTEND_URL.split(',');

      if (allowedOrigins === '*') return callback(null, true);

      if (Array.isArray(allowedOrigins) && allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Deny if origin is not explicitly allowed
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

app.use(compression({ level: 6, threshold: 1024 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeResponseMiddleware);

// Serve uploaded files via a secure controller with authentication checks
app.get('/uploads/*', (req, res) => {
  let token = '';
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query.token && typeof req.query.token === 'string') {
    token = req.query.token;
  } else if (req.headers.cookie) {
    const match = req.headers.cookie.match(/(?:accessToken|token)=([^;]+)/);
    if (match) {
      token = match[1];
    }
  }

  let isAuthenticated = false;
  if (token) {
    try {
      verifyToken(token);
      isAuthenticated = true;
    } catch {
      // Token is invalid/expired
    }
  }

  if (!isAuthenticated) {
    res.status(401).json({ status: 'error', message: 'Unauthorized: Authentication required to view uploads' });
    return;
  }

  const fileSubpath = (req.params as any)[0];
  if (!fileSubpath) {
    res.status(400).json({ status: 'error', message: 'File path is required' });
    return;
  }

  // Prevent path traversal
  const safeSubpath = path.normalize(fileSubpath).replace(/^(\.\.(\/|\\|$))+/, '');
  const filePath = path.join(baseDir, '../uploads', safeSubpath);

  // Ensure path stays within uploads directory
  const uploadsDir = path.resolve(baseDir, '../uploads');
  if (!filePath.startsWith(uploadsDir)) {
    res.status(403).json({ status: 'error', message: 'Forbidden: Access denied' });
    return;
  }

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ status: 'error', message: 'File not found' });
    return;
  }

  res.sendFile(filePath);
});

// Request logging middleware
app.use(requestLogger);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// API Routes
app.use('/api', apiLimiter);
app.use('/api/health', healthRouter);
app.use('/api/diagnostics', diagnosticsRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/auth', authRouter);
app.use('/api/blog', blogRouter);
app.use('/api/v1', billboardRouter);
app.use('/api/v1', uploadRouter);
app.use('/api/v1', settingRouter);
app.use('/api/v1', pagesRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/tags', tagsRouter);
app.use('/api/v1/pages', pagesRouter);
app.use('/', sitemapRouter);


// Sentry error handler (HARUS setelah semua route, sebelum generic error handler)
if (env.SENTRY_DSN) {
  if (typeof Sentry.setupExpressErrorHandler === 'function') {
    Sentry.setupExpressErrorHandler(app);
  } else {
    app.use((Sentry as any).Handlers.errorHandler());
  }
}

// Global Error Handler
app.use(errorHandler);

// Serve frontend static files when a production build is available
const frontendPath = path.join(baseDir, '../../frontend/dist');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendPath, 'index.html'));
    } else {
      res.status(404).json({ message: 'API route not found' });
    }
  });
} else {
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.status(200).json({
        status: 'ok',
        message: 'Backend is running. Frontend build not found, please run the frontend build first.',
      });
    } else {
      res.status(404).json({ message: 'API route not found' });
    }
  });
}

export default app;

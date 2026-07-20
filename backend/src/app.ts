import express from 'express';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { env } from './config/env';
import { verifyToken } from './utils/jwt.util';

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
import { sanitizeResponseMiddleware } from './middlewares/sanitizeResponse';

import authRouter from './modules/auth/auth.routes';
import blogRouter from './modules/blog/blog.routes';
import billboardRouter from './modules/billboards/billboard.routes';
import imageRouter from './modules/images/image.routes';
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

// Helmet Security Headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    frameguard: { action: 'deny' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: env.NODE_ENV === 'production' ? { maxAge: 31536000, includeSubDomains: true, preload: true } : undefined,
  })
);

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g., curl, server-to-server)
      if (!origin) return callback(null, true);

      const allowed = (env as any).ALLOWED_ORIGINS_ARRAY || [];

      if (env.NODE_ENV === 'production') {
        if (!allowed || allowed.length === 0) return callback(new Error('CORS not configured'));
        if (allowed.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
      }

      // In development allow common localhost origins plus any configured ones
      const devAllowed = new Set([...(allowed || []), 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000']);
      if (devAllowed.has(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

app.use(compression({ level: 6, threshold: 1024 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cookie-parser is required for cookie-based authentication
// (refreshToken HttpOnly cookie + accessToken cookie fallback in auth middleware).
app.use(cookieParser());
app.use(sanitizeResponseMiddleware);

// Uploads route with auth
app.get('/uploads/*', (req, res) => {
  let token = '';
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query.token && typeof req.query.token === 'string') {
    token = req.query.token;
  } else if (req.headers.cookie) {
    const match = req.headers.cookie.match(/(?:accessToken|token)=([^;]+)/);
    if (match) token = match[1];
  }

  let isAuthenticated = false;
  if (token) {
    try {
      verifyToken(token);
      isAuthenticated = true;
    } catch { /* invalid token */ }
  }

  if (!isAuthenticated) {
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
    return;
  }

  const fileSubpath = (req.params as any)[0];
  if (!fileSubpath) {
    res.status(400).json({ status: 'error', message: 'File path required' });
    return;
  }

  const safeSubpath = path.normalize(fileSubpath).replace(/^(\.\.(\/|\\|$))+/, '');
  const filePath = path.join(baseDir, '../uploads', safeSubpath);
  const uploadsDir = path.resolve(baseDir, '../uploads');

  if (!filePath.startsWith(uploadsDir)) {
    res.status(403).json({ status: 'error', message: 'Forbidden' });
    return;
  }
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ status: 'error', message: 'File not found' });
    return;
  }
  res.sendFile(filePath);
});

app.use(requestLogger);

// Swagger UI only in non-production
if (env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

// ✅ ALL API ROUTES — PASTIKAN TIDAK ADA YANG HILANG
app.use('/api/health', healthRouter);
app.use('/api/diagnostics', diagnosticsRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/auth', authRouter);
app.use('/api/blog', blogRouter);app.use('/api/v1/images', imageRouter);app.use('/api/v1', billboardRouter);
app.use('/api/v1', uploadRouter);
app.use('/api/v1', settingRouter);
app.use('/api/v1', pagesRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/tags', tagsRouter);
app.use('/', sitemapRouter);

// Sentry error handler
if (env.SENTRY_DSN) {
  if (typeof Sentry.setupExpressErrorHandler === 'function') {
    Sentry.setupExpressErrorHandler(app);
  } else {
    app.use((Sentry as any).Handlers.errorHandler());
  }
}

// Global Error Handler
app.use(errorHandler);

// Frontend static files
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
        message: 'Backend running. Frontend build not found.',
      });
    } else {
      res.status(404).json({ message: 'API route not found' });
    }
  });
}

export default app;
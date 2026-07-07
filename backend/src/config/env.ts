import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Load environment variables from multiple possible paths for robustness
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(baseDir, '../../.env') });
dotenv.config({ path: path.resolve(baseDir, '../../../backend/.env') });
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().url().optional(),
  JWT_SECRET: z.string().optional(),
  JWT_REFRESH_SECRET: z.string().optional(),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  STORAGE_PROVIDER: z.enum(['local', 's3', 'r2']).default('local'),
  FRONTEND_URL: z.string().default('*'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_BUCKET_NAME: z.string().optional(),
  AWS_S3_ENDPOINT: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  ALERT_WEBHOOK: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.NODE_ENV === 'production') {
    if (!data.DATABASE_URL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'DATABASE_URL is strictly required in production mode',
        path: ['DATABASE_URL'],
      });
    }
    if (!data.JWT_SECRET) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'JWT_SECRET is strictly required in production mode',
        path: ['JWT_SECRET'],
      });
    }
    if (!data.JWT_REFRESH_SECRET) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'JWT_REFRESH_SECRET is strictly required in production mode',
        path: ['JWT_REFRESH_SECRET'],
      });
    }
  }
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(_env.error.format(), null, 2));
  throw new Error('Invalid environment variables');
}

// Map parsed data and provide development-only fallbacks
let productionDatabaseUrl = _env.data.DATABASE_URL || 'postgresql://user:password@localhost:5432/mydb?schema=public';

if (_env.data.NODE_ENV === 'production' && _env.data.DATABASE_URL) {
  try {
    const url = new URL(_env.data.DATABASE_URL);
    if (!url.searchParams.has('connection_limit')) {
      url.searchParams.set('connection_limit', '10');
    }
    productionDatabaseUrl = url.toString();
  } catch {
    // Fallback if URL parsing fails
  }
}

export const env = {
  ..._env.data,
  DATABASE_URL: productionDatabaseUrl,
  JWT_SECRET: _env.data.JWT_SECRET || 'supersecret_jwt_key_here',
  JWT_REFRESH_SECRET: _env.data.JWT_REFRESH_SECRET || 'supersecret_refresh_key_here',
  SENTRY_DSN: _env.data.SENTRY_DSN,
  ALERT_WEBHOOK: _env.data.ALERT_WEBHOOK,
};


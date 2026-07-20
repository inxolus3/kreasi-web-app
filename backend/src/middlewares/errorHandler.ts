import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/logger';

const isPrismaConnectionError = (err: unknown): boolean => {
  const maybeError = err as { message?: unknown; code?: unknown } | undefined;
  const message = typeof maybeError?.message === 'string' ? maybeError.message.toLowerCase() : '';
  const code = typeof maybeError?.code === 'string' ? maybeError.code.toLowerCase() : '';

  return (
    message.includes('can\'t reach database server') ||
    message.includes('database server') ||
    message.includes('timed out') ||
    message.includes('connection refused') ||
    message.includes('p1001') ||
    message.includes('p1002') ||
    code.includes('p1001') ||
    code.includes('p1002')
  );
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error({ err, req: { method: req.method, url: req.originalUrl } }, 'Unhandled error');

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
    return;
  }

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({
        status: 'fail',
        message: 'Data sudah ada atau duplikat.',
      });
      return;
    }
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(400).json({
      status: 'fail',
      message: 'Permintaan database tidak valid.',
    });
    return;
  }

  if (isPrismaConnectionError(err)) {
    res.status(503).json({
      status: 'error',
      message: 'Database temporarily unavailable. Please try again later.',
    });
    return;
  }

  if (err instanceof Error && err.message.includes('Only images are allowed')) {
    res.status(400).json({ status: 'fail', message: err.message });
    return;
  }

  const statusCode = 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err instanceof Error ? err.message : 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV !== 'production' && err instanceof Error && { stack: err.stack }),
  });
};

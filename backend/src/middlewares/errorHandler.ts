import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/logger';

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

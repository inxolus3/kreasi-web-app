import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface AppError extends Error {
  statusCode?: number;
  status?: string;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mask database schemas and technical details in production for 500 errors
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal Server Error';
  }

  // Map file upload, validation, and Multer errors to 400 Bad Request
  if (
    err.code?.startsWith('LIMIT_') ||
    err.message?.includes('Only images are allowed') ||
    err.name === 'MulterError'
  ) {
    statusCode = 400;
  }

  let status = err.status || 'error';
  if (statusCode >= 400 && statusCode < 500) {
    status = 'fail';
  }

  res.status(statusCode).json({
    status,
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

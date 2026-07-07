import { Request, Response, NextFunction } from 'express';
import { sanitizeObject } from '../utils/sanitize';

export const sanitizeResponseMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;

  res.json = function (body: any) {
    if (body) {
      try {
        body = sanitizeObject(body);
      } catch {
        // Fallback to sending original body if sanitization fails to prevent breaking
      }
    }
    return originalJson.call(this, body);
  };

  next();
};

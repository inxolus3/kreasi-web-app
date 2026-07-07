import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const auditLog = (actionName?: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Record log upon response completion to verify success/fail status codes
    res.on('finish', () => {
      const userId = req.user?.userId || (req.user as any)?.id || 'anonymous';
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
      const method = req.method;
      const path = req.originalUrl || req.path;
      const status = res.statusCode;
      const timestamp = new Date().toISOString();
      const action = actionName || `${method} ${path}`;

      logger.info({
        audit: true,
        action,
        userId,
        ip,
        method,
        path,
        status,
        timestamp,
      }, `Audit Log: User ${userId} performed ${action} with status ${status}`);
    });

    next();
  };
};

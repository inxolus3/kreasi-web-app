import pino from 'pino';
import { Request, Response, NextFunction } from 'express';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production' 
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
  base: {
    pid: process.pid,
    env: process.env.NODE_ENV,
  },
});

// Request logger middleware with full context (duration, IP, user-agent, user ID)
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  
  res.on('finish', () => {
    logger.info({
      method: req.method,
      path: req.path || req.originalUrl,
      statusCode: res.statusCode,
      duration: Date.now() - start,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip,
      userAgent: req.get('user-agent'),
      userId: (req as any).user?.userId || (req as any).user?.id,
    });
  });
  
  next();
}

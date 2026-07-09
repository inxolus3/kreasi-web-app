import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { logger } from '../utils/logger';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Support Bearer Authorization header OR HttpOnly cookies named 'accessToken'
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // Fallback: check cookie header manually (no cookie-parser dependency)
  if (!token && req.headers.cookie) {
    const match = req.headers.cookie.match(/(?:accessToken|access_token|kreasi_access_token)=([^;]+)/);
    if (match) token = decodeURIComponent(match[1]);
  }

  if (!token) {
    res.status(401).json({ status: 'fail', message: 'Unauthorized: No token provided' });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Token verification failed: ' + (error instanceof Error ? error.message : String(error)));
    res.status(401).json({ status: 'fail', message: 'Unauthorized: Invalid or expired token' });
    return;
  }
};

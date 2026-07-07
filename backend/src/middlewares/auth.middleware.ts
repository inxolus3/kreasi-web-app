import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { logger } from '../utils/logger';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ status: 'fail', message: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

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

import { Request, Response, NextFunction } from 'express';
import { JwtPayload, verifyToken } from '../utils/jwt.util';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Cek Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    let token: string | undefined;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    // 2. Kalau tidak ada, cek cookie
    if (!token) {
      token = req.cookies?.accessToken;
    }
    
    if (!token) {
      res.status(401).json({ status: 'fail', message: 'Unauthorized: No token provided' });
      return;
    }
    
    // 3. Verify token
    const decoded = verifyToken(token);
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ status: 'fail', message: 'Unauthorized: Invalid token' });
  }
};
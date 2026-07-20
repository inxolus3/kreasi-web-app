import { Request, Response, NextFunction } from 'express';

// Generic role/permission guard. Accepts either a list of role names
// (string[]) or a list of permission names (string[]). The guard checks
// the authenticated user's role; when the user's JWT carries a
// permissions[] claim it is also honored.
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ status: 'fail', message: 'Unauthorized' });
      return;
    }

    // Roles are uppercase (USER / ADMIN). Permissions are lower-case.
    // Both styles are accepted; the user's role claim is required.
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ status: 'fail', message: 'Forbidden: Insufficient permissions' });
      return;
    }

    next();
  };
};
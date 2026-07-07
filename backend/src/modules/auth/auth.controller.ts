import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json({ status: 'success', data: user });
    } catch (error: any) {
      if (error.message === 'User already exists') {
        res.status(400).json({ status: 'fail', message: error.message });
        return;
      }
      next(error);
    }
  };

  private getCookie(req: Request, name: string): string | undefined {
    if (!req.headers.cookie) return undefined;
    const match = req.headers.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : undefined;
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.login(req.body);
      
      const isProd = process.env.NODE_ENV === 'production';
      
      res.cookie('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.cookie('accessToken', data.accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.status(200).json({ status: 'success', data });
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        res.status(401).json({ status: 'fail', message: error.message });
        return;
      }
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'fail', message: 'Unauthorized' });
        return;
      }
      await this.authService.logout(req.user.userId);
      
      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');

      res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = this.getCookie(req, 'refreshToken') || req.body.refreshToken;
      if (!token) {
        res.status(401).json({ status: 'fail', message: 'Refresh token is required' });
        return;
      }
      const data = await this.authService.refreshToken(token);
      
      const isProd = process.env.NODE_ENV === 'production';

      res.cookie('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie('accessToken', data.accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      });

      res.status(200).json({ status: 'success', data });
    } catch (error: any) {
      if (error.message === 'Invalid refresh token') {
        res.status(401).json({ status: 'fail', message: error.message });
        return;
      }
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.forgotPassword(req.body.email);
      res.status(200).json({ status: 'success', message: 'Password reset email sent (check console for token)' });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.resetPassword(req.body);
      res.status(200).json({ status: 'success', message: 'Password reset successfully' });
    } catch (error: any) {
      if (error.message === 'Invalid or expired reset token') {
        res.status(400).json({ status: 'fail', message: error.message });
        return;
      }
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'fail', message: 'Unauthorized' });
        return;
      }
      await this.authService.changePassword(req.user.userId, req.body);
      res.status(200).json({ status: 'success', message: 'Password changed successfully' });
    } catch (error: any) {
      if (error.message === 'Invalid old password') {
        res.status(400).json({ status: 'fail', message: error.message });
        return;
      }
      next(error);
    }
  };

  getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'fail', message: 'Unauthorized' });
        return;
      }
      const user = await this.authService.getCurrentUser(req.user.userId);
      res.status(200).json({ status: 'success', data: user });
    } catch (error) {
      next(error);
    }
  };
}

import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

// ✅ TAMBAHKAN: Interface untuk response data
interface LoginData {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

interface RefreshData {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

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

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.login(req.body) as LoginData; // ✅ Type assertion
      
      const isProd = process.env.NODE_ENV === 'production';
      // Set access and refresh tokens as HttpOnly cookies
      res.cookie('accessToken', data.accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000, // 15 minutes
        path: '/',
      });
      res.cookie('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      // Return only user information; tokens are in secure cookies
      res.status(200).json({
        status: 'success',
        data: {
          user: data.user,
        }
      });
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
      const isProd = process.env.NODE_ENV === 'production';
      res.clearCookie('refreshToken', { path: '/' });
      res.clearCookie('accessToken', { path: '/' });

      res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.refreshToken || req.body.refreshToken;
      if (!token) {
        res.status(401).json({ status: 'fail', message: 'Refresh token is required' });
        return;
      }
      const data = await this.authService.refreshToken(token) as RefreshData; // ✅ Type assertion
      
      const isProd = process.env.NODE_ENV === 'production';
      // Set rotated refresh token and new access token as secure cookies
      res.cookie('accessToken', data.accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
        path: '/',
      });
      res.cookie('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      res.status(200).json({
        status: 'success',
        data: {
          user: data.user,
        }
      });
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
      res.status(200).json({ status: 'success', message: 'Password reset email sent' });
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
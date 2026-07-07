import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { UserRepository } from '../users/user.repository';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.util';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: any) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    // Exclude password from response
    const { password: _password, refreshToken: _refreshToken, resetToken: _resetToken, resetTokenExpiry: _resetTokenExpiry, ...userWithoutSecrets } = user;
    return userWithoutSecrets;
  }

  // Helper to hash tokens with SHA256 to store them securely
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async login(data: any) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const payload = { userId: user.id, role: user.role };
    const accessToken = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const hashedRefreshToken = this.hashToken(refreshToken);
    await this.userRepository.update(user.id, { refreshToken: hashedRefreshToken });

    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
  }

  async logout(userId: number) {
    await this.userRepository.update(userId, { refreshToken: null });
  }

  async refreshToken(token: string) {
    try {
      const decoded = verifyRefreshToken(token);
      const user = await this.userRepository.findById(decoded.userId);

      const tokenHash = this.hashToken(token);
      if (!user || user.refreshToken !== tokenHash) {
        throw new Error('Invalid refresh token');
      }

      const payload = { userId: user.id, role: user.role };
      const accessToken = generateToken(payload);
      const newRefreshToken = generateRefreshToken(payload);

      const hashedNewRefreshToken = this.hashToken(newRefreshToken);
      await this.userRepository.update(user.id, { refreshToken: hashedNewRefreshToken });

      return { accessToken, refreshToken: newRefreshToken };
    } catch (_error) {
      throw new Error('Invalid refresh token');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return; // Do not leak user existence
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await this.userRepository.update(user.id, {
      resetToken,
      resetTokenExpiry,
    });

    // In a real app, send an email here
    console.log(`Password reset token for ${email}: ${resetToken}`);
    return resetToken; // Returned for testing purposes
  }

  async resetPassword(data: any) {
    const user = await this.userRepository.findByResetToken(data.token);

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await this.userRepository.update(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
      refreshToken: null, // Force re-login
    });
  }

  async changePassword(userId: number, data: any) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(data.oldPassword, user.password);
    if (!isMatch) {
      throw new Error('Invalid old password');
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await this.userRepository.update(user.id, {
      password: hashedPassword,
      refreshToken: null,
    });
  }

  async getCurrentUser(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    
    const { password: _password, refreshToken: _refreshToken, resetToken: _resetToken, resetTokenExpiry: _resetTokenExpiry, ...userWithoutSecrets } = user;
    return userWithoutSecrets;
  }
}

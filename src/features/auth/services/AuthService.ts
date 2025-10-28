import { IService, ValidationError, AuthenticationError, logger } from '@core';
import { AuthRepository } from '../repositories/AuthRepository';

export interface IAuthService extends IService {
  login(email: string, password: string): Promise<any>;
  register(data: any): Promise<any>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<any>;
  updateProfile(data: any): Promise<any>;
}

export class AuthService implements IAuthService {
  constructor(private repository: AuthRepository) {}

  async initialize(): Promise<void> {
    logger.info('AuthService initialized');
  }

  cleanup(): void {
    logger.info('AuthService cleanup');
  }

  async login(email: string, password: string): Promise<any> {
    try {
      if (!email || !email.includes('@')) {
        throw new ValidationError('Invalid email address');
      }

      if (!password || password.length < 6) {
        throw new ValidationError('Password must be at least 6 characters');
      }

      const result = await this.repository.login({ email, password });
      logger.info('User logged in', { email });
      return result;
    } catch (error) {
      logger.error('Login failed', error as Error, { email });
      throw new AuthenticationError('Invalid credentials');
    }
  }

  async register(data: any): Promise<any> {
    try {
      if (!data.email || !data.email.includes('@')) {
        throw new ValidationError('Invalid email address');
      }

      if (!data.password || data.password.length < 6) {
        throw new ValidationError('Password must be at least 6 characters');
      }

      if (!data.username || data.username.length < 3) {
        throw new ValidationError('Username must be at least 3 characters');
      }

      const result = await this.repository.register(data);
      logger.info('User registered', { email: data.email });
      return result;
    } catch (error) {
      logger.error('Registration failed', error as Error, { email: data.email });
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.repository.logout();
      logger.info('User logged out');
    } catch (error) {
      logger.error('Logout failed', error as Error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<any> {
    try {
      return await this.repository.getCurrentUser();
    } catch (error) {
      logger.error('Failed to get current user', error as Error);
      throw error;
    }
  }

  async updateProfile(data: any): Promise<any> {
    try {
      const result = await this.repository.updateProfile(data);
      logger.info('Profile updated');
      return result;
    } catch (error) {
      logger.error('Failed to update profile', error as Error);
      throw error;
    }
  }
}

export const authService = new AuthService(new AuthRepository());

import { authApi, userApi } from '../store';

export class AuthRepository {
  async login(credentials: { email: string; password: string }): Promise<any> {
    const result = await authApi.endpoints.login.initiate(credentials);
    return result.data;
  }

  async register(data: any): Promise<any> {
    const result = await authApi.endpoints.register.initiate(data);
    return result.data;
  }

  async logout(): Promise<void> {
    await authApi.endpoints.logout.initiate();
  }

  async refreshToken(): Promise<any> {
    const result = await authApi.endpoints.refreshToken.initiate();
    return result.data;
  }

  async getCurrentUser(): Promise<any> {
    const result = await userApi.endpoints.getCurrentUser.initiate();
    return result.data;
  }

  async updateProfile(data: any): Promise<any> {
    const result = await userApi.endpoints.updateProfile.initiate(data);
    return result.data;
  }
}

export const authRepository = new AuthRepository();

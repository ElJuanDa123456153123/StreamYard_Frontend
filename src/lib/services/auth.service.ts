import api from './api';
import { apiClient as client } from './api';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    const authData = response.data;

    // Store tokens
    client.setAuthTokens(authData);

    return authData;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/register', credentials);
    const authData = response.data;

    // Store tokens
    client.setAuthTokens(authData);

    return authData;
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post('/auth/refresh', { refreshToken });
    const authData = response.data;

    // Update tokens
    client.setAuthTokens(authData);

    return authData;
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  logout(): void {
    client.logout();
  },

  getCurrentUser(): User | null {
    return client.getAuthUser();
  },

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      return !!token;
    }
    return false;
  },

  // Google OAuth
  getGoogleAuthUrl(): string {
    return `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  },

  async handleGoogleCallback(): Promise<AuthResponse> {
    // This is handled by redirect flow
    const response = await api.get('/auth/google/callback');
    const authData = response.data;

    // Store tokens
    apiClient.setAuthTokens(authData);

    return authData;
  },
};

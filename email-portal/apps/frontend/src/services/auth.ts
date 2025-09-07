import api from './api';
import { AuthResponse, LoginRequest, RegisterRequest, UpdatePasswordRequest, User } from '@email-portal/shared-types';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async logout(): Promise<void> {
    await api.get('/auth/logout');
    localStorage.removeItem('token');
  },

  async getMe(): Promise<User> {
    const response = await api.get<{ success: boolean; data: User }>('/auth/me');
    return response.data.data;
  },

  async updatePassword(data: UpdatePasswordRequest): Promise<AuthResponse> {
    const response = await api.put<AuthResponse>('/auth/updatepassword', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async forgotPassword(email: string): Promise<{ success: boolean; data: string }> {
    const response = await api.post('/auth/forgotpassword', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string): Promise<AuthResponse> {
    const response = await api.put<AuthResponse>(`/auth/resetpassword/${token}`, { password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
};
import api from './api';
import { ApiResponse, User, UpdateUserRequest, PaginationParams } from '@email-portal/shared-types';

export const userService = {
  async getUsers(params?: PaginationParams): Promise<ApiResponse<User[]>> {
    const response = await api.get<ApiResponse<User[]>>('/users', { params });
    return response.data;
  },

  async getUser(id: string): Promise<User> {
    const response = await api.get<{ success: boolean; data: User }>(`/users/${id}`);
    return response.data.data;
  },

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    const response = await api.put<{ success: boolean; data: User }>(`/users/${id}`, data);
    return response.data.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async getUserStats(): Promise<any> {
    const response = await api.get('/users/stats');
    return response.data.data;
  },
};
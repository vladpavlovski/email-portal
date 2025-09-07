import api from './api';
import { ApiResponse, EmailAccount, CreateEmailRequest, CreateEmailResponse, PaginationParams } from '../types';

export const emailService = {
  async getMyEmails(params?: PaginationParams): Promise<ApiResponse<EmailAccount[]>> {
    const response = await api.get<ApiResponse<EmailAccount[]>>('/emails', { params });
    return response.data;
  },

  async getAllEmails(params?: PaginationParams): Promise<ApiResponse<EmailAccount[]>> {
    const response = await api.get<ApiResponse<EmailAccount[]>>('/emails/all', { params });
    return response.data;
  },

  async getEmail(id: string): Promise<EmailAccount> {
    const response = await api.get<{ success: boolean; data: EmailAccount }>(`/emails/${id}`);
    return response.data.data;
  },

  async createEmail(data: CreateEmailRequest): Promise<CreateEmailResponse> {
    const response = await api.post<{ success: boolean; data: CreateEmailResponse }>('/emails', data);
    return response.data.data;
  },

  async deleteEmail(id: string): Promise<void> {
    await api.delete(`/emails/${id}`);
  },

  async getEmailStats(): Promise<any> {
    const response = await api.get('/emails/stats');
    return response.data.data;
  },
};
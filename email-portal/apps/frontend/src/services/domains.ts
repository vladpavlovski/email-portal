import api from './api';
import { ApiResponse, Domain, CreateDomainRequest, PaginationParams } from '@email-portal/shared-types';

export const domainService = {
  async getDomains(params?: PaginationParams): Promise<ApiResponse<Domain[]>> {
    const response = await api.get<ApiResponse<Domain[]>>('/domains', { params });
    return response.data;
  },

  async getDomain(id: string): Promise<Domain> {
    const response = await api.get<{ success: boolean; data: Domain }>(`/domains/${id}`);
    return response.data.data;
  },

  async createDomain(data: CreateDomainRequest): Promise<Domain> {
    const response = await api.post<{ success: boolean; data: Domain }>('/domains', data);
    return response.data.data;
  },

  async updateDomain(id: string, data: Partial<Domain>): Promise<Domain> {
    const response = await api.put<{ success: boolean; data: Domain }>(`/domains/${id}`, data);
    return response.data.data;
  },

  async deleteDomain(id: string): Promise<void> {
    await api.delete(`/domains/${id}`);
  },

  async getDomainStats(): Promise<any> {
    const response = await api.get('/domains/stats');
    return response.data.data;
  },
};
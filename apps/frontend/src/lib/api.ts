import axios, { AxiosError } from 'axios';
import type { 
  User, 
  LoginRequest, 
  LoginResponse,
  CreateEmailRequest,
  CreateEmailResponse,
  Domain,
  EmailAccount
} from '@mailportal/shared';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<LoginResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
  }): Promise<User> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await api.post('/auth/change-password', data);
  },
};

export const domainApi = {
  getAll: async (activeOnly = true): Promise<Domain[]> => {
    const response = await api.get('/domains', {
      params: { activeOnly },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Domain> => {
    const response = await api.get(`/domains/${id}`);
    return response.data;
  },

  create: async (data: { name: string; isActive: boolean }): Promise<Domain> => {
    const response = await api.post('/domains', data);
    return response.data;
  },

  update: async (
    id: string,
    data: { name?: string; isActive?: boolean }
  ): Promise<Domain> => {
    const response = await api.put(`/domains/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/domains/${id}`);
  },
};

export const emailAccountApi = {
  getMyAccounts: async (): Promise<EmailAccount[]> => {
    const response = await api.get('/email-accounts/my-accounts');
    return response.data;
  },

  getAll: async (filters?: {
    userId?: string;
    domainId?: string;
  }): Promise<EmailAccount[]> => {
    const response = await api.get('/email-accounts', { params: filters });
    return response.data;
  },

  create: async (data: CreateEmailRequest): Promise<CreateEmailResponse & { account: EmailAccount }> => {
    const response = await api.post('/email-accounts', data);
    return response.data;
  },

  getById: async (id: string): Promise<EmailAccount> => {
    const response = await api.get(`/email-accounts/${id}`);
    return response.data;
  },
};

export const userApi = {
  getAll: async (filters?: {
    role?: string;
    isActive?: boolean;
  }): Promise<User[]> => {
    const response = await api.get('/users', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  update: async (
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      isActive?: boolean;
      canCreateEmails?: boolean;
    }
  ): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  toggleStatus: async (id: string): Promise<User> => {
    const response = await api.post(`/users/${id}/toggle-status`);
    return response.data;
  },

  toggleEmailPermission: async (id: string): Promise<User> => {
    const response = await api.post(`/users/${id}/toggle-email-permission`);
    return response.data;
  },
};

export default api;
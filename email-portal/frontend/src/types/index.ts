export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  canCreateEmails: boolean;
  createdAt: string;
  lastLogin?: string;
  emailCount?: number;
}

export interface Domain {
  _id: string;
  name: string;
  isActive: boolean;
  description?: string;
  createdBy: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface EmailAccount {
  _id: string;
  username: string;
  domain: string | Domain;
  fullEmail: string;
  createdBy: string | User;
  quota: number;
  createdAt: string;
  status: 'active' | 'suspended' | 'deleted';
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
}

export interface ApiError {
  success: false;
  error: string;
}

export interface CreateEmailRequest {
  username: string;
  domainId: string;
}

export interface CreateEmailResponse {
  id: string;
  email: string;
  username: string;
  domain: string;
  password: string;
  quota: number;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface CreateDomainRequest {
  name: string;
  description?: string;
}

export interface UpdateUserRequest {
  isActive?: boolean;
  canCreateEmails?: boolean;
  role?: 'user' | 'admin';
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: any;
}
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  canCreateEmails: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface Domain {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailAccount {
  id: string;
  email: string;
  domainId: string;
  domain?: Domain;
  userId: string;
  user?: User;
  quota: number; // in MB
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmailRequest {
  username: string;
  domainId: string;
}

export interface CreateEmailResponse {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: UserRole;
}
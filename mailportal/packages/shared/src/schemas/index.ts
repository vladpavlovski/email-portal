import { z } from 'zod';
import { UserRole } from '../types';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const createEmailSchema = z.object({
  username: z.string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9._-]+$/, 'Username can only contain letters, numbers, dots, underscores, and hyphens'),
  domainId: z.string().uuid(),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
  canCreateEmails: z.boolean().optional(),
});

export const createDomainSchema = z.object({
  name: z.string()
    .min(3)
    .regex(/^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/, 'Invalid domain name format'),
  isActive: z.boolean().default(true),
});

export const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.nativeEnum(UserRole).default(UserRole.USER),
});
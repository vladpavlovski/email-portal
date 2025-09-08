import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { loginSchema, registerUserSchema } from '@mailportal/shared';
import { z } from 'zod';

const router: Router = Router();

// Public routes
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/register', validate(registerUserSchema), AuthController.register);

// Protected routes
router.get('/profile', authenticate, AuthController.getProfile);
router.put('/profile', authenticate, validate(z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
})), AuthController.updateProfile);

router.post('/change-password', authenticate, validate(z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
})), AuthController.changePassword);

export default router;
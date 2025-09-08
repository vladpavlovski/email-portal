import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { updateUserSchema } from '@mailportal/shared';
import { UserRole } from '@mailportal/shared';

const router: Router = Router();

// All routes require admin authentication
router.use(authenticate, authorize(UserRole.ADMIN));

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUser);
router.put('/:id', validate(updateUserSchema), UserController.updateUser);
router.post('/:id/toggle-status', UserController.toggleUserStatus);
router.post('/:id/toggle-email-permission', UserController.toggleEmailCreationPermission);

export default router;
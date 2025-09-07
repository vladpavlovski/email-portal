import { Router } from 'express';
import { EmailAccountController } from '../controllers/email-account.controller';
import { authenticate, authorize, requireEmailCreationPermission } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createEmailSchema } from '@mailportal/shared';
import { UserRole } from '@mailportal/shared';

const router = Router();

// User routes
router.get('/my-accounts', authenticate, EmailAccountController.getUserEmailAccounts);

router.post('/', 
  authenticate, 
  requireEmailCreationPermission,
  validate(createEmailSchema), 
  EmailAccountController.createEmailAccount
);

// Admin routes
router.get('/', 
  authenticate, 
  authorize(UserRole.ADMIN), 
  EmailAccountController.getAllEmailAccounts
);

router.get('/:id', authenticate, EmailAccountController.getEmailAccount);

export default router;
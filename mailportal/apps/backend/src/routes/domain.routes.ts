import { Router } from 'express';
import { DomainController } from '../controllers/domain.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createDomainSchema } from '@mailportal/shared';
import { UserRole } from '@mailportal/shared';
import { z } from 'zod';

const router = Router();

// Public route for users to see active domains
router.get('/', authenticate, DomainController.getAllDomains);
router.get('/:id', authenticate, DomainController.getDomain);

// Admin only routes
router.post('/', 
  authenticate, 
  authorize(UserRole.ADMIN), 
  validate(createDomainSchema), 
  DomainController.createDomain
);

router.put('/:id', 
  authenticate, 
  authorize(UserRole.ADMIN), 
  validate(z.object({
    name: z.string().regex(/^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/).optional(),
    isActive: z.boolean().optional(),
  })), 
  DomainController.updateDomain
);

router.delete('/:id', 
  authenticate, 
  authorize(UserRole.ADMIN), 
  DomainController.deleteDomain
);

export default router;
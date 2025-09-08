import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { EmailAccountModel } from '../models/email-account.model';
import { UserModel } from '../models/user.model';
import { DomainModel } from '../models/domain.model';
import { DirectAdminService } from '../services/directadmin.service';
import { UserRole } from '@mailportal/shared';

export class EmailAccountController {
  static async getUserEmailAccounts(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const emailAccounts = await EmailAccountModel.findByUserId(req.user.userId);
      res.json(emailAccounts);
    } catch (error) {
      console.error('Get user email accounts error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAllEmailAccounts(req: AuthRequest, res: Response) {
    try {
      const { userId, domainId } = req.query;
      
      const filters: { userId?: string; domainId?: string } = {};
      if (userId) filters.userId = userId as string;
      if (domainId) filters.domainId = domainId as string;

      const emailAccounts = await EmailAccountModel.findAll(filters);
      res.json(emailAccounts);
    } catch (error) {
      console.error('Get all email accounts error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createEmailAccount(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { username, domainId } = req.body;

      // Check if user can create emails
      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.canCreateEmails && user.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: 'You do not have permission to create email accounts' });
      }

      // Check if domain exists and is active
      const domain = await DomainModel.findById(domainId);
      if (!domain) {
        return res.status(404).json({ error: 'Domain not found' });
      }

      if (!domain.isActive) {
        return res.status(400).json({ error: 'Domain is not active' });
      }

      // Construct full email address
      const email = `${username}@${domain.name}`;

      // Check if email already exists
      const existingEmail = await EmailAccountModel.exists(email);
      if (existingEmail) {
        return res.status(409).json({ error: 'Email account already exists' });
      }

      // Generate secure password
      const password = DirectAdminService.generateSecurePassword();

      // Create email in DirectAdmin
      const directAdmin = new DirectAdminService();
      try {
        await directAdmin.createEmailAccount({
          user: username,
          domain: domain.name,
          password,
          quota: 1024, // 1GB default
        });
      } catch (daError: unknown) {
        console.error('DirectAdmin error:', daError);
        const error = daError as { message?: string };
        return res.status(500).json({ 
          error: 'Failed to create email account in DirectAdmin',
          details: error.message 
        });
      }

      // Save to database
      const emailAccount = await EmailAccountModel.create({
        email,
        domainId: domain.id,
        userId: req.user.userId,
        quota: 1024,
      });

      // Return with password (only time it's shown)
      res.status(201).json({
        email: emailAccount.email,
        password,
        account: emailAccount,
      });
    } catch (error) {
      console.error('Create email account error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getEmailAccount(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      
      const emailAccount = await EmailAccountModel.findById(id);
      if (!emailAccount) {
        return res.status(404).json({ error: 'Email account not found' });
      }

      // Check permissions
      if (req.user?.role !== UserRole.ADMIN && emailAccount.userId !== req.user?.userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json(emailAccount);
    } catch (error) {
      console.error('Get email account error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
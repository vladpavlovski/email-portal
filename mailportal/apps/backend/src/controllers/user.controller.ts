import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserModel } from '../models/user.model';
import { UserRole } from '@mailportal/shared';

export class UserController {
  static async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const { role, isActive } = req.query;
      
      const filters: any = {};
      if (role && Object.values(UserRole).includes(role as UserRole)) {
        filters.role = role as UserRole;
      }
      if (isActive !== undefined) {
        filters.isActive = isActive === 'true';
      }

      const users = await UserModel.findAll(filters);
      res.json(users);
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { firstName, lastName, isActive, canCreateEmails } = req.body;

      // Prevent users from modifying their own active status
      if (req.user?.userId === id && isActive !== undefined) {
        return res.status(403).json({ error: 'Cannot modify your own active status' });
      }

      const updateData: any = {};
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (isActive !== undefined) updateData.isActive = isActive;
      if (canCreateEmails !== undefined) updateData.canCreateEmails = canCreateEmails;

      const updatedUser = await UserModel.update(id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async toggleUserStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Prevent users from modifying their own status
      if (req.user?.userId === id) {
        return res.status(403).json({ error: 'Cannot modify your own status' });
      }

      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const updatedUser = await UserModel.update(id, {
        isActive: !user.isActive,
      });

      res.json(updatedUser);
    } catch (error) {
      console.error('Toggle user status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async toggleEmailCreationPermission(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const updatedUser = await UserModel.update(id, {
        canCreateEmails: !user.canCreateEmails,
      });

      res.json(updatedUser);
    } catch (error) {
      console.error('Toggle email creation permission error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
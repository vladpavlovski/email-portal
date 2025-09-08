import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { DomainModel } from '../models/domain.model';

export class DomainController {
  static async getAllDomains(req: AuthRequest, res: Response) {
    try {
      const { activeOnly } = req.query;
      const domains = await DomainModel.findAll(activeOnly === 'true');
      res.json(domains);
    } catch (error) {
      console.error('Get all domains error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getDomain(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      
      const domain = await DomainModel.findById(id);
      if (!domain) {
        return res.status(404).json({ error: 'Domain not found' });
      }

      res.json(domain);
    } catch (error) {
      console.error('Get domain error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createDomain(req: AuthRequest, res: Response) {
    try {
      const { name, isActive } = req.body;

      // Check if domain already exists
      const existingDomain = await DomainModel.findByName(name);
      if (existingDomain) {
        return res.status(409).json({ error: 'Domain already exists' });
      }

      const domain = await DomainModel.create({ name, isActive });
      res.status(201).json(domain);
    } catch (error) {
      console.error('Create domain error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateDomain(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { name, isActive } = req.body;

      // If updating name, check if it already exists
      if (name) {
        const existingDomain = await DomainModel.findByName(name);
        if (existingDomain && existingDomain.id !== id) {
          return res.status(409).json({ error: 'Domain name already exists' });
        }
      }

      const updateData: { name?: string; isActive?: boolean } = {};
      if (name !== undefined) updateData.name = name;
      if (isActive !== undefined) updateData.isActive = isActive;

      const updatedDomain = await DomainModel.update(id, updateData);
      if (!updatedDomain) {
        return res.status(404).json({ error: 'Domain not found' });
      }

      res.json(updatedDomain);
    } catch (error) {
      console.error('Update domain error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteDomain(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const domain = await DomainModel.findById(id);
      if (!domain) {
        return res.status(404).json({ error: 'Domain not found' });
      }

      // Note: This will cascade delete all email accounts on this domain
      await DomainModel.delete(id);
      
      res.status(204).send();
    } catch (error) {
      console.error('Delete domain error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
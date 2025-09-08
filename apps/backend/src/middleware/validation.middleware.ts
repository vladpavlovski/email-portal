import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: unknown) {
      const zodError = error as { errors?: unknown[] };
      return res.status(400).json({
        error: 'Validation failed',
        details: zodError.errors,
      });
    }
  };
}
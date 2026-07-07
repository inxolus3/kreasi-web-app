import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { logger } from '../utils/logger';

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        logger.warn('Validation error');
        res.status(400).json({
          status: 'fail',
          message: 'Validation Error',
          errors: err.errors,
        });
        return;
      }
      next(err);
    }
  };

import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

export const validate = (schemas: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(schemas.map(schema => schema.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    res.status(422).json({
      success: false,
      errors: errors.array().map(e => ({ field: (e as any).path, message: e.msg }))
    });
  };
};

import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ErrorHandler]', err.stack || err.message);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ success: false, error: err.message || 'Server Error' });
};

import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';

export function notFoundMiddleware(req: Request, _res: Response, next: NextFunction): void {
  next(ApiError.notFound('ROUTE_NOT_FOUND', `Cannot ${req.method} ${req.originalUrl}`));
}
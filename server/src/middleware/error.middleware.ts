import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError';
import { ApiErrorResponse } from '../types';
import { env } from '../config/env';

interface MongoDuplicateKeyError extends Error {
  code: number;
  keyPattern?: Record<string, unknown>;
}

function isDuplicateKeyError(err: unknown): err is MongoDuplicateKeyError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: unknown }).code === 11000
  );
}

export function errorMiddleware(err: unknown, req: Request, res: Response, _next: NextFunction): void {
 
  console.error('[error]', req.method, req.originalUrl, err);

  if (err instanceof ApiError) {
    const body: ApiErrorResponse = {
      success: false,
      error: { code: err.code, message: err.message, details: err.details },
    };
    res.status(err.statusCode).json(body);
    return;
  }

  if (err instanceof ZodError) {
    const body: ApiErrorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed.',
        details: err.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
    };
    res.status(400).json(body);
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const body: ApiErrorResponse = {
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Request validation failed.' },
    };
    res.status(400).json(body);
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    const body: ApiErrorResponse = {
      success: false,
      error: { code: 'INVALID_ID', message: 'Invalid resource identifier.' },
    };
    res.status(400).json(body);
    return;
  }

  if (isDuplicateKeyError(err)) {
    const body: ApiErrorResponse = {
      success: false,
      error: { code: 'DUPLICATE_RESOURCE', message: 'This resource already exists.' },
    };
    res.status(409).json(body);
    return;
  }

  const body: ApiErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong. Please try again.',
      details: env.nodeEnv === 'development' && err instanceof Error ? err.message : undefined,
    },
  };
  res.status(500).json(body);
}
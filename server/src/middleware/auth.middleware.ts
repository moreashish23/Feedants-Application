import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { User } from '../models/User';
import { AuthenticatedRequest, AuthTokenPayload } from '../types';


export const requireAuth = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw ApiError.unauthorized('AUTH_TOKEN_MISSING', 'Authentication token is required.');
    }

    const token = header.slice('Bearer '.length).trim();

    let payload: AuthTokenPayload;
    try {
      payload = jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
    } catch {
      throw ApiError.unauthorized('AUTH_TOKEN_INVALID', 'Authentication token is invalid or expired.');
    }

    const user = await User.findById(payload.userId).lean();
    if (!user) {
      throw ApiError.unauthorized('AUTH_USER_NOT_FOUND', 'The user for this token no longer exists.');
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    next();
  }
);

export const optionalAuth = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = header.slice('Bearer '.length).trim();

    try {
      const payload = jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
      const user = await User.findById(payload.userId).lean();
      if (user) {
        req.user = {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      }
    } catch {
      // Invalid/expired token on an optional-auth route: proceed as an
      // anonymous request rather than failing.
    }

    next();
  }
);
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { prisma } from '../config/database';
import { ApiError } from '../shared/utils/apiError';

interface JwtPayload {
  userId: string;
  email: string;
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No access token provided.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw ApiError.unauthorized('Invalid or revoked session user.');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(ApiError.unauthorized('Token expired or invalid signature.'));
    } else {
      next(err);
    }
  }
}

export function optionalAuthenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  return authenticateToken(req, res, next);
}

import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../shared/utils/apiError';
import { ApiResponse } from '../shared/utils/apiResponse';
import { logger } from '../shared/utils/logger';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(`[Error] ${req.method} ${req.url}:`, err);

  if (err instanceof ApiError) {
    return ApiResponse.error(res, {
      code: err.code,
      message: err.message,
      details: err.details,
    }, err.statusCode);
  }

  // Fallback internal error
  return ApiResponse.error(res, {
    code: 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred.' : err.message || 'Internal Error',
  }, 500);
}

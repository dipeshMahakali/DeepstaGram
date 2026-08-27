import { Response } from 'express';

export interface PaginationMeta {
  page?: number;
  limit?: number;
  total?: number;
  cursor?: string;
  hasMore?: boolean;
}

export class ApiResponse {
  static success(res: Response, data: any, message?: string, statusCode = 200, pagination?: PaginationMeta) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      pagination,
    });
  }

  static error(res: Response, error: { code: string; message: string; details?: any }, statusCode = 400) {
    return res.status(statusCode).json({
      success: false,
      error,
    });
  }
}

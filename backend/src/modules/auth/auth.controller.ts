import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { ApiResponse } from '../../shared/utils/apiResponse';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(
        req.body,
        req.headers['user-agent'],
        req.ip
      );
      return ApiResponse.success(res, result, 'Registration successful', 201);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(
        req.body,
        req.headers['user-agent'],
        req.ip
      );
      return ApiResponse.success(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.refreshToken(req.body.refreshToken);
      return ApiResponse.success(res, result, 'Token refreshed successfully');
    } catch (err) {
      next(err);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const { passwordHash, ...safeUser } = req.user!;
      return ApiResponse.success(res, { user: safeUser }, 'User profile retrieved');
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.logout(req.user!.id, req.token);
      return ApiResponse.success(res, { success: true }, 'Logout successful');
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();

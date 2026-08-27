import { Request, Response, NextFunction } from 'express';
import { userService } from './user.service';
import { ApiResponse } from '../../shared/utils/apiResponse';

export class UserController {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const target = String(req.params.usernameOrId);
      const profile = await userService.getUserProfile(
        target,
        req.user?.id
      );
      return ApiResponse.success(res, profile, 'Profile loaded');
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await userService.updateProfile(req.user!.id, req.body);
      return ApiResponse.success(res, updated, 'Profile updated');
    } catch (err) {
      next(err);
    }
  }

  async toggleFollow(req: Request, res: Response, next: NextFunction) {
    try {
      const targetId = String(req.params.userId);
      const result = await userService.toggleFollow(req.user!.id, targetId);
      return ApiResponse.success(res, result, result.isFollowing ? 'Followed user' : 'Unfollowed user');
    } catch (err) {
      next(err);
    }
  }

  async getFollowers(req: Request, res: Response, next: NextFunction) {
    try {
      const targetId = String(req.params.userId);
      const list = await userService.getFollowers(targetId);
      return ApiResponse.success(res, list, 'Followers retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getFollowing(req: Request, res: Response, next: NextFunction) {
    try {
      const targetId = String(req.params.userId);
      const list = await userService.getFollowing(targetId);
      return ApiResponse.success(res, list, 'Following list retrieved');
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();

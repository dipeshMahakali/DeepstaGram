import { Request, Response, NextFunction } from 'express';
import { reelService } from './reel.service';
import { ApiResponse } from '../../shared/utils/apiResponse';

export class ReelController {
  async getReels(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string || '10', 10);
      const cursor = req.query.cursor as string | undefined;

      const result = await reelService.getReelsFeed(limit, cursor);
      return ApiResponse.success(res, result.reels, 'Reels loaded', 200, result.pagination);
    } catch (err) {
      next(err);
    }
  }

  async createReel(req: Request, res: Response, next: NextFunction) {
    try {
      const reel = await reelService.createReel(req.user!.id, req.body);
      return ApiResponse.success(res, reel, 'Reel created', 201);
    } catch (err) {
      next(err);
    }
  }
}

export const reelController = new ReelController();

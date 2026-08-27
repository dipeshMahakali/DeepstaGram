import { Request, Response, NextFunction } from 'express';
import { feedService } from './feed.service';
import { ApiResponse } from '../../shared/utils/apiResponse';

export class FeedController {
  async getFeed(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string || '10', 10);
      const cursor = req.query.cursor as string | undefined;

      const result = await feedService.getHomeFeed(req.user?.id, limit, cursor);
      return ApiResponse.success(res, result.posts, 'Feed loaded', 200, result.pagination);
    } catch (err) {
      next(err);
    }
  }
}

export const feedController = new FeedController();

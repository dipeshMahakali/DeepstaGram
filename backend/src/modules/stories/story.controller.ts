import { Request, Response, NextFunction } from 'express';
import { storyService } from './story.service';
import { ApiResponse } from '../../shared/utils/apiResponse';

export class StoryController {
  async createStory(req: Request, res: Response, next: NextFunction) {
    try {
      const story = await storyService.createStory(req.user!.id, req.body.url, req.body.type);
      return ApiResponse.success(res, story, 'Story created', 201);
    } catch (err) {
      next(err);
    }
  }

  async getActiveStories(req: Request, res: Response, next: NextFunction) {
    try {
      const stories = await storyService.getActiveStories(req.user?.id);
      return ApiResponse.success(res, stories, 'Active stories retrieved');
    } catch (err) {
      next(err);
    }
  }

  async markViewed(req: Request, res: Response, next: NextFunction) {
    try {
      const storyId = String(req.params.storyId);
      await storyService.markStoryViewed(req.user!.id, storyId);
      return ApiResponse.success(res, { success: true }, 'Story marked as viewed');
    } catch (err) {
      next(err);
    }
  }
}

export const storyController = new StoryController();

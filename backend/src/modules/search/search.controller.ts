import { Request, Response, NextFunction } from 'express';
import { searchService } from './search.service';
import { ApiResponse } from '../../shared/utils/apiResponse';

export class SearchController {
  async searchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const q = req.query.q as string || '';
      const users = await searchService.searchUsers(q);
      return ApiResponse.success(res, users, 'Search results');
    } catch (err) {
      next(err);
    }
  }

  async explore(req: Request, res: Response, next: NextFunction) {
    try {
      const grid = await searchService.getExploreGrid();
      return ApiResponse.success(res, grid, 'Explore grid loaded');
    } catch (err) {
      next(err);
    }
  }
}

export const searchController = new SearchController();

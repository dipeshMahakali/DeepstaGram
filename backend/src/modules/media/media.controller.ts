import { Request, Response, NextFunction } from 'express';
import { mediaService } from './media.service';
import { ApiResponse } from '../../shared/utils/apiResponse';

export class MediaController {
  async uploadSingle(req: Request, res: Response, next: NextFunction) {
    try {
      const folder = (req.query.folder as string) || 'posts';
      const result = await mediaService.uploadFile(req.file, folder);
      return ApiResponse.success(res, result, 'Media uploaded successfully', 201);
    } catch (err) {
      next(err);
    }
  }
}

export const mediaController = new MediaController();

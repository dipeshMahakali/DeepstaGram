import { Request, Response, NextFunction } from 'express';
import { postService } from './post.service';
import { ApiResponse } from '../../shared/utils/apiResponse';

export class PostController {
  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await postService.createPost(req.user!.id, req.body);
      return ApiResponse.success(res, post, 'Post created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async getPost(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = String(req.params.postId);
      const post = await postService.getPostById(postId, req.user?.id);
      return ApiResponse.success(res, post, 'Post retrieved');
    } catch (err) {
      next(err);
    }
  }

  async toggleLike(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = String(req.params.postId);
      const result = await postService.toggleLike(req.user!.id, postId);
      return ApiResponse.success(res, result, result.isLiked ? 'Liked post' : 'Unliked post');
    } catch (err) {
      next(err);
    }
  }

  async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = String(req.params.postId);
      const comment = await postService.addComment(
        req.user!.id,
        postId,
        req.body.content,
        req.body.parentId
      );
      return ApiResponse.success(res, comment, 'Comment added', 201);
    } catch (err) {
      next(err);
    }
  }

  async getComments(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = String(req.params.postId);
      const comments = await postService.getComments(postId);
      return ApiResponse.success(res, comments, 'Comments retrieved');
    } catch (err) {
      next(err);
    }
  }

  async toggleSave(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = String(req.params.postId);
      const result = await postService.toggleSave(req.user!.id, postId);
      return ApiResponse.success(res, result, result.isSaved ? 'Post saved' : 'Post unsaved');
    } catch (err) {
      next(err);
    }
  }

  async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = String(req.params.postId);
      await postService.deletePost(req.user!.id, postId);
      return ApiResponse.success(res, { success: true }, 'Post deleted');
    } catch (err) {
      next(err);
    }
  }
}

export const postController = new PostController();

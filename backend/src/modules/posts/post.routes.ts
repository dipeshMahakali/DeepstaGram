import { Router } from 'express';
import { postController } from './post.controller';
import { authenticateToken, optionalAuthenticate } from '../../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateToken, (req, res, next) => postController.createPost(req, res, next));
router.get('/:postId', optionalAuthenticate, (req, res, next) => postController.getPost(req, res, next));
router.post('/:postId/like', authenticateToken, (req, res, next) => postController.toggleLike(req, res, next));
router.post('/:postId/comments', authenticateToken, (req, res, next) => postController.addComment(req, res, next));
router.get('/:postId/comments', (req, res, next) => postController.getComments(req, res, next));
router.post('/:postId/save', authenticateToken, (req, res, next) => postController.toggleSave(req, res, next));
router.delete('/:postId', authenticateToken, (req, res, next) => postController.deletePost(req, res, next));

export default router;

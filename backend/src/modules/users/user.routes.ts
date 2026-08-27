import { Router } from 'express';
import { userController } from './user.controller';
import { authenticateToken, optionalAuthenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/:usernameOrId', optionalAuthenticate, (req, res, next) => userController.getProfile(req, res, next));
router.patch('/profile', authenticateToken, (req, res, next) => userController.updateProfile(req, res, next));
router.post('/:userId/follow', authenticateToken, (req, res, next) => userController.toggleFollow(req, res, next));
router.get('/:userId/followers', (req, res, next) => userController.getFollowers(req, res, next));
router.get('/:userId/following', (req, res, next) => userController.getFollowing(req, res, next));

export default router;

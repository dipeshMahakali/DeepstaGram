import { Router } from 'express';
import { storyController } from './story.controller';
import { authenticateToken, optionalAuthenticate } from '../../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateToken, (req, res, next) => storyController.createStory(req, res, next));
router.get('/', optionalAuthenticate, (req, res, next) => storyController.getActiveStories(req, res, next));
router.post('/:storyId/view', authenticateToken, (req, res, next) => storyController.markViewed(req, res, next));

export default router;

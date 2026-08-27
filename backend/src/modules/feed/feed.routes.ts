import { Router } from 'express';
import { feedController } from './feed.controller';
import { optionalAuthenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', optionalAuthenticate, (req, res, next) => feedController.getFeed(req, res, next));

export default router;

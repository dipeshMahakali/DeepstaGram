import { Router } from 'express';
import { reelController } from './reel.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', (req, res, next) => reelController.getReels(req, res, next));
router.post('/', authenticateToken, (req, res, next) => reelController.createReel(req, res, next));

export default router;

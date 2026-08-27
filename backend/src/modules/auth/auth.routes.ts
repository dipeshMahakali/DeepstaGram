import { Router } from 'express';
import { authController } from './auth.controller';
import { validateBody } from '../../middleware/validate.middleware';
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.schema';
import { authRateLimiter } from '../../middleware/rateLimit.middleware';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

router.post('/register', authRateLimiter, validateBody(registerSchema), (req, res, next) => authController.register(req, res, next));
router.post('/login', authRateLimiter, validateBody(loginSchema), (req, res, next) => authController.login(req, res, next));
router.post('/refresh', validateBody(refreshTokenSchema), (req, res, next) => authController.refresh(req, res, next));
router.get('/me', authenticateToken, (req, res, next) => authController.me(req, res, next));
router.post('/logout', authenticateToken, (req, res, next) => authController.logout(req, res, next));

export default router;

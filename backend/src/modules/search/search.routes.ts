import { Router } from 'express';
import { searchController } from './search.controller';

const router = Router();

router.get('/users', (req, res, next) => searchController.searchUsers(req, res, next));
router.get('/explore', (req, res, next) => searchController.explore(req, res, next));

export default router;

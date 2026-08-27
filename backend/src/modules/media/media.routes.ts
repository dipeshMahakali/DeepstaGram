import { Router } from 'express';
import multer from 'multer';
import { mediaController } from './media.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed.'));
    }
  },
});

const router = Router();

router.post('/upload', authenticateToken, upload.single('file'), (req, res, next) =>
  mediaController.uploadSingle(req, res, next)
);

export default router;

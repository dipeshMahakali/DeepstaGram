import { getStorageProvider } from '../../shared/storage';
import { ApiError } from '../../shared/utils/apiError';

export class MediaService {
  async uploadFile(file?: Express.Multer.File, folder = 'posts') {
    if (!file) {
      throw ApiError.badRequest('No media file provided.');
    }

    const storage = getStorageProvider();
    const result = await storage.upload(
      {
        filename: file.originalname,
        buffer: file.buffer,
        mimetype: file.mimetype,
        size: file.size,
      },
      folder
    );

    return result;
  }
}

export const mediaService = new MediaService();

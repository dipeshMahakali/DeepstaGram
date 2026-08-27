import { prisma } from '../../config/database';
import { ApiError } from '../../shared/utils/apiError';

export class ReelService {
  async getReelsFeed(limit = 10, cursor?: string) {
    const reels = await prisma.reel.findMany({
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            isVerified: true,
          },
        },
      },
    });

    let nextCursor: string | undefined = undefined;
    if (reels.length > limit) {
      const nextItem = reels.pop();
      nextCursor = nextItem?.id;
    }

    return {
      reels,
      pagination: {
        limit,
        cursor: nextCursor,
        hasMore: !!nextCursor,
      },
    };
  }

  async createReel(userId: string, data: { videoUrl: string; thumbUrl?: string; caption?: string; audioTitle?: string; audioArtist?: string }) {
    if (!data.videoUrl) throw ApiError.badRequest('Video URL is required.');

    const reel = await prisma.reel.create({
      data: {
        userId,
        videoUrl: data.videoUrl,
        thumbUrl: data.thumbUrl,
        caption: data.caption,
        audioTitle: data.audioTitle,
        audioArtist: data.audioArtist,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return reel;
  }
}

export const reelService = new ReelService();

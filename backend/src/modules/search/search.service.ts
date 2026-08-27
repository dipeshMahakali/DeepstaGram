import { prisma } from '../../config/database';

export class SearchService {
  async searchUsers(query: string, limit = 20) {
    if (!query || !query.trim()) return [];

    const q = query.trim().toLowerCase();

    return prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q } },
          { name: { contains: q } },
        ],
      },
      take: limit,
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        isVerified: true,
        _count: {
          select: { followers: true },
        },
      },
    });
  }

  async getExploreGrid(limit = 24) {
    const posts = await prisma.post.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        media: true,
      },
    });

    const reels = await prisma.reel.findMany({
      take: limit / 2,
      orderBy: { createdAt: 'desc' },
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

    return {
      posts,
      reels,
    };
  }
}

export const searchService = new SearchService();

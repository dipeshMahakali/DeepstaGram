import { prisma } from '../../config/database';
import { ApiError } from '../../shared/utils/apiError';

export class StoryService {
  async createStory(userId: string, url: string, type: 'IMAGE' | 'VIDEO' = 'IMAGE') {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24-hour expiration time-decay

    const story = await prisma.story.create({
      data: {
        userId,
        url,
        type,
        expiresAt,
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

    return story;
  }

  async getActiveStories(currentUserId?: string) {
    const now = new Date();

    const stories = await prisma.story.findMany({
      where: {
        expiresAt: { gt: now },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        views: currentUserId
          ? {
              where: { viewerId: currentUserId },
            }
          : false,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Group stories by user
    const userStoriesMap = new Map<string, any>();

    for (const story of stories) {
      const uId = story.userId;
      if (!userStoriesMap.has(uId)) {
        userStoriesMap.set(uId, {
          id: `story_group_${uId}`,
          user: story.user,
          stories: [],
          hasUnseenStory: false,
        });
      }

      const isSeen = story.views && story.views.length > 0;
      const group = userStoriesMap.get(uId);
      group.stories.push({
        id: story.id,
        url: story.url,
        type: story.type,
        createdAt: story.createdAt,
        expiresAt: story.expiresAt,
        isSeen,
      });

      if (!isSeen) {
        group.hasUnseenStory = true;
      }
    }

    return Array.from(userStoriesMap.values());
  }

  async markStoryViewed(viewerId: string, storyId: string) {
    const story = await prisma.story.findUnique({ where: { id: storyId } });
    if (!story) throw ApiError.notFound('Story not found.');

    try {
      await prisma.storyView.create({
        data: {
          storyId,
          viewerId,
        },
      });
    } catch {
      // Ignore unique constraint if already viewed
    }

    return true;
  }
}

export const storyService = new StoryService();

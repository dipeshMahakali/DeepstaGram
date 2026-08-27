import { prisma } from '../../config/database';

export class FeedService {
  async getHomeFeed(userId?: string, limit = 10, cursor?: string) {
    let whereClause: any = {};

    if (userId) {
      // Fetch posts from followed users + self
      const following = await prisma.follow.findMany({
        where: { followerId: userId, status: 'ACCEPTED' },
        select: { followingId: true },
      });
      const followedUserIds = following.map((f) => f.followingId).concat(userId);

      whereClause = {
        userId: { in: followedUserIds },
      };
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      take: limit + 1, // Take 1 extra to determine cursor for next page
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            isVerified: true,
          },
        },
        media: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    let nextCursor: string | undefined = undefined;
    if (posts.length > limit) {
      const nextItem = posts.pop();
      nextCursor = nextItem?.id;
    }

    // Determine isLiked state for current user
    let userLikedPostIds = new Set<string>();
    let userSavedPostIds = new Set<string>();

    if (userId && posts.length > 0) {
      const postIds = posts.map((p) => p.id);
      const [userLikes, userSaves] = await Promise.all([
        prisma.like.findMany({
          where: { userId, postId: { in: postIds } },
          select: { postId: true },
        }),
        prisma.save.findMany({
          where: { userId, postId: { in: postIds } },
          select: { postId: true },
        }),
      ]);
      userLikedPostIds = new Set(userLikes.map((l) => l.postId));
      userSavedPostIds = new Set(userSaves.map((s) => s.postId));
    }

    const formattedPosts = posts.map((p) => {
      const { _count, ...postData } = p;
      return {
        ...postData,
        likesCount: _count.likes,
        commentsCount: _count.comments,
        isLiked: userLikedPostIds.has(p.id),
        isSaved: userSavedPostIds.has(p.id),
      };
    });

    return {
      posts: formattedPosts,
      pagination: {
        limit,
        cursor: nextCursor,
        hasMore: !!nextCursor,
      },
    };
  }
}

export const feedService = new FeedService();

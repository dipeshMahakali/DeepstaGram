import { prisma } from '../../config/database';
import { ApiError } from '../../shared/utils/apiError';

export class UserService {
  async getUserProfile(userIdOrUsername: string, currentUserId?: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: userIdOrUsername },
          { username: userIdOrUsername.toLowerCase() },
        ],
      },
      include: {
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      throw ApiError.notFound('User profile not found.');
    }

    let isFollowing = false;
    if (currentUserId && currentUserId !== user.id) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: user.id,
          },
        },
      });
      isFollowing = !!follow;
    }

    const { passwordHash, _count, ...safeUser } = user;

    return {
      ...safeUser,
      postsCount: _count.posts,
      followersCount: _count.followers,
      followingCount: _count.following,
      isFollowing,
      isSelf: currentUserId === user.id,
    };
  }

  async updateProfile(userId: string, data: { name?: string; bio?: string; website?: string; avatar?: string }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.bio !== undefined && { bio: data.bio.trim() }),
        ...(data.website !== undefined && { website: data.website.trim() }),
        ...(data.avatar && { avatar: data.avatar }),
      },
    });

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async toggleFollow(followerId: string, targetUserId: string) {
    if (followerId === targetUserId) {
      throw ApiError.badRequest('You cannot follow yourself.');
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      throw ApiError.notFound('Target user not found.');
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      await prisma.follow.delete({
        where: { id: existingFollow.id },
      });
      return { isFollowing: false };
    } else {
      await prisma.follow.create({
        data: {
          followerId,
          followingId: targetUserId,
          status: 'ACCEPTED',
        },
      });

      // Notification
      await prisma.notification.create({
        data: {
          recipientId: targetUserId,
          senderId: followerId,
          type: 'FOLLOW',
        },
      });

      return { isFollowing: true };
    }
  }

  async getFollowers(userId: string) {
    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            isVerified: true,
          },
        },
      },
    });
    return followers.map((f) => f.follower);
  }

  async getFollowing(userId: string) {
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            isVerified: true,
          },
        },
      },
    });
    return following.map((f) => f.following);
  }
}

export const userService = new UserService();

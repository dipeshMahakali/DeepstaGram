import { prisma } from '../../config/database';
import { ApiError } from '../../shared/utils/apiError';

export interface CreatePostData {
  caption?: string;
  location?: string;
  audioTitle?: string;
  audioArtist?: string;
  mediaUrls?: string[];
  media?: Array<{ url: string; type?: string; orderIndex?: number }>;
}

export class PostService {
  async createPost(userId: string, data: CreatePostData) {
    const rawUrls = data.mediaUrls || data.media?.map((m) => m.url) || [];
    if (!rawUrls || rawUrls.length === 0) {
      throw ApiError.badRequest('At least one media URL is required to create a post.');
    }

    const post = await prisma.post.create({
      data: {
        userId,
        caption: data.caption,
        location: data.location,
        audioTitle: data.audioTitle,
        audioArtist: data.audioArtist,
        media: {
          create: rawUrls.map((url, idx) => ({
            url,
            type: url.endsWith('.mp4') ? 'VIDEO' : 'IMAGE',
            orderIndex: idx,
          })),
        },
      },
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
      },
    });

    return post;
  }

  async getPostById(postId: string, currentUserId?: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
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
            saves: true,
          },
        },
      },
    });

    if (!post) {
      throw ApiError.notFound('Post not found.');
    }

    let isLiked = false;
    let isSaved = false;

    if (currentUserId) {
      const [like, save] = await Promise.all([
        prisma.like.findUnique({
          where: { userId_postId: { userId: currentUserId, postId } },
        }),
        prisma.save.findUnique({
          where: { userId_postId: { userId: currentUserId, postId } },
        }),
      ]);
      isLiked = !!like;
      isSaved = !!save;
    }

    const { _count, ...postData } = post;

    return {
      ...postData,
      likesCount: _count.likes,
      commentsCount: _count.comments,
      savesCount: _count.saves,
      isLiked,
      isSaved,
    };
  }

  async toggleLike(userId: string, postId: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw ApiError.notFound('Post not found.');

    const existingLike = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      const likesCount = await prisma.like.count({ where: { postId } });
      return { isLiked: false, likesCount };
    } else {
      await prisma.like.create({
        data: { userId, postId },
      });

      if (post.userId !== userId) {
        await prisma.notification.create({
          data: {
            recipientId: post.userId,
            senderId: userId,
            type: 'LIKE',
            targetId: postId,
          },
        });
      }

      const likesCount = await prisma.like.count({ where: { postId } });
      return { isLiked: true, likesCount };
    }
  }

  async addComment(userId: string, postId: string, content: string, parentId?: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw ApiError.notFound('Post not found.');

    const comment = await prisma.comment.create({
      data: {
        userId,
        postId,
        content: content.trim(),
        parentId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (post.userId !== userId) {
      await prisma.notification.create({
        data: {
          recipientId: post.userId,
          senderId: userId,
          type: 'COMMENT',
          targetId: postId,
        },
      });
    }

    return comment;
  }

  async getComments(postId: string) {
    return prisma.comment.findMany({
      where: { postId, parentId: null },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async toggleSave(userId: string, postId: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw ApiError.notFound('Post not found.');

    const existingSave = await prisma.save.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existingSave) {
      await prisma.save.delete({ where: { id: existingSave.id } });
      return { isSaved: false };
    } else {
      await prisma.save.create({
        data: { userId, postId },
      });
      return { isSaved: true };
    }
  }

  async deletePost(userId: string, postId: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw ApiError.notFound('Post not found.');
    if (post.userId !== userId) throw ApiError.forbidden('You can only delete your own posts.');

    await prisma.post.delete({ where: { id: postId } });
    return true;
  }
}

export const postService = new PostService();

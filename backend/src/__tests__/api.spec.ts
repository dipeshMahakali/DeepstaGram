import request from 'supertest';
import app from '../app';
import { prisma } from '../config/database';
import path from 'path';

describe('Deepsta Backend API Integration Tests', () => {
  let userToken: string;
  let userRefreshToken: string;
  let userId: string;
  let createdPostId: string;
  let createdStoryId: string;
  let createdReelId: string;
  let targetUserId: string;

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('System Health Check', () => {
    it('GET /health - should return 200 OK status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('Authentication Module', () => {
    it('POST /api/v1/auth/register - should create a new user account', async () => {
      const uniqueUsername = `testuser_${Date.now()}`;
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: `${uniqueUsername}@test.com`,
          username: uniqueUsername,
          name: 'Test Tester',
          password: 'Password123!',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.username).toBe(uniqueUsername);
      expect(res.body.data.tokens).toHaveProperty('accessToken');
    });

    it('POST /api/v1/auth/login - should authenticate seeded user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          identifier: 'alex_deepsta',
          password: 'Password123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.tokens).toHaveProperty('accessToken');
      expect(res.body.data.tokens).toHaveProperty('refreshToken');

      userToken = res.body.data.tokens.accessToken;
      userRefreshToken = res.body.data.tokens.refreshToken;
      userId = res.body.data.user.id;
    });

    it('GET /api/v1/auth/me - should return authenticated user context', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.username).toBe('alex_deepsta');
    });

    it('POST /api/v1/auth/refresh - should generate new access token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: userRefreshToken });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.tokens).toHaveProperty('accessToken');
    });
  });

  describe('User & Profile Module', () => {
    it('GET /api/v1/users/:usernameOrId - should return profile with stats', async () => {
      const res = await request(app).get('/api/v1/users/sarah_vibes');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.username).toBe('sarah_vibes');
      expect(res.body.data).toHaveProperty('followersCount');
      expect(res.body.data).toHaveProperty('followingCount');

      targetUserId = res.body.data.id;
    });

    it('PATCH /api/v1/users/profile - should update authenticated user bio', async () => {
      const res = await request(app)
        .patch('/api/v1/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ bio: '✨ Updated Deepsta Architect bio' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.bio).toBe('✨ Updated Deepsta Architect bio');
    });

    it('POST /api/v1/users/:userId/follow - should toggle follow state', async () => {
      const res = await request(app)
        .post(`/api/v1/users/${targetUserId}/follow`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('isFollowing');
    });

    it('GET /api/v1/users/:userId/followers - should return followers list', async () => {
      const res = await request(app).get(`/api/v1/users/${targetUserId}/followers`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('Posts & Feed Module', () => {
    it('POST /api/v1/posts - should create a new post with media', async () => {
      const res = await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          caption: 'Testing Deepsta backend post creation! 🚀 #DeepstaTech',
          location: 'San Francisco, CA',
          audioTitle: 'Deepsta Vibe (Original)',
          audioArtist: 'Deepsta Team',
          media: [
            {
              url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800',
              type: 'IMAGE',
              orderIndex: 0,
            },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      createdPostId = res.body.data.id;
    });

    it('GET /api/v1/feed - should return paginated home feed', async () => {
      const res = await request(app)
        .get('/api/v1/feed')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('GET /api/v1/posts/:postId - should retrieve post details by ID', async () => {
      const res = await request(app).get(`/api/v1/posts/${createdPostId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdPostId);
    });

    it('POST /api/v1/posts/:postId/like - should toggle post like status', async () => {
      const res = await request(app)
        .post(`/api/v1/posts/${createdPostId}/like`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('isLiked');
    });

    it('POST /api/v1/posts/:postId/comments - should add a comment to post', async () => {
      const res = await request(app)
        .post(`/api/v1/posts/${createdPostId}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ content: 'Awesome post created by automated test suite!' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.content).toBe('Awesome post created by automated test suite!');
    });

    it('GET /api/v1/posts/:postId/comments - should return post comments', async () => {
      const res = await request(app).get(`/api/v1/posts/${createdPostId}/comments`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('POST /api/v1/posts/:postId/save - should toggle save bookmark', async () => {
      const res = await request(app)
        .post(`/api/v1/posts/${createdPostId}/save`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('isSaved');
    });
  });

  describe('Stories Module', () => {
    it('POST /api/v1/stories - should upload a story item', async () => {
      const res = await request(app)
        .post('/api/v1/stories')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600',
          type: 'IMAGE',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      createdStoryId = res.body.data.id;
    });

    it('GET /api/v1/stories - should return active unexpired stories', async () => {
      const res = await request(app)
        .get('/api/v1/stories')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('POST /api/v1/stories/:storyId/view - should record story view event', async () => {
      const res = await request(app)
        .post(`/api/v1/stories/${createdStoryId}/view`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Reels Module', () => {
    it('POST /api/v1/reels - should publish a reel', async () => {
      const res = await request(app)
        .post('/api/v1/reels')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          videoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80',
          caption: 'Neon Reel Test #ReelItIn',
          audioTitle: 'Cyber Audio',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      createdReelId = res.body.data.id;
    });

    it('GET /api/v1/reels - should retrieve reels feed', async () => {
      const res = await request(app).get('/api/v1/reels');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('Search & Explore Module', () => {
    it('GET /api/v1/search/users - should query users by text', async () => {
      const res = await request(app).get('/api/v1/search/users?q=sarah');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.some((u: any) => u.username === 'sarah_vibes')).toBe(true);
    });

    it('GET /api/v1/search/explore - should return explore feed elements', async () => {
      const res = await request(app).get('/api/v1/search/explore');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('posts');
      expect(res.body.data).toHaveProperty('reels');
    });
  });

  describe('Media Upload Module', () => {
    it('POST /api/v1/media/upload - should upload single image file', async () => {
      const res = await request(app)
        .post('/api/v1/media/upload')
        .set('Authorization', `Bearer ${userToken}`)
        .attach('file', Buffer.from('fake image content'), 'test-avatar.jpg');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('url');
    });
  });
});


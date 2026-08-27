import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import { apiRateLimiter } from './middleware/rateLimit.middleware';

// Domain Routes
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import postRoutes from './modules/posts/post.routes';
import feedRoutes from './modules/feed/feed.routes';
import storyRoutes from './modules/stories/story.routes';
import reelRoutes from './modules/reels/reel.routes';
import searchRoutes from './modules/search/search.routes';
import mediaRoutes from './modules/media/media.routes';

const app = express();

// Security and Global Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiRateLimiter);

// Serve static local uploads folder
app.use('/uploads', express.static(env.LOCAL_STORAGE_PATH));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes (v1)
const apiPrefix = env.API_PREFIX;
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/posts`, postRoutes);
app.use(`${apiPrefix}/feed`, feedRoutes);
app.use(`${apiPrefix}/stories`, storyRoutes);
app.use(`${apiPrefix}/reels`, reelRoutes);
app.use(`${apiPrefix}/search`, searchRoutes);
app.use(`${apiPrefix}/media`, mediaRoutes);

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.url}`,
    },
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
